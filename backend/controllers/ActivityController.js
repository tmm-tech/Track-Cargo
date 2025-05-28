const { query } = require('../config/sqlConfig');

// Add a new activity log
const addActivity = async (req, res) => {
  const { type, user_id, message, details } = req.body;

  try {
    const insertQuery = `
      INSERT INTO activity_logs (type, user_id, message, details)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const params = [type, user_id, message, details || {}];
    const result = await query(insertQuery, params);

    res.json({ success: true, activity: result.rows[0] });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all activity logs
const getAllActivities = async (req, res) => {
  try {
    const selectQuery = `SELECT * FROM activity_logs ORDER BY time DESC;`;
    const result = await query(selectQuery);
    res.json({ success: true, activities: result.rows });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addActivity,
  getAllActivities,
};
