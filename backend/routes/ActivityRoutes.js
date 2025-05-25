const express = require('express');
const { getNotifications, updateNotificationStatus } = require('../controllers/NotificationController');

const NotificationRoutes = express.Router();

// Get all notifications for the user
NotificationRoutes.get('/', getNotifications);

// Update notification status (read/unread)
NotificationRoutes.put('/:id/status', updateNotificationStatus);

module.exports = NotificationRoutes;
