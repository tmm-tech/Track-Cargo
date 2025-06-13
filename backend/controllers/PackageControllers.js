const { query } = require('../config/sqlConfig');
const { v4: uuidv4 } = require('uuid');

module.exports = {

  // Create a new package
  createPackage: async (req, res) => {
    try {
      const newCargo = req.body;

      const tracking_number = 'PKG-' + uuidv4().split('-')[0].toUpperCase();
      const created_at = new Date();
      const updated_at = created_at;

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

      const recipient_name = newCargo.shipping_address?.recipientName || null;
      const type = newCargo.type || 'Standard';
      const weight = newCargo.weight || null;
      const shipped_date = newCargo.shipped_date || null;
      const estimated_delivery = newCargo.estimated_delivery || null;
      const current_location = newCargo.current_location || null;
      const next_stop = newCargo.next_stop || null;
      const next_stop_eta = newCargo.next_stop_eta || null;
      const final_destination = newCargo.final_destination || null;
      const shipping_address = JSON.stringify(newCargo.shipping_address || {});

      const insertQuery = `
      INSERT INTO packages (
        container_number, truck_number, bl_number,
        recipient_name, type, weight,
        shipped_date, estimated_delivery,
        current_location, next_stop, next_stop_eta,
        final_destination, shipping_address,
        tracking_number, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

      const values = [
        container_number,
        truck_number,
        bl_number,
        recipient_name,
        type,
        weight,
        shipped_date,
        estimated_delivery,
        current_location,
        next_stop,
        next_stop_eta,
        final_destination,
        shipping_address,
        tracking_number,
        created_at,
        updated_at
      ];

      const result = await query(insertQuery, values);

      res.status(201).json({
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
      res.status(200).json({ success: true, cargo: result.rows });
    } catch (error) {
      console.error('Error fetching packages:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Get a package by ID
  getPackageById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query(`
      SELECT * FROM packages WHERE id = $1 AND is_deleted = FALSE;
    `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Package not found' });
      }

      res.status(200).json(result.rows[0]);
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
        sender_name,
        receiver_name,
        origin,
        destination,
        current_location,
        status
      } = req.body;

      const updated_at = new Date();

      const result = await query(`
      UPDATE packages SET
        sender_name = $1,
        receiver_name = $2,
        origin = $3,
        destination = $4,
        current_location = $5,
        status = $6,
        updated_at = $7
      WHERE id = $8 AND is_deleted = FALSE
      RETURNING *;
    `, [
        sender_name,
        receiver_name,
        origin,
        destination,
        current_location,
        status,
        updated_at,
        id
      ]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found or deleted' });
      }

      res.status(200).json({
        message: 'Package updated successfully',
        package: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Soft delete a package
  deletePackage: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await query(`
      UPDATE packages SET is_deleted = TRUE, updated_at = NOW()
      WHERE id = $1 RETURNING *;
    `, [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      res.status(200).json({ success: false, message: 'Package deleted successfully' });
    } catch (error) {
      console.error('Error deleting package:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Track package by tracking number
  trackPackageByTrackingNumber: async (req, res) => {
    try {
      const { tracking_number } = req.params;

      const result = await query(`
      SELECT * FROM packages
      WHERE tracking_number = $1 AND is_deleted = FALSE;
    `, [tracking_number]);

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Package not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error tracking package:', error.message);
      res.status(500).json({success: false, message: 'Internal server error' });
    }
  }
};