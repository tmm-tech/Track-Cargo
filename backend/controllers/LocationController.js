const { query } = require('../config/sqlConfig');


module.exports = {
    // Add a new location
    addLocation: async (req, res) => {
        const { name, code, type, address, city, country, coordinates, status, created_at, updated_at } = req.body;

        try {
            const insertQuery = `
      INSERT INTO locations (name, code, type, address, city, country, coordinates, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

            const params = [name, code, type, address, city, country, coordinates, status, created_at, updated_at || {}];
            const result = await query(insertQuery, params);

            res.json({ success: true, location: result.rows[0] });
        } catch (error) {
            console.error('Error adding location:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get all locations
    getAllLocations: async (req, res) => {
        try {
            const selectQuery = `SELECT * FROM locations ORDER BY created_at DESC;`;
            const result = await query(selectQuery);
            res.json({ success: true, locations: result.rows });
        } catch (error) {
            console.error('Error fetching locations:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Get a single location by ID
    getLocationById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await query(`SELECT * FROM locations WHERE id = $1;`, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            res.json({ success: true, location: result.rows[0] });
        } catch (error) {
            console.error('Error fetching location:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Update location
    updateLocation: async (req, res) => {
        const { id } = req.params;
        const { name, city, country, coordinates } = req.body;

        try {
            const updateQuery = `
      UPDATE locations
      SET name = $1, city = $2, country = $3, coordinates = $4
      WHERE id = $5
      RETURNING *;
    `;

            const params = [name, city, country, coordinates || {}, id];
            const result = await query(updateQuery, params);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            res.json({ success: true, location: result.rows[0] });
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete location
    deleteLocation: async (req, res) => {
        const { id } = req.params;

        try {
            const deleteQuery = `DELETE FROM locations WHERE id = $1 RETURNING *;`;
            const result = await query(deleteQuery, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            res.json({ success: true, message: 'Location deleted successfully' });
        } catch (error) {
            console.error('Error deleting location:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

};