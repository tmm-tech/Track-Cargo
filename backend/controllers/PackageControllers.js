const { query } = require('../config/sqlConfig');
const timestamp = new Date().toISOString();
const crypto = require("crypto");

// Helper function to insert activity log
const insertActivityLog = async (type, userId, message, details = {}) => {
  try {
    const activityQuery = `
            INSERT INTO activity_logs (type, user_id, message, details, time)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
    const params = [type, userId, message, details, timestamp];
    await query(activityQuery, params);
  } catch (error) {
    console.error('Error inserting activity log:', error);
    // Don't throw error to prevent breaking the main operation
  }
};


module.exports = {

  // Create a new package
  createPackage: async (req, res) => {
    try {
      const newCargo = req.body;
      const created_at = new Date();
      // updated_at is set to current date and time package creation
      const updated_at = new Date();
      const userId = req.user?.id || null;

      // Add prefixes
      const container_number = newCargo.container_number;
      const truck_number = newCargo.truck_number;
      const bl_number = newCargo.bl_number;
      const type = newCargo.type || 'Standard';
      const weight = newCargo.weight || null;
      const shipped_date = newCargo.shipped_date || null;
      const estimated_delivery = newCargo.estimated_delivery || null;
      const current_location = newCargo.current_location || null;
      const next_stop = newCargo.next_stop || null;
      const next_stop_eta = newCargo.next_stop_eta || null;
      const owner = newCargo.owner;
      const final_destination = newCargo.final_destination || null;
      const shipping_address_obj = newCargo.shipping_address || {};
      const shipping_address = JSON.stringify(shipping_address_obj);
      const tracking_history = newCargo.tracking_history || [];
      const status = tracking_history[0]?.status || "Created";
      const recipient_name = newCargo.recipient_name || null;
      const clearance = JSON.stringify(newCargo.clearance);
      const description = newCargo.description || null;
      const email = shipping_address_obj.email || null; // Fetch email from shipping_address object

      const insertQuery = `
      INSERT INTO packages (container_number, truck_number, bl_number, type, weight,
        shipped_date, estimated_delivery, owner,
        current_location, next_stop, next_stop_eta,
        final_destination, shipping_address, created_at, status, recipient_name,clearance,description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,$18)
      RETURNING *;
        `;

      const values = [
        container_number,
        truck_number,
        bl_number,
        type,
        weight,
        shipped_date,
        estimated_delivery,
        owner,
        current_location,
        next_stop,
        next_stop_eta,
        final_destination,
        shipping_address,
        created_at,
        status,
        recipient_name,
        clearance,
        description
      ];
      const result = await query(insertQuery, values);
      if (result.rowCount === 0) {
        return res.status(500).json({ success: false, message: 'Failed to create package' });
      }
      const packageId = result.rows[0].id;
      const rawComment = tracking_history[0]?.comment || "Package Created";
      const comments = rawComment
        ? {
          id: crypto.randomUUID(),
          author: owner,
          text: rawComment,
          timestamp: new Date().toISOString(),
        }
        : null;
      // Add the first tracking event
      const trackingEventQuery = `
      INSERT INTO tracking_events (package_id, status, location, timestamp, comment,updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
        `;
      const trackingEventValues = [
        packageId,
        tracking_history[0]?.status || 'Created',
        tracking_history[0]?.location || current_location || 'Unknown',
        tracking_history[0]?.timestamp || created_at,
        JSON.stringify(comments),
        updated_at
      ];

      const trackingEventResult = await query(trackingEventQuery, trackingEventValues);
      if (trackingEventResult.rowCount === 0) {
        return res.status(500).json({ success: false, message: 'Failed to create tracking event' });
      }

      // Insert activity log
      await insertActivityLog(
        'package_created',
        userId,
        `New package created with tracking number ${truck_number}`,
        {
          package_id: packageId,
          container_number: container_number,
          truck_number: truck_number,
          bl_number: bl_number,
          type: type,
          current_location: current_location,
          final_destination: final_destination,
          action: 'CREATE'
        }
      );

      // Send cargo dispatch email to customer
      const { sendCargoDispatch } = require('../services/SendEmailService');
      await sendCargoDispatch({
        email,
        fullname: recipient_name,
        blnNumber: bl_number,
        container_number: container_number,
        truck_number: truck_number,
        cargotype: type,
        cargoDescription: description,
        cargoWeight: weight,
        shippedDate: shipped_date,
        estimatedDelivery: estimated_delivery,
        currentLocation: current_location,
        finalDestination: final_destination
      });

      res.json({
        success: true,
        message: 'Package created successfully',
        package: result.rows[0],
        truck_number: truck_number,
      });
    } catch (error) {
      console.error('Error creating package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Get all packages (not deleted)
  getAllPackages: async (req, res) => {
    try {
      const result = await query(`
     SELECT 
  p.*,
  te.updated_at
FROM 
  packages p
LEFT JOIN LATERAL (
  SELECT updated_at
  FROM tracking_events 
  WHERE package_id = p.id 
  ORDER BY updated_at DESC 
  LIMIT 1
) te ON true
WHERE 
  p.is_deleted = FALSE
ORDER BY 
  p.created_at DESC;

    `);
      res.json({ success: true, cargo: result.rows });
    } catch (error) {
      console.error('Error fetching cargo:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },


  // Get a specific package by ID (not deleted)
  getPackageById: async (req, res) => {
    try {
      const { id } = req.params;

      // Fetch the package
      const result = await query(`
      SELECT * FROM packages
      WHERE id = $1 AND is_deleted = FALSE;
    `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      const packageData = result.rows[0];

      // Fetch all tracking history
      const trackingHistoryResult = await query(`
      SELECT * FROM tracking_events
      WHERE package_id = $1
      ORDER BY timestamp ASC;
    `, [id]);

      // Step 1: Parse all comments and collect author IDs
      let allParsedComments = [];
      let authorIdsSet = new Set();

      trackingHistoryResult.rows.forEach(event => {
        if (event.comment) {
          try {
            const raw = typeof event.comment === 'string'
              ? JSON.parse(event.comment)
              : event.comment;

            if (Array.isArray(raw)) {
              raw.forEach(c => {
                allParsedComments.push({ ...c, event_id: event.id });
                if (c.author) authorIdsSet.add(String(c.author)); // ensure string type
              });
            }
          } catch (err) {
            console.warn('Failed to parse comment array:', err.message);
          }
        }
      });

      const authorIds = Array.from(authorIdsSet);

      // Step 2: Fetch all user fullnames in one batch
      let authorsMap = {};
      if (authorIds.length > 0) {
        const userResult = await query(
          `SELECT id, fullname FROM profile WHERE id = ANY($1)`,
          [authorIds]
        );
        authorsMap = Object.fromEntries(userResult.rows.map(user => [String(user.id), user.fullname]));
      }

      // Step 3: Map comments back to their events
      const trackingHistoryWithUser = trackingHistoryResult.rows.map(event => {
        const comments = allParsedComments
          .filter(c => c.event_id === event.id)
          .map(c => ({
            id: c.id,
            text: c.text,
            timestamp: c.timestamp,
            author: c.author,
            user_fullname: c.author ? authorsMap[String(c.author)] || 'Unknown User' : 'No Comment'
          }));

        return {
          ...event,
          comments
        };
      });

      packageData.tracking_history = trackingHistoryWithUser;

      // Step 4: Fetch latest updated_at from tracking_events
      const latestUpdateResult = await query(`
      SELECT updated_at
      FROM tracking_events
      WHERE package_id = $1
      ORDER BY updated_at DESC
      LIMIT 1;
    `, [id]);

      packageData.updated_at = latestUpdateResult.rows[0]?.updated_at || null;


      res.json({ success: true, package: packageData });

    } catch (error) {
      console.error('Error fetching cargo:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },


  // Update a package
  updatePackage: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;
      const {
        container_number,
        truck_number,
        bl_number,
        type,
        description,
        weight,
        shipped_date,
        estimated_delivery,
        current_location,
        next_stop,
        next_stop_eta,
        final_destination,
        shipping_address,
        tracking_history,
        status
      } = req.body;

      const updated_at = new Date();

      // 1. Update package table
      const updateQuery = `
      UPDATE packages
      SET
        container_number = $1,
        truck_number = $2,
        bl_number = $3,
        type = $4,
        weight = $5,
        shipped_date = $6,
        estimated_delivery = $7,
        current_location = $8,
        next_stop = $9,
        next_stop_eta = $10,
        final_destination = $11,
        shipping_address = $12,
        status = $13,
        description=$14
      WHERE id = $15 AND is_deleted = FALSE
      RETURNING *;
    `;

      const values = [
        container_number,
        truck_number,
        bl_number,
        type,
        weight,
        shipped_date,
        estimated_delivery,
        current_location,
        next_stop,
        next_stop_eta,
        final_destination,
        JSON.stringify(shipping_address),     // Store as JSON
        status,
        description,
        id
      ];

      const result = await query(updateQuery, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found or deleted' });
      }

      const updatedPackage = result.rows[0];

      // 2. Add latest tracking history (optional - usually already in tracking_history)
      const latestEvent = tracking_history?.[tracking_history.length - 1];
      if (latestEvent) {
        const trackingEventQuery = `
        INSERT INTO tracking_events (
          package_id, status, location, timestamp, comment, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

        const trackingEventValues = [
          id,
          latestEvent.status || status || 'updated',
          latestEvent.location || current_location || 'unknown',
          latestEvent.timestamp || updated_at,
          typeof latestEvent.comment === 'object' ? JSON.stringify(latestEvent.comment) : latestEvent.comment,
          updated_at
        ];

        await query(trackingEventQuery, trackingEventValues);
      }

      // 3. Optional: log activity
      await insertActivityLog(
        'package_updated',
        userId,
        `Package ${container_number || truck_number || bl_number || id} was updated`,
        {
          package_id: id,
          tracking_numbers: {
            container_number,
            truck_number,
            bl_number
          },
          status,
          action: 'UPDATE'
        }
      );

      res.json({
        success: true,
        message: 'Package updated successfully',
        package: updatedPackage
      });

    } catch (error) {
      console.error('Error updating package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },


  //delete package
  deletePackage: async (req, res) => {
    const client = await pool.connect(); // assuming you're using pg Pool
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;

      await client.query('BEGIN');

      // 1. Delete tracking events linked to the package
      await client.query(`
      DELETE FROM tracking_events
      WHERE package_id = $1;
    `, [id]);

      // 2. Hard delete the package itself
      const result = await client.query(`
      DELETE FROM packages
      WHERE id = $1
      RETURNING *;
    `, [id]);

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      // 3. Log activity
      await insertActivityLog(
        'package_deleted',
        userId,
        `Package ${id} was permanently deleted`,
        {
          package_id: id,
          action: 'DELETE'
        }
      );

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Package and related tracking events permanently deleted',
        package: result.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error deleting package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
      client.release();
    }
  },



  // Track package by tracking number
  trackPackageByTrackingNumber: async (req, res) => {
    try {
      const { tracking_number } = req.params;

      // 1. Get package
      const packageResult = await query(`
      SELECT 
        p.*
      FROM 
        packages p
      LEFT JOIN LATERAL (
        SELECT updated_at 
        FROM tracking_events 
        WHERE package_id = p.id 
        ORDER BY updated_at DESC 
        LIMIT 1
      ) te ON true
      WHERE 
        (p.container_number = $1 OR 
         p.truck_number = $1 OR 
         p.bl_number = $1)
        AND p.is_deleted = FALSE
      ORDER BY 
        p.created_at DESC;
    `, [tracking_number]);

      if (packageResult.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      const foundPackage = packageResult.rows[0];

      // 2. Get tracking history for the found package
      const historyResult = await query(`
      SELECT * FROM tracking_events 
      WHERE package_id = $1
      ORDER BY timestamp ASC;
    `, [foundPackage.id]);

      foundPackage.tracking_history = historyResult.rows;

      // 3. Send full response
      res.json({ success: true, data: foundPackage });
    } catch (error) {
      console.error('Error tracking package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  //Track cargo status summary
  getCargoStatusSummary: async (req, res) => {
    try {
      const result = await query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM packages
        WHERE is_deleted = FALSE
        GROUP BY status;
      `);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error fetching cargo status summary:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
};