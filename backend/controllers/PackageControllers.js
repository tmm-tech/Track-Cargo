const { query } = require('../config/sqlConfig');
const { v4: uuidv4 } = require('uuid');

// Create a new package
const createPackage = async (req, res) => {
  try {
    const {
      sender_name,
      receiver_name,
      origin,
      destination,
      current_location,
      status
    } = req.body;

    const tracking_number = 'PKG-' + uuidv4().split('-')[0].toUpperCase();
    const created_at = new Date();
    const updated_at = created_at;

    const insertQuery = `
      INSERT INTO packages (
        sender_name, receiver_name, origin, destination,
        current_location, status, tracking_number,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const result = await query(insertQuery, [
      sender_name,
      receiver_name,
      origin,
      destination,
      current_location,
      status || 'Pending',
      tracking_number,
      created_at,
      updated_at
    ]);

    res.status(201).json({
      message: 'Package created successfully',
      package: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating package:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all packages (not deleted)
const getAllPackages = async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM packages WHERE is_deleted = FALSE ORDER BY created_at DESC;
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching packages:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a package by ID
const getPackageById = async (req, res) => {
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
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a package
const updatePackage = async (req, res) => {
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
      return res.status(404).json({ error: 'Package not found or deleted' });
    }

    res.status(200).json({
      message: 'Package updated successfully',
      package: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating package:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Soft delete a package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      UPDATE packages SET is_deleted = TRUE, updated_at = NOW()
      WHERE id = $1 RETURNING *;
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Track package by tracking number
const trackPackageByTrackingNumber = async (req, res) => {
  try {
    const { tracking_number } = req.params;

    const result = await query(`
      SELECT * FROM packages
      WHERE tracking_number = $1 AND is_deleted = FALSE;
    `, [tracking_number]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error tracking package:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  trackPackageByTrackingNumber
};