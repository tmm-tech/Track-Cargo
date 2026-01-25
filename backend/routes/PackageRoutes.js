const express = require('express');
const PackageRoutes = express.Router();
const {createPackage, getAllPackages, getPackageById, updatePackage, trackPackageByTrackingNumber, getCargoStatusSummary} = require('../controllers/PackageControllers');


// Create a new package (protected)
PackageRoutes.post('/packages', createPackage);

// Get all packages (protected)
PackageRoutes.get('/packages', getAllPackages);

// Get a specific package by ID (protected)
PackageRoutes.get('/packages/:id', getPackageById);

// Update a package by ID (protected)
PackageRoutes.put('/packages/:id', updatePackage);


// Track a package by tracking number (public)
PackageRoutes.get('/track/:tracking_number', trackPackageByTrackingNumber);

// Status summary of all cargo (protected)
PackageRoutes.get('/packages/status-summary', getCargoStatusSummary);

module.exports = PackageRoutes;
