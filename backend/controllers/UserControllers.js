const { query } = require('../config/sqlConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateCreateUserSchema = require('../services/RegistrationValidation');
const { createToken } = require('../services/jwtServices');

module.exports = {
    // Create a new user
    createUser: async (req, res) => {
        const details = req.body;
        try {
            let value = await validateCreateUserSchema(details);
            let hashed_pwd = await bcrypt.hash(value.password, 8);

            const insertUserQuery = `
      INSERT INTO profile (fullname, username, email, password, roles, status, permissions, lastlogin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;

            // Provide default values if not present
            const params = [
                value.fullname,
                value.username,
                value.email,
                hashed_pwd,
                value.roles,
                value.status || 'active',
                JSON.stringify(value.permissions || []),  // Store permissions as JSON string
                value.lastLogin || null,
            ];

            const result = await query(insertUserQuery, params);

            res.json({
                success: true,
                message: 'Registration successful',
                userId: result.rows[0].id,
            });
        } catch (error) {
            console.error('Error registering user:', error);
            res
                .status(500)
                .json({ success: false, message: `Error registering user: ${error.message}` });
        }
    },

    // check if  username exists
    checkUsername: async (req, res) => {
        const { username } = req.params;
        try {
            const checkUsernameQuery = `
            SELECT * FROM profile WHERE username = $1;
        `;
            const result = await query(checkUsernameQuery, [username]);
            if (result.rows.length > 0) {
                res.json({ success: true, message: 'Username already exists' });
            } else {
                res.json({ success: false, message: 'Username is available' });
            }
        } catch (error) {
            console.error('Error checking username:', error);
            res.status(500).json({ success: false, message: `Error checking username: ${error.message}` });
        }
    },

    // Check if email exists
    checkEmail: async (req, res) => {
        const { email } = req.params;
        try {
            const checkEmailQuery = `
            SELECT * FROM profile WHERE email = $1;
        `;
            const result = await query(checkEmailQuery, [email]);
            if (result.rows.length > 0) {
                res.json({ success: true, message: 'Email already exists' });
            } else {
                res.json({ success: false, message: 'Email is available' });
            }
        } catch (error) {
            console.error('Error checking email:', error);
            res.status(500).json({ success: false, message: `Error checking email: ${error.message}` });
        }
    },


    // User login and JWT token generation
    loginUser: async (req, res) => {
        const details = req.body;
        try {
            const findUserQuery = `
                SELECT * FROM profile WHERE username = $1;
            `;
            const userResult = await query(findUserQuery, [details.username]);
            console.log('User Result:', userResult.rows);
            // Check if user exists
            if (userResult.rows.length > 0) {
                const user = userResult.rows[0];
                const match = await bcrypt.compare(details.password, user.password);

                if (match) {
                    // Create JWT Token
                    let token = await createToken({ email: user.email, id: user.id });

                    // Set token as a cookie (HttpOnly and valid for 1 hour)
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true, // Ensures cookie is sent only over HTTPS
                        sameSite: 'None', // Allows cross-site cookies
                        maxAge: 60 * 60 * 1000 // 1 hour
                    });

                    //Update last login time
                    const updateLastLoginQuery = `
                        UPDATE profile
                        SET lastlogin = NOW()
                        WHERE id = $1;
                    `;
                    await query(updateLastLoginQuery, [user.id]);
                    // Respond with user data
                    res.json({ success: true, data: user });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid Credentials Try Again' });
                }
            } else {
                res.status(401).json({ success: false, message: 'Invalid Credentials' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ success: false, message: 'Error logging in' });
        }
    },

    // Get all Users
    getAllUser: async (req, res) => {
        try {
            // SQL query to get all users where isdeleted is TRUE
            const getUserQuery = `
                SELECT * FROM profile;
            `;
            const userResult = await query(getUserQuery); // Execute the query

            if (userResult.rows.length > 0) {
                // Send the user data if found
                res.json({
                    success: true,
                    message: 'Users retrieved successfully',
                    data: userResult.rows // Send all user data
                });
            } else {
                // No users found, send a 404 response
                res.status(404).json({
                    success: false,
                    message: 'No users found'
                });
            }
        } catch (error) {
            // Log the error and send a 500 response
            console.error('Error getting users:', error);
            res.status(500).json({
                success: false,
                message: `Get User Details Error: ${error.message}`
            });
        }
    },


    getAUser: async (req, res) => {
        const { id } = req.params;
        try {
            const getUserQuery = `
                SELECT * FROM profile WHERE id = $1;
            `;
            const userResult = await query(getUserQuery, [id]);


            if (userResult.rows.length > 0) {

                res.json({ success: true, message: 'User retrieved successfully', data: userResult.rows[0] });


            } else {
                res.status(404).json({ success: false, message: 'User not found' });

            }
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({ success: false, message: `Get User Details Error: ${error.message}` });

        }
    },

    // Update user details
    updateUser: async (req, res) => {
        const { fullname, email, roles, password } = req.body;
        const { id } = req.params;

        try {
            // Build the query and parameters
            let updateUserQuery = `
            UPDATE profile
            SET fullname = $1, email = $2, roles = $3
        `;
            let params = [fullname, email, roles];

            // Check if the password is being updated
            if (password) {
                // Hash the password before updating it in the database
                const hashedPassword = await bcrypt.hash(password, 8); // Ensure bcrypt is imported
                updateUserQuery += `, password = $4`;
                params.push(hashedPassword); // Add the hashed password to the parameters
            }

            // Finalize the query
            updateUserQuery += ` WHERE id = $${params.length + 1} RETURNING *;`;
            params.push(id);

            // Execute the query
            const result = await query(updateUserQuery, params);

            if (result.rowCount > 0) {

                res.json({ success: true, message: 'User updated successfully', data: result.rows[0] });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, message: `Error updating user: ${error.message}` });
        }
    },
    // Permanently delete user
    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            // Query to get the user's email and full name before deleting
            const getUserQuery = `
            SELECT email, fullname
            FROM profile
            WHERE id = $1;
        `;
            const userResult = await query(getUserQuery, [id]);
            if (userResult.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            console.log('User found:', userResult.rows[0]);
            // Store the email and full name from the database result
            const { email, fullname } = userResult.rows[0];
            // Perform the permanent delete
            const deleteUserQuery = `
            DELETE FROM profile
            WHERE id = $1
            RETURNING *;
        `;
            const result = await query(deleteUserQuery, [id]);
            if (result.rowCount > 0) {
                // Return success response
                return res.json({ success: true, message: 'User deleted successfully', user: result.rows[0] });
            } else {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ success: false, message: `Remove User Error: ${error.message}` });
        }
    },
    // Example check for authentication in your routes (backend)
    checkAuth: (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.SECRET);
                console.log('Decoded Token:', decodedToken);
                req.user = decodedToken; // Attach decoded token data to request if needed
                res.status(200).json({ authenticated: true });
            } catch (error) {
                console.error('Token verification failed:', error);
                res.status(401).json({ authenticated: false, message: 'Invalid token.' });
            }
        } else {
            res.status(401).json({ authenticated: false, message: 'No token provided.' });
        }
    },

    refreshUserStatus: async (req, res) => {
        const { userId } = req.params;

        try {
            // Query to get the user's email and full name before deleting
            const getUserQuery = `
             SELECT email, fullname 
             FROM profile 
             WHERE id = $1;
         `;
            const userResult = await query(getUserQuery, [userId]);

            if (userResult.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Store the email and full name from the database result
            const { email, fullname } = userResult.rows[0];

            const activateUserQuery = `
                UPDATE profile 
                SET isdeleted = FALSE, status = 'active' 
                WHERE id = $1 RETURNING *;
            `;
            const result = await query(activateUserQuery, [userId]);

            if (result.rowCount > 0) {
                res.json({ success: true, message: 'Account Activated successfully', user: result.rows[0] });

            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error activating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    // User logout and token invalidation
    Logout: async (req, res) => {
        const { email } = req.params;
        try {
            const updateUserStatusQuery = `
                 SELECT * FROM profile WHERE email = $1;
            `;
            const result = await query(updateUserStatusQuery, [email]);

            if (result.rowCount > 0) {
                // Clear the token cookie
                res.clearCookie('token');
                res.json({ success: true, message: 'User logged out successfully' });
            } else {
                res.status(404).json({ success: false, message: 'User not found' });
            }
        } catch (error) {
            console.error('Error logging out:', error);
            res.status(500).json({ success: false, message: `Log Out Error: ${error.message}` });
        }
    },
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            // Check if the user exists with the provided email
            const findUserQuery = 'SELECT id, fullname, email FROM profile WHERE email = $1';
            const userResult = await query(findUserQuery, [email]);

            if (userResult.rows.length > 0) {
                const user = userResult.rows[0];

                // Notify admins of the password reset request
                await query(
                    'INSERT INTO notifications (notification_type, item_id, message, sender_id, target_role, is_read) VALUES ($1, $2, $3, $4, $5, $6)',
                    [
                        'password_reset_requested',
                        user.id,
                        `Password reset requested by ${user.fullname} (${user.email}).`,
                        user.id,  // The user's ID who requested the reset
                        'administrator',  // Notify all admins
                        false  // Not read yet
                    ]
                );

                return res.json({ success: true, message: 'Password reset link has been sent to your email.' });
            } else {
                return res.status(404).json({ success: false, message: 'Email not found.' });
            }
        } catch (error) {
            console.error('Error handling password reset:', error);
            return res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    },
};
