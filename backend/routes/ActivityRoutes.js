const express = require('express');
const ActivityRoutes = express.Router();
const activityController = require('../controllers/activityController');

// POST /activities - add new activity log
ActivityRoutes.post('/', activityController.addActivity);

// GET /activities - get all activity logs
ActivityRoutes.get('/', activityController.getAllActivities);

module.exports = ActivityRoutes;
