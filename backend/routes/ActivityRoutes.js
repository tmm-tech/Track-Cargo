const ActivityRoutes = require('express').Router();
const {addActivity, getAllActivities} = require('../controllers/ActivityController');


// POST /activities - add new activity log
ActivityRoutes.post('/', addActivity);

// GET /activities - get all activity logs
ActivityRoutes.get('/', getAllActivities);

module.exports = ActivityRoutes;
