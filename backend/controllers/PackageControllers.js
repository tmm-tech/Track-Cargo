const { query } = require('../config/sqlConfig');
const { v4: uuidv4 } = require('uuid');

// Helper function to insert activity log
const insertActivityLog = async (type, userId, message, details = {}) => {
    try {
        const activityQuery = `
            INSERT INTO activity_logs (type, user_id, message, details)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const params = [type, userId, message, details];
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

      const tracking_number = 'PKG-' + uuidv4().split('-')[0].toUpperCase();
      const created_at = new Date();
      // updated_at is set to current date and time package creation
      const updated_at = new Date();

      // Add prefixes
      const container_number = newCargo.container_number
        ? `CRG-${newCargo.container_number}`
        : null;

      const truck_number = newCargo.truck_number
        ? `TRK-${newCargo.truck_number}`
        : null;

      const bl_number = newCargo.bl_number
        ? `BLN-${newCargo.bl_number}`
        : null;

      const type = newCargo.type || 'Standard';
      const weight = newCargo.weight || null;
      const shipped_date = newCargo.shipped_date || null;
      const estimated_delivery = newCargo.estimated_delivery || null;
      const current_location = newCargo.current_location || null;
      const next_stop = newCargo.next_stop || null;
      const next_stop_eta = newCargo.next_stop_eta || null;
      const final_destination = newCargo.final_destination || null;
      const shipping_address = JSON.stringify(newCargo.shipping_address || {});
      const tracking_history = JSON.stringify(newCargo.tracking_history || []);

      const insertQuery = `
      INSERT INTO packages (
        container_number, truck_number, bl_number, type, weight,
        shipped_date, estimated_delivery,
        current_location, next_stop, next_stop_eta,
        final_destination, shipping_address, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
        shipping_address,
        created_at
      ];
      const result = await query(insertQuery, values);
      if (result.rowCount === 0) {
        return res.status(500).json({ success: false, message: 'Failed to create package' });
      }
      const packageId = result.rows[0].id;
      // Add the first tracking event
      const trackingEventQuery = `
      INSERT INTO tracking_events (
        package_id, status, location, timestamp, comment,updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
      const trackingEventValues = [
        packageId,
        tracking_history[0]?.status || 'Created',
        tracking_history[0]?.location || current_location || 'Unknown',
        tracking_history[0]?.timestamp || created_at,
        tracking_history[0]?.comment || 'Package created',
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
        `New package created with tracking number ${tracking_number}`,
        {
          package_id: packageId,
          tracking_number: tracking_number,
          container_number: container_number,
          truck_number: truck_number,
          bl_number: bl_number,
          type: type,
          current_location: current_location,
          final_destination: final_destination,
          action: 'CREATE'
        }
      );


      res.json({
        success: true,
        message: 'Package created successfully',
        package: result.rows[0],
        tracking_number,
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
        te.timestamp AS latest_timestamp 
      FROM 
        packages p
      LEFT JOIN LATERAL (
        SELECT timestamp 
        FROM tracking_events 
        WHERE package_id = p.id 
        ORDER BY timestamp DESC 
        LIMIT 1
        ) te ON true
      WHERE 
        p.is_deleted = FALSE
      ORDER BY 
        p.created_at DESC;
    `);
      res.json({ success: true, cargo: result.rows });
    } catch (error) {
      console.error('Error fetching packages:', error.message);
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

      packageData.tracking_history = trackingHistoryResult.rows;

      res.json({ success: true, package: packageData });

    } catch (error) {
      console.error('Error fetching package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },


  // Update a package
  updatePackage: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        status,
        next_stop,
        next_stop_eta,
        current_location,
        comment
      } = req.body;
      const updated_at = new Date();

      const updateQuery = `
      UPDATE packages
      SET
        next_stop = $1,
        next_stop_eta = $2,
        current_location = $3
      WHERE id = $4 AND is_deleted = FALSE
      RETURNING *; 
    `;
      const values = [
        next_stop,
        next_stop_eta,
        current_location,
        id
      ];
      const result = await query(updateQuery, values);

      const trackingEventQuery = `
      INSERT INTO tracking_events (
        package_id, status, location, timestamp, comment, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *; 
    `;
      const trackingEventValues = [
        id,
        status || 'Updated',
        current_location || 'Unknown',
        updated_at,
        comment || 'Package updated',
        updated_at
      ];
      const trackingEventResult = await query(trackingEventQuery, trackingEventValues);
      if (trackingEventResult.rowCount === 0) {
        return res.status(500).json({ success: false, message: 'Failed to create tracking event' });
      }

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found or deleted' });
      }

      // Insert activity log
      await insertActivityLog(
        'package_updated',
        userId,
        `Package ${currentPackage.container_number || currentPackage.truck_number || currentPackage.bl_number || id} was updated`,
        {
          package_id: id,
          tracking_numbers: {
            container_number: currentPackage.container_number,
            truck_number: currentPackage.truck_number,
            bl_number: currentPackage.bl_number
          },
          status: status,
          changes: changes,
          comment: comment,
          action: 'UPDATE'
        }
      );

      res.json({
        message: 'Package updated successfully',
        package: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },



  // Track package by tracking number
  trackPackageByTrackingNumber: async (req, res) => {
  try {
    const { tracking_number } = req.params;

    // 1. Get package
    const packageResult = await query(`
      SELECT 
        p.*, 
        te.timestamp AS latest_timestamp 
      FROM 
        packages p
      LEFT JOIN LATERAL (
        SELECT timestamp 
        FROM tracking_events 
        WHERE package_id = p.id 
        ORDER BY timestamp DESC 
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
}

};
