const { query } = require('../config/sqlConfig');

module.exports = {
  // Get Notifications based on role and user ID
  getNotifications: async (req, res) => {
    const { role, id } = req.query; 
   
    try {
      let notifications = [];

      if (role === 'administrator') {
        // Fetch all notifications targeting administrators
        notifications = await query(
          'SELECT * FROM activity WHERE target_role = $1 ORDER BY created_at DESC',
          ['administrator']
        );
      } else if (role === 'editor') {
        // Fetch all notifications targeting the specific editor (sender_id)
        notifications = await query(
          'SELECT * FROM activity WHERE target_role = $1 AND sender_id = $2 ORDER BY created_at DESC',
          ['editor', id]
        );
      } else {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      res.status(200).json({
        message: 'Notifications retrieved successfully',
        notifications: notifications.rows,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        message: 'Error fetching notifications',
        error: error.message,
      });
    }
  },

  // Update notification status (mark as read/unread)
  updateNotificationStatus: async (req, res) => {
    const { id } = req.params; // Notification ID
    const { is_read } = req.body; // Mark as read or unread

    try {
      // Update the notification's read status
      const result = await query(
        'UPDATE notifications SET is_read = $1 WHERE id = $2 RETURNING *',
        [is_read, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json({
        message: `Notification marked as ${is_read ? 'read' : 'unread'} successfully`,
        notification: result.rows[0],
      });
    } catch (error) {
      console.error('Error updating notification status:', error);
      res.status(500).json({
        message: 'Error updating notification status',
        error: error.message,
      });
    }
  },
};
