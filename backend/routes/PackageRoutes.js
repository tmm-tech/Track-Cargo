const express = require("express")
const PackageRoute = express.Router()
const { trackPackageByTrackingNumber, createPackage,getAllPackages,getPackageStats, exportPackages, updatePackage, deletePackage} = require("../controllers/PackageControllers")
const {
  validatePackageCreation,
  validatePackageUpdate,
  validateTrackingEvent,
  validateSearch,
  validateBulkUpdate,
  validateExport,
} = require("../middleware/packageValidation")
const { rateLimiter, trackingRateLimiter } = require("../middleware/rateLimiter")
const { authenticateToken, requireRole } = require("../middleware/auth")
const { logRequest } = require("../middleware/logging")



// Apply logging middleware to all routes
PackageRoute.use(logRequest)

// Public routes (no authentication required)
// Track package by tracking number - with rate limiting for public access
router.get("/track/:tracking_number", trackingRateLimiter, trackPackageByTrackingNumber)

// Protected routes (authentication required)
router.use(authenticateToken) // Apply authentication to all routes below

// Package CRUD operations
router.post(
  "/packages",
  rateLimiter,
  validatePackageCreation,
  requireRole(["admin", "operator"]),
  createPackage,
)

router.get("/packages", rateLimiter, getAllPackages)

router.get("/packages/stats", requireRole(["admin", "manager"]), getPackageStats)

router.get("/packages/search", validateSearch, PackageController.searchPackages)

router.get("/packages/export", validateExport, requireRole(["admin", "manager"]), exportPackages)

router.get("/packages/:id", PackageController.getPackageById)

router.put("/packages/:id", validatePackageUpdate, requireRole(["admin", "operator"]), updatePackage)

router.delete("/packages/:id", requireRole(["admin"]), deletePackage)

// Tracking operations
router.post(
  "/packages/:id/tracking",
  validateTrackingEvent,
  requireRole(["admin", "operator"]),
  PackageController.addTrackingEvent,
)

// Bulk operations
router.put(
  "/packages/bulk",
  validateBulkUpdate,
  requireRole(["admin", "manager"]),
  PackageController.bulkUpdatePackages,
)

// Advanced routes
router.get("/packages/:id/timeline", async (req, res) => {
  // Get package with detailed tracking timeline
  req.query.include_events = "true"
  req.query.include_comments = "true"
  return PackageController.getPackageById(req, res)
})

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Package API is healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  })
})

// API documentation endpoint
router.get("/docs", (req, res) => {
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
    authentication: {
      type: "Bearer Token",
      header: "Authorization: Bearer <token>",
    },
    rate_limits: {
      general: "100 requests per 15 minutes",
      tracking: "50 requests per 15 minutes",
    },
  })
})

// Error handling middleware for this router
router.use((error, req, res, next) => {
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