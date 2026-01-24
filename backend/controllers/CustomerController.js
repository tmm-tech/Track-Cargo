const { query } = require('../config/sqlConfig');
const timestamp = new Date().toISOString();



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
    // Add a recurrent Customer
    createCustomer: async (req, res) => {
        try {
            const {
                name,
                phone,
                email,
                address,
                city,
                county,
                country
            } = req.body;

            if (!name || !phone) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and phone are required'
                });
            }

            // 1️⃣ Check for existing active customer
            const existingQuery = `
        SELECT * FROM customers
        WHERE is_active = TRUE
          AND (phone = $1 OR email = $2)
        LIMIT 1;
      `;
            const existingResult = await query(existingQuery, [phone, email || null]);

            if (existingResult.rowCount > 0) {
                return res.json({
                    success: true,
                    message: 'Customer already exists',
                    customer: existingResult.rows[0]
                });
            }

            // 2️⃣ Insert new customer
            const insertQuery = `
        INSERT INTO customers (
          name, phone, email, address, city, county, country, is_active, created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,TRUE,NOW())
        RETURNING *;
      `;

            const values = [
                name,
                phone,
                email || null,
                address || null,
                city || null,
                county || null,
                country || null
            ];

            const result = await query(insertQuery, values);

            res.status(201).json({
                success: true,
                message: 'Customer created successfully',
                customer: result.rows[0]
            });
        } catch (error) {
            console.error('Error creating customer:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Get all customers
    getCustomers: async (req, res) => {
        try {
            const search = req.query.search || '';

            const listQuery = `
        SELECT *
        FROM customers
        WHERE is_active = TRUE
          AND (
            name ILIKE $1
            OR phone ILIKE $1
            OR email ILIKE $1
          )
        ORDER BY name
        LIMIT 20;
      `;

            const result = await query(listQuery, [`%${search}%`]);

            res.json({
                success: true,
                customers: result.rows
            });
        } catch (error) {
            console.error('Error fetching customers:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    // Get customer by ID  
    getCustomerById: async (req, res) => {
        try {
            const { id } = req.params;

            const result = await query(
                'SELECT * FROM customers WHERE id = $1 AND is_active = TRUE',
                [id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }

            res.json({
                success: true,
                customer: result.rows[0]
            });
        } catch (error) {
            console.error('Error fetching customer:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    //Update Customer
    updateCustomer: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                phone,
                email,
                address,
                city,
                county,
                country
            } = req.body;

            const updateQuery = `
        UPDATE customers
        SET
          name = $1,
          phone = $2,
          email = $3,
          address = $4,
          city = $5,
          county = $6,
          country = $7
        WHERE id = $8
        RETURNING *;
      `;

            const result = await query(updateQuery, [
                name,
                phone,
                email,
                address,
                city,
                county,
                country,
                id
            ]);

            res.json({
                success: true,
                message: 'Customer updated successfully',
                customer: result.rows[0]
            });
        } catch (error) {
            console.error('Error updating customer:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Deactivate Customer
    deactivateCustomer: async (req, res) => {
        try {
            const { id } = req.params;

            await query(
                'UPDATE customers SET is_active = FALSE WHERE id = $1',
                [id]
            );

            res.json({
                success: true,
                message: 'Customer deactivated successfully'
            });
        } catch (error) {
            console.error('Error deactivating customer:', error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};
