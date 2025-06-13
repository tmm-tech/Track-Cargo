const express = require('express');
const PackageRoutes = express.Router();
const {createPackage, getAllPackages, getPackageById, updatePackage, deletePackage, trackPackageByTrackingNumber} = require('../controllers/PackageControllers');


// Create a new package (protected)
PackageRoutes.post('/', createPackage);

// Get all packages (protected)
PackageRoutes.get('/', getAllPackages);

// Get a specific package by ID (protected)
PackageRoutes.get('/:id', getPackageById);

// Update a package by ID (protected)
PackageRoutes.put('/:id', updatePackage);

// Soft delete a package by ID (protected)
PackageRoutes.delete('/:id', deletePackage);

// Track a package by tracking number (public)
PackageRoutes.get('/track/:tracking_number', trackPackageByTrackingNumber);

module.exports = PackageRoutes;
