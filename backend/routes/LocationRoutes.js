const express = require('express');
const LocationRoutes = express.Router();
const {addLocation, getAllLocations, getLocationById, updateLocation, deleteLocation} = require('../controllers/LocationController');

LocationRoutes.post('/', addLocation);
LocationRoutes.get('/', getAllLocations);
LocationRoutes.get('/:id', getLocationById);
LocationRoutes.put('/:id', updateLocation);
LocationRoutes.delete('/:id', deleteLocation);

module.exports = LocationRoutes;
