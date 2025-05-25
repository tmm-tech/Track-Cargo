const express = require('express');
const PackageRoutes = express.Router();
const packageController = require('../controllers/packageController');

// Create a new package
PackageRoutes.post('/', packageController.createPackage);

// Get all packages (not soft-deleted)
PackageRoutes.get('/', packageController.getAllPackages);

// Get a specific package by ID
PackageRoutes.get('/:id', packageController.getPackageById);

// Update a package by ID
PackageRoutes.put('/:id', packageController.updatePackage);

// Soft delete a package by ID
PackageRoutes.delete('/:id', packageController.deletePackage);

// Track a package by tracking number
PackageRoutes.get('/track/:tracking_number', packageController.trackPackageByTrackingNumber);

module.exports = PackageRoutes;