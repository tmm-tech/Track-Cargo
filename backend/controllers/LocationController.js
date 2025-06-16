const { query } = require('../config/sqlConfig');

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
    // Add a new location
    addLocation: async (req, res) => {
        const { name, type, address, city, country, coordinates, status } = req.body;
        const userId = req.user?.id || null; // Assuming user info is available in req.user
        try {
            const insertQuery = `
      INSERT INTO locations (name, type, address, city, country, coordinates, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

            const params = [name, type, address, city, country, coordinates, status || {}];
            const result = await query(insertQuery, params);

            const newLocation = result.rows[0];
            // Insert activity log
            await insertActivityLog(
                'location_created',
                userId,
                `New location "${name}" was created`,
                {
                    location_id: newLocation.id,
                    location_name: name,
                    location_type: type,
                    city: city,
                    country: country,
                    action: 'CREATE'
                }
            );
            res.json({ success: true, location: newLocation });
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
        const { name, city, country, coordinates, type} = req.body;
        const userId = req.user?.id || null; // Assuming user info is available in req.user

        // First, get the current location data for comparison
        const currentLocationResult = await query(`SELECT * FROM locations WHERE id = $1;`, [id]);

        if (currentLocationResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        const currentLocation = currentLocationResult.rows[0];

        try {
            const updateQuery = `
      UPDATE locations
      SET name = $1, city = $2, country = $3, coordinates = $4, type = $5
      WHERE id = $6
      RETURNING *;
    `;

            const params = [name, city, country, coordinates || {}, id];
            const result = await query(updateQuery, params);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            const updatedLocation = result.rows[0];

            // Determine what changed for activity log
            const changes = {};
            if (currentLocation.name !== name) changes.name = { from: currentLocation.name, to: name };
            if (currentLocation.type !== type) changes.type = { from: currentLocation.type, to: type };
            if (currentLocation.address !== address) changes.address = { from: currentLocation.address, to: address };
            if (currentLocation.city !== city) changes.city = { from: currentLocation.city, to: city };
            if (currentLocation.country !== country) changes.country = { from: currentLocation.country, to: country };

            // Insert activity log
            await insertActivityLog(
                'location_updated',
                userId,
                `Location "${updatedLocation.name}" was updated`,
                {
                    location_id: id,
                    location_name: updatedLocation.name,
                    changes: changes,
                    action: 'UPDATE'
                }
            );

            res.json({ success: true, location: updatedLocation });
        } catch (error) {
            console.error('Error updating location:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Delete location
    deleteLocation: async (req, res) => {
        const { id } = req.params;
        const userId = req.user?.id || null; // Assuming user info is available in req.user
        try {
            const deleteQuery = `DELETE FROM locations WHERE id = $1 RETURNING *;`;
            const result = await query(deleteQuery, [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Location not found' });
            }

            const locationToDelete = locationResult.rows[0];

            // Insert activity log
            await insertActivityLog(
                'location_deleted',
                userId,
                `Location "${locationToDelete.name}" was deleted`,
                {
                    location_id: id,
                    location_name: locationToDelete.name,
                    location_type: locationToDelete.type,
                    city: locationToDelete.city,
                    country: locationToDelete.country,
                    action: 'DELETE',
                    deleted_data: locationToDelete
                }
            );

            res.json({ success: true, message: 'Location deleted successfully' });
        } catch (error) {
            console.error('Error deleting location:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    },

};