const { query } = require("../config/sqlConfig")
const { v4: uuidv4 } = require("uuid")
const { validationResult } = require("express-validator")

// Enhanced package controller with improved error handling and features
const PackageController = {
  // Helper method for handling database transactions
  async withTransaction(callback) {
    const client = await query.getClient()
    try {
      await client.query("BEGIN")
      const result = await callback(client)
      await client.query("COMMIT")
      return result
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  },

  // Helper method for standardized responses
  sendResponse(res, statusCode, success, message, data = null, meta = null) {
    const response = {
      success,
      message,
      timestamp: new Date().toISOString(),
    }

    if (data !== null) response.data = data
    if (meta !== null) response.meta = meta

    return res.status(statusCode).json(response)
  },

  // Helper method for handling validation errors
  handleValidationErrors(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return PackageController.sendResponse(res, 400, false, "Validation failed", null, {
        errors: errors.array(),
      })
    }
    return null
  },

  // Create a new package with enhanced features
  async createPackage(req, res) {
    try {
      // Check for validation errors
      const validationError = PackageController.handleValidationErrors(req, res)
      if (validationError) return validationError

      const {
        sender_name,
        sender_phone,
        sender_email,
        receiver_name,
        receiver_phone,
        receiver_email,
        origin,
        destination,
        current_location,
        status,
        container_number,
        truck_number,
        bl_number,
        type,
        weight,
        dimensions,
        estimated_delivery,
        shipping_address,
        special_instructions,
        declared_value,
        insurance_required,
        priority_level,
      } = req.body

      const tracking_number = "PKG-" + uuidv4().split("-")[0].toUpperCase()
      const created_at = new Date()
      const updated_at = created_at

      // Use transaction for package creation
      const result = await PackageController.withTransaction(async (client) => {
        // Insert package
        const packageResult = await client.query(
          `
          INSERT INTO packages (
            sender_name, sender_phone, sender_email,
            receiver_name, receiver_phone, receiver_email,
            origin, destination, current_location, status, tracking_number,
            container_number, truck_number, bl_number, type, weight,
            dimensions, estimated_delivery, shipping_address,
            special_instructions, declared_value, insurance_required,
            priority_level, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
          RETURNING *;
        `,
          [
            sender_name,
            sender_phone || null,
            sender_email || null,
            receiver_name,
            receiver_phone || null,
            receiver_email || null,
            origin,
            destination,
            current_location,
            status || "Package Received",
            tracking_number,
            container_number || null,
            truck_number || null,
            bl_number || null,
            type || "Standard Package",
            weight || null,
            dimensions ? JSON.stringify(dimensions) : null,
            estimated_delivery || null,
            shipping_address ? JSON.stringify(shipping_address) : null,
            special_instructions || null,
            declared_value || null,
            insurance_required || false,
            priority_level || "Standard",
            created_at,
            updated_at,
          ],
        )

        const newPackage = packageResult.rows[0]

        // Create initial tracking event
        try {
          await client.query(
            `
            INSERT INTO tracking_events (package_id, status, location, timestamp, comment, event_type)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
            [
              newPackage.id,
              status || "Package Received",
              current_location || origin,
              created_at,
              "Package created and received for processing",
              "status_update",
            ],
          )
        } catch (trackingError) {
          console.log("Tracking events table not available, skipping initial tracking event")
        }

        return newPackage
      })

      return PackageController.sendResponse(res, 201, true, "Package created successfully", result, { tracking_number })
    } catch (error) {
      console.error("Error creating package:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to create package", null, { error: error.message })
    }
  },

  // Get all packages with advanced filtering, sorting, and pagination
  async getAllPackages(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        type,
        priority_level,
        search,
        sort_by = "created_at",
        sort_order = "DESC",
        date_from,
        date_to,
        origin,
        destination,
        include_deleted = false,
      } = req.query

      const offset = (Number(page) - 1) * Number(limit)
      const queryParams = []
      let paramCount = 0
      let whereClause = include_deleted === "true" ? "WHERE 1=1" : "WHERE p.is_deleted = FALSE"

      // Build dynamic where clause
      const addFilter = (condition, value) => {
        if (value) {
          paramCount++
          whereClause += ` AND ${condition} $${paramCount}`
          queryParams.push(value)
        }
      }

      // Apply filters
      addFilter("p.status ILIKE", status ? `%${status}%` : null)
      addFilter("p.type ILIKE", type ? `%${type}%` : null)
      addFilter("p.priority_level =", priority_level)
      addFilter("p.origin ILIKE", origin ? `%${origin}%` : null)
      addFilter("p.destination ILIKE", destination ? `%${destination}%` : null)
      addFilter("p.created_at >=", date_from)
      addFilter("p.created_at <=", date_to)

      // Search across multiple fields
      if (search) {
        paramCount++
        whereClause += ` AND (
          p.tracking_number ILIKE $${paramCount} OR
          p.sender_name ILIKE $${paramCount} OR
          p.receiver_name ILIKE $${paramCount} OR
          p.container_number ILIKE $${paramCount} OR
          p.truck_number ILIKE $${paramCount} OR
          p.bl_number ILIKE $${paramCount} OR
          p.current_location ILIKE $${paramCount}
        )`
        queryParams.push(`%${search}%`)
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM packages p ${whereClause}`
      const countResult = await query(countQuery, queryParams)
      const totalCount = Number.parseInt(countResult.rows[0].count)

      // Validate sort_by to prevent SQL injection and ensure column exists
      const allowedSortFields = [
        "created_at",
        "updated_at",
        "tracking_number",
        "sender_name",
        "receiver_name",
        "origin",
        "destination",
        "status",
        "type",
        "priority_level",
      ]
      const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : "created_at"
      const safeSortOrder = ["ASC", "DESC"].includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : "DESC"

      // Main query with latest tracking info
      paramCount++
      const mainQuery = `
        SELECT p.*, 
               te.status as latest_status,
               te.location as latest_location,
               te.timestamp as latest_timestamp,
               te.comment as latest_comment,
               CASE 
                 WHEN p.estimated_delivery < NOW() AND p.status != 'Delivered' THEN true
                 ELSE false
               END as is_overdue
        FROM packages p
        LEFT JOIN LATERAL (
          SELECT status, location, timestamp, comment
          FROM tracking_events
          WHERE package_id = p.id
          ORDER BY timestamp DESC
          LIMIT 1
        ) te ON true
        ${whereClause}
        ORDER BY p.${safeSortBy} ${safeSortOrder}
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `

      queryParams.push(Number(limit), offset)
      const result = await query(mainQuery, queryParams)

      const packages = result.rows.map((pkg) => ({
        ...pkg,
        dimensions: pkg.dimensions ? JSON.parse(pkg.dimensions) : null,
        shipping_address: pkg.shipping_address ? JSON.parse(pkg.shipping_address) : null,
      }))

      return PackageController.sendResponse(res, 200, true, "Packages retrieved successfully", packages, {
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / Number(limit)),
          hasNext: Number(page) < Math.ceil(totalCount / Number(limit)),
          hasPrev: Number(page) > 1,
        },
        filters: { status, type, priority_level, search, date_from, date_to },
      })
    } catch (error) {
      console.error("Error fetching packages:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to retrieve packages", null, {
        error: error.message,
      })
    }
  },

  // Get package by ID with complete tracking history
  async getPackageById(req, res) {
    try {
      const { id } = req.params
      const { include_events = true, include_comments = true } = req.query

      // Get package details
      const packageResult = await query(
        `
        SELECT * FROM packages WHERE id = $1 AND is_deleted = FALSE;
      `,
        [id],
      )

      if (packageResult.rowCount === 0) {
        return PackageController.sendResponse(res, 404, false, "Package not found")
      }

      const packageData = packageResult.rows[0]

      // Parse JSON fields
      packageData.dimensions = packageData.dimensions ? JSON.parse(packageData.dimensions) : null
      packageData.shipping_address = packageData.shipping_address ? JSON.parse(packageData.shipping_address) : null

      // Get tracking events if requested
      if (include_events === "true") {
        try {
          const trackingResult = await query(
            `
            SELECT * FROM tracking_events 
            WHERE package_id = $1 
            ORDER BY timestamp DESC
          `,
            [id],
          )
          packageData.tracking_events = trackingResult.rows
        } catch (err) {
          console.log("Tracking events table not available")
          packageData.tracking_events = []
        }
      }

      // Get comments if requested
      if (include_comments === "true") {
        try {
          const commentsResult = await query(
            `
            SELECT pc.*, 'System User' as user_name
            FROM package_comments pc
            WHERE pc.package_id = $1
            ORDER BY pc.time DESC
          `,
            [id],
          )
          packageData.comments = commentsResult.rows
        } catch (err) {
          console.log("Comments table not available")
          packageData.comments = []
        }
      }

      // Calculate delivery metrics
      packageData.is_overdue =
        packageData.estimated_delivery &&
        new Date(packageData.estimated_delivery) < new Date() &&
        packageData.status !== "Delivered"

      return PackageController.sendResponse(res, 200, true, "Package retrieved successfully", packageData)
    } catch (error) {
      console.error("Error fetching package:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to retrieve package", null, {
        error: error.message,
      })
    }
  },

  // Update package with comprehensive tracking
  async updatePackage(req, res) {
    try {
      const validationError = PackageController.handleValidationErrors(req, res)
      if (validationError) return validationError

      const { id } = req.params
      const updateData = req.body
      const { tracking_comment, notify_customer = false } = updateData

      // Remove tracking-specific fields from update data
      delete updateData.tracking_comment
      delete updateData.notify_customer

      const updated_at = new Date()
      updateData.updated_at = updated_at

      const result = await PackageController.withTransaction(async (client) => {
        // Build dynamic update query
        const updateFields = Object.keys(updateData).filter((key) => updateData[key] !== undefined)
        const setClause = updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")
        const values = updateFields.map((field) => {
          if (field === "dimensions" || field === "shipping_address") {
            return typeof updateData[field] === "object" ? JSON.stringify(updateData[field]) : updateData[field]
          }
          return updateData[field]
        })

        const updateQuery = `
          UPDATE packages SET ${setClause}
          WHERE id = $${updateFields.length + 1} AND is_deleted = FALSE
          RETURNING *;
        `

        const packageResult = await client.query(updateQuery, [...values, id])

        if (packageResult.rowCount === 0) {
          throw new Error("Package not found or deleted")
        }

        const updatedPackage = packageResult.rows[0]

        // Add tracking event if status or location changed
        if (updateData.status || updateData.current_location) {
          try {
            await client.query(
              `
              INSERT INTO tracking_events (package_id, status, location, timestamp, comment, event_type)
              VALUES ($1, $2, $3, $4, $5, $6)
            `,
              [
                id,
                updateData.status || updatedPackage.status,
                updateData.current_location || updatedPackage.current_location,
                updated_at,
                tracking_comment || "Package information updated",
                "status_update",
              ],
            )
          } catch (trackingError) {
            console.log("Tracking events table not available, skipping tracking event")
          }
        }

        return updatedPackage
      })

      // Parse JSON fields for response
      result.dimensions = result.dimensions ? JSON.parse(result.dimensions) : null
      result.shipping_address = result.shipping_address ? JSON.parse(result.shipping_address) : null

      return PackageController.sendResponse(res, 200, true, "Package updated successfully", result)
    } catch (error) {
      console.error("Error updating package:", error)
      return PackageController.sendResponse(
        res,
        500,
        false,
        error.message === "Package not found or deleted" ? error.message : "Failed to update package",
        null,
        { error: error.message },
      )
    }
  },

  // Soft delete package with tracking
  async deletePackage(req, res) {
    try {
      const { id } = req.params
      const { reason = "Cancelled by administrator" } = req.body

      const result = await PackageController.withTransaction(async (client) => {
        const deleteResult = await client.query(
          `
          UPDATE packages SET is_deleted = TRUE, updated_at = NOW()
          WHERE id = $1 AND is_deleted = FALSE
          RETURNING *;
        `,
          [id],
        )

        if (deleteResult.rowCount === 0) {
          throw new Error("Package not found")
        }

        // Add tracking event for deletion
        try {
          await client.query(
            `
            INSERT INTO tracking_events (package_id, status, location, timestamp, comment, event_type)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
            [id, "Package Cancelled", "System", new Date(), reason, "cancellation"],
          )
        } catch (trackingError) {
          console.log("Tracking events table not available, skipping tracking event")
        }

        return deleteResult.rows[0]
      })

      return PackageController.sendResponse(res, 200, true, "Package deleted successfully", {
        id: result.id,
        tracking_number: result.tracking_number,
      })
    } catch (error) {
      console.error("Error deleting package:", error)
      return PackageController.sendResponse(
        res,
        500,
        false,
        error.message === "Package not found" ? error.message : "Failed to delete package",
        null,
        { error: error.message },
      )
    }
  },

  // Enhanced package tracking by tracking number
  async trackPackageByTrackingNumber(req, res) {
    try {
      const { tracking_number } = req.params
      const { detailed = false } = req.query

      const result = await query(
        `
        SELECT p.*,
               te.status as latest_status,
               te.location as latest_location,
               te.timestamp as latest_timestamp,
               te.comment as latest_comment
        FROM packages p
        LEFT JOIN LATERAL (
          SELECT status, location, timestamp, comment
          FROM tracking_events
          WHERE package_id = p.id
          ORDER BY timestamp DESC
          LIMIT 1
        ) te ON true
        WHERE p.tracking_number = $1 AND p.is_deleted = FALSE;
      `,
        [tracking_number],
      )

      if (result.rowCount === 0) {
        return PackageController.sendResponse(res, 404, false, "Package not found with the provided tracking number")
      }

      const packageData = result.rows[0]

      // Parse JSON fields
      packageData.dimensions = packageData.dimensions ? JSON.parse(packageData.dimensions) : null
      packageData.shipping_address = packageData.shipping_address ? JSON.parse(packageData.shipping_address) : null

      // Calculate delivery status
      packageData.is_overdue =
        packageData.estimated_delivery &&
        new Date(packageData.estimated_delivery) < new Date() &&
        packageData.status !== "Delivered"

      // Get detailed tracking history if requested
      if (detailed === "true") {
        try {
          const trackingHistory = await query(
            `
            SELECT * FROM tracking_events 
            WHERE package_id = $1 
            ORDER BY timestamp DESC
          `,
            [packageData.id],
          )

          packageData.tracking_events = trackingHistory.rows

          // Calculate tracking metrics
          packageData.tracking_metrics = {
            total_events: trackingHistory.rows.length,
            days_in_transit:
              packageData.status === "Delivered"
                ? Math.ceil(
                    (new Date(packageData.updated_at) - new Date(packageData.created_at)) / (1000 * 60 * 60 * 24),
                  )
                : Math.ceil((new Date() - new Date(packageData.created_at)) / (1000 * 60 * 60 * 24)),
            last_update: trackingHistory.rows[0]?.timestamp || packageData.updated_at,
          }
        } catch (trackingError) {
          console.log("Tracking events table not available")
          packageData.tracking_events = []
          packageData.tracking_metrics = null
        }
      }

      return PackageController.sendResponse(
        res,
        200,
        true,
        "Package tracking information retrieved successfully",
        packageData,
      )
    } catch (error) {
      console.error("Error tracking package:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to retrieve tracking information", null, {
        error: error.message,
      })
    }
  },

  // Add tracking event to existing package
  async addTrackingEvent(req, res) {
    try {
      const validationError = PackageController.handleValidationErrors(req, res)
      if (validationError) return validationError

      const { id } = req.params
      const { status, location, comment, event_type = "status_update", notify_customer = false } = req.body

      const result = await PackageController.withTransaction(async (client) => {
        // Verify package exists
        const packageCheck = await client.query(
          "SELECT id, status, current_location FROM packages WHERE id = $1 AND is_deleted = FALSE",
          [id],
        )

        if (packageCheck.rowCount === 0) {
          throw new Error("Package not found")
        }

        // Add tracking event
        const trackingResult = await client.query(
          `
          INSERT INTO tracking_events (package_id, status, location, timestamp, comment, event_type)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `,
          [id, status, location, new Date(), comment, event_type],
        )

        // Update package current location and status if provided
        if (status || location) {
          await client.query(
            `
            UPDATE packages 
            SET current_location = COALESCE($1, current_location),
                status = COALESCE($2, status),
                updated_at = NOW()
            WHERE id = $3
          `,
            [location, status, id],
          )
        }

        return trackingResult.rows[0]
      })

      return PackageController.sendResponse(res, 201, true, "Tracking event added successfully", result)
    } catch (error) {
      console.error("Error adding tracking event:", error)
      return PackageController.sendResponse(
        res,
        500,
        false,
        error.message === "Package not found" ? error.message : "Failed to add tracking event",
        null,
        { error: error.message },
      )
    }
  },

  // Get comprehensive package statistics
  async getPackageStats(req, res) {
    try {
      const { period = "30", group_by = "day" } = req.query

      const [statusStats, typeStats, priorityStats, recentActivity, totalStats, overduePackages] = await Promise.all([
        // Status distribution
        query(`
          SELECT status, COUNT(*) as count, 
                 ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
          FROM packages 
          WHERE is_deleted = FALSE
          GROUP BY status
          ORDER BY count DESC
        `),

        // Package types
        query(`
          SELECT type, COUNT(*) as count
          FROM packages 
          WHERE is_deleted = FALSE AND type IS NOT NULL
          GROUP BY type
          ORDER BY count DESC
        `),

        // Priority levels
        query(`
          SELECT priority_level, COUNT(*) as count
          FROM packages 
          WHERE is_deleted = FALSE AND priority_level IS NOT NULL
          GROUP BY priority_level
          ORDER BY count DESC
        `),

        // Recent activity based on period and grouping
        query(
          `
          SELECT 
            DATE_TRUNC($1, created_at) as period,
            COUNT(*) as packages_created,
            COUNT(*) FILTER (WHERE status = 'Delivered') as packages_delivered
          FROM packages
          WHERE created_at >= CURRENT_DATE - INTERVAL '${period} days'
            AND is_deleted = FALSE
          GROUP BY DATE_TRUNC($1, created_at)
          ORDER BY period DESC
        `,
          [group_by],
        ),

        // Total statistics
        query(`
          SELECT 
            COUNT(*) as total_packages,
            COUNT(*) FILTER (WHERE status = 'Delivered') as delivered_packages,
            COUNT(*) FILTER (WHERE status ILIKE '%transit%') as in_transit_packages,
            COUNT(*) FILTER (WHERE status = 'Package Received') as pending_packages,
            COUNT(*) FILTER (WHERE status = 'Cancelled') as cancelled_packages,
            AVG(CASE WHEN status = 'Delivered' THEN 
              EXTRACT(EPOCH FROM (updated_at - created_at))/86400 
            END) as avg_delivery_days,
            SUM(COALESCE(declared_value, 0)) as total_declared_value
          FROM packages 
          WHERE is_deleted = FALSE
        `),

        // Overdue packages
        query(`
          SELECT COUNT(*) as overdue_count
          FROM packages
          WHERE estimated_delivery < NOW() 
            AND status != 'Delivered' 
            AND is_deleted = FALSE
        `),
      ])

      return PackageController.sendResponse(
        res,
        200,
        true,
        "Package statistics retrieved successfully",
        {
          statusStats: statusStats.rows,
          typeStats: typeStats.rows,
          priorityStats: priorityStats.rows,
          recentActivity: recentActivity.rows,
          totalStats: {
            ...totalStats.rows[0],
            avg_delivery_days: totalStats.rows[0].avg_delivery_days
              ? Number.parseFloat(totalStats.rows[0].avg_delivery_days).toFixed(1)
              : null,
            overdue_count: Number.parseInt(overduePackages.rows[0].overdue_count),
          },
        },
        {
          period: `${period} days`,
          group_by,
          generated_at: new Date().toISOString(),
        },
      )
    } catch (error) {
      console.error("Error fetching package stats:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to retrieve package statistics", null, {
        error: error.message,
      })
    }
  },

  // Advanced search with filters
  async searchPackages(req, res) {
    try {
      const { q: searchTerm, limit = 20, include_deleted = false } = req.query

      if (!searchTerm || searchTerm.trim().length < 2) {
        return PackageController.sendResponse(res, 400, false, "Search term must be at least 2 characters long")
      }

      const whereClause = include_deleted === "true" ? "WHERE" : "WHERE p.is_deleted = FALSE AND"

      const result = await query(
        `
        SELECT p.*,
               te.status as latest_status,
               te.location as latest_location,
               te.timestamp as latest_timestamp,
               ts_rank(to_tsvector('english', 
                 COALESCE(p.tracking_number, '') || ' ' ||
                 COALESCE(p.sender_name, '') || ' ' ||
                 COALESCE(p.receiver_name, '') || ' ' ||
                 COALESCE(p.container_number, '') || ' ' ||
                 COALESCE(p.current_location, '')
               ), plainto_tsquery('english', $1)) as relevance_score
        FROM packages p
        LEFT JOIN LATERAL (
          SELECT status, location, timestamp
          FROM tracking_events
          WHERE package_id = p.id
          ORDER BY timestamp DESC
          LIMIT 1
        ) te ON true
        ${whereClause} (
          p.tracking_number ILIKE $2 OR
          p.sender_name ILIKE $2 OR
          p.receiver_name ILIKE $2 OR
          p.container_number ILIKE $2 OR
          p.truck_number ILIKE $2 OR
          p.bl_number ILIKE $2 OR
          p.current_location ILIKE $2 OR
          to_tsvector('english', 
            COALESCE(p.tracking_number, '') || ' ' ||
            COALESCE(p.sender_name, '') || ' ' ||
            COALESCE(p.receiver_name, '')
          ) @@ plainto_tsquery('english', $1)
        )
        ORDER BY relevance_score DESC, p.created_at DESC
        LIMIT $3
      `,
        [searchTerm.trim(), `%${searchTerm.trim()}%`, Number(limit)],
      )

      const packages = result.rows.map((pkg) => ({
        ...pkg,
        dimensions: pkg.dimensions ? JSON.parse(pkg.dimensions) : null,
        shipping_address: pkg.shipping_address ? JSON.parse(pkg.shipping_address) : null,
      }))

      return PackageController.sendResponse(
        res,
        200,
        true,
        `Found ${packages.length} packages matching your search`,
        packages,
        {
          search_term: searchTerm.trim(),
          result_count: packages.length,
          max_results: Number(limit),
        },
      )
    } catch (error) {
      console.error("Error searching packages:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to search packages", null, {
        error: error.message,
      })
    }
  },

  // Bulk operations for packages
  async bulkUpdatePackages(req, res) {
    try {
      const { package_ids, updates, add_tracking_event = false } = req.body

      if (!package_ids || !Array.isArray(package_ids) || package_ids.length === 0) {
        return PackageController.sendResponse(res, 400, false, "Package IDs array is required")
      }

      if (!updates || Object.keys(updates).length === 0) {
        return PackageController.sendResponse(res, 400, false, "Updates object is required")
      }

      const result = await PackageController.withTransaction(async (client) => {
        const updated_at = new Date()
        updates.updated_at = updated_at

        // Build dynamic update query
        const updateFields = Object.keys(updates)
        const setClause = updateFields.map((field, index) => `${field} = $${index + 1}`).join(", ")
        const values = updateFields.map((field) => updates[field])

        const placeholders = package_ids.map((_, index) => `$${updateFields.length + index + 1}`).join(", ")

        const updateQuery = `
          UPDATE packages SET ${setClause}
          WHERE id IN (${placeholders}) AND is_deleted = FALSE
          RETURNING id, tracking_number, status;
        `

        const updateResult = await client.query(updateQuery, [...values, ...package_ids])

        // Add tracking events if requested
        if (add_tracking_event && (updates.status || updates.current_location)) {
          const trackingPromises = updateResult.rows.map((pkg) =>
            client
              .query(
                `
              INSERT INTO tracking_events (package_id, status, location, timestamp, comment, event_type)
              VALUES ($1, $2, $3, $4, $5, $6)
            `,
                [
                  pkg.id,
                  updates.status || pkg.status,
                  updates.current_location || "System Update",
                  updated_at,
                  "Bulk update operation",
                  "bulk_update",
                ],
              )
              .catch((err) => console.log("Tracking event failed for package", pkg.id)),
          )

          await Promise.allSettled(trackingPromises)
        }

        return updateResult.rows
      })

      return PackageController.sendResponse(res, 200, true, `Successfully updated ${result.length} packages`, result, {
        requested_count: package_ids.length,
        updated_count: result.length,
        updates_applied: updates,
      })
    } catch (error) {
      console.error("Error in bulk update:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to perform bulk update", null, {
        error: error.message,
      })
    }
  },

  // Export packages to CSV
  async exportPackages(req, res) {
    try {
      const { format = "csv", status, date_from, date_to } = req.query

      let whereClause = "WHERE is_deleted = FALSE"
      const queryParams = []
      let paramCount = 0

      if (status) {
        paramCount++
        whereClause += ` AND status ILIKE $${paramCount}`
        queryParams.push(`%${status}%`)
      }

      if (date_from) {
        paramCount++
        whereClause += ` AND created_at >= $${paramCount}`
        queryParams.push(date_from)
      }

      if (date_to) {
        paramCount++
        whereClause += ` AND created_at <= $${paramCount}`
        queryParams.push(date_to)
      }

      const result = await query(
        `
        SELECT 
          tracking_number, sender_name, receiver_name, origin, destination,
          current_location, status, type, weight, priority_level,
          created_at, updated_at, estimated_delivery
        FROM packages 
        ${whereClause}
        ORDER BY created_at DESC
      `,
        queryParams,
      )

      if (format === "json") {
        return PackageController.sendResponse(res, 200, true, "Packages exported successfully", result.rows, {
          export_format: "json",
          record_count: result.rows.length,
          exported_at: new Date().toISOString(),
        })
      }

      // CSV format
      const csvHeader =
        "Tracking Number,Sender Name,Receiver Name,Origin,Destination,Current Location,Status,Type,Weight,Priority,Created At,Updated At,Estimated Delivery\n"
      const csvRows = result.rows
        .map(
          (row) =>
            `"${row.tracking_number}","${row.sender_name}","${row.receiver_name}","${row.origin}","${row.destination}","${row.current_location}","${row.status}","${row.type || ""}","${row.weight || ""}","${row.priority_level}","${row.created_at}","${row.updated_at}","${row.estimated_delivery || ""}"`,
        )
        .join("\n")

      const csvContent = csvHeader + csvRows

      res.setHeader("Content-Type", "text/csv")
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="packages_export_${new Date().toISOString().split("T")[0]}.csv"`,
      )

      return res.status(200).send(csvContent)
    } catch (error) {
      console.error("Error exporting packages:", error)
      return PackageController.sendResponse(res, 500, false, "Failed to export packages", null, {
        error: error.message,
      })
    }
  },
}

module.exports = PackageController