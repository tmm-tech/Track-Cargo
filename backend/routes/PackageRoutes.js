const express = require("express")
const PackageRoute = express.Router()
const { trackPackageByTrackingNumber, createPackage,getAllPackages,getPackageStats, exportPackages, addTrackingEvent,  updatePackage, deletePackage, searchPackages,bulkUpdatePackages,  getPackageById} = require("../controllers/PackageControllers")
const {
  validatePackageCreation,
  validatePackageUpdate,
  validateTrackingEvent,
  validateSearch,
  validateBulkUpdate,
  validateExport,
} = require("../middleware/packageValidation")
const { rateLimiter, trackingRateLimiter } = require("../middleware/rateLimiter")
const { logRequest } = require("../middleware/logging")



// Apply logging middleware to all routes
PackageRoute.use(logRequest)

// Public routes (no authentication required)
// Track package by tracking number - with rate limiting for public access
PackageRoute.get("/track/:tracking_number", trackingRateLimiter, trackPackageByTrackingNumber)



// Package CRUD operations
PackageRoute.post(
  "/packages",
  rateLimiter,
  validatePackageCreation,
  createPackage,
)

PackageRoute.get("/packages", rateLimiter, getAllPackages)

PackageRoute.get("/packages/stats", requireRole(["admin", "manager"]), getPackageStats)

PackageRoute.get("/packages/search", validateSearch, searchPackages)

PackageRoute.get("/packages/export", validateExport, requireRole(["admin", "manager"]), exportPackages)

PackageRoute.get("/packages/:id", getPackageById)

PackageRoute.put("/packages/:id", validatePackageUpdate, requireRole(["admin", "operator"]), updatePackage)

PackageRoute.delete("/packages/:id", requireRole(["admin"]), deletePackage)

// Tracking operations
PackageRoute.post(
  "/packages/:id/tracking",
  validateTrackingEvent,
  requireRole(["admin", "operator"]),
  addTrackingEvent,
)

// Bulk operations
PackageRoute.put(
  "/packages/bulk",
  validateBulkUpdate,
  requireRole(["admin", "manager"]),
  bulkUpdatePackages,
)

// Advanced routes
PackageRoute.get("/packages/:id/timeline", async (req, res) => {
  // Get package with detailed tracking timeline
  req.query.include_events = "true"
  req.query.include_comments = "true"
  return getPackageById(req, res)
})

// Health check endpoint
PackageRoute.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Package API is healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  })
})

// API documentation endpoint
PackageRoute.get("/docs", (req, res) => {
  res.json({
    success: true,
    message: "Package Management API Documentation",
    version: "2.0.0",
    endpoints: {
      public: {
        "GET /track/:tracking_number": "Track package by tracking number",
      },
      authenticated: {
        "POST /packages": "Create new package",
        "GET /packages": "Get all packages with filtering",
        "GET /packages/:id": "Get package by ID",
        "PUT /packages/:id": "Update package",
        "DELETE /packages/:id": "Delete package (admin only)",
        "POST /packages/:id/tracking": "Add tracking event",
        "GET /packages/search": "Search packages",
        "GET /packages/stats": "Get package statistics (admin/manager)",
        "PUT /packages/bulk": "Bulk update packages (admin/manager)",
        "GET /packages/export": "Export packages (admin/manager)",
      },
    },
    rate_limits: {
      general: "100 requests per 15 minutes",
      tracking: "50 requests per 15 minutes",
    },
  })
})

// Error handling middleware for this PackageRoute
PackageRoute.use((error, req, res, next) => {
  console.error("Package routes error:", error)

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      timestamp: new Date().toISOString(),
    })
  }

  if (error.code === "23505") {
    // PostgreSQL unique violation
    return res.status(409).json({
      success: false,
      message: "Duplicate entry detected",
      timestamp: new Date().toISOString(),
    })
  }

  res.status(500).json({
    success: false,
    message: "Internal server error in package operations",
    timestamp: new Date().toISOString(),
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  })
})

module.exports = PackageRoute