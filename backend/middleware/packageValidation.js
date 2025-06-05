const { body, param, query, validationResult } = require("express-validator")

// Enhanced validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
      timestamp: new Date().toISOString(),
    })
  }
  next()
}

// Package creation validation
const validatePackageCreation = [
  body("sender_name")
    .notEmpty()
    .withMessage("Sender name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Sender name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s\-.]+$/)
    .withMessage("Sender name can only contain letters, spaces, hyphens, and periods"),

  body("sender_phone").optional().isMobilePhone().withMessage("Invalid sender phone number format"),

  body("sender_email").optional().isEmail().withMessage("Invalid sender email format"),

  body("receiver_name")
    .notEmpty()
    .withMessage("Receiver name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Receiver name must be between 2 and 100 characters"),

  body("receiver_phone").optional().isMobilePhone().withMessage("Invalid receiver phone number format"),

  body("receiver_email").optional().isEmail().withMessage("Invalid receiver email format"),

  body("origin")
    .notEmpty()
    .withMessage("Origin is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Origin must be between 2 and 255 characters"),

  body("destination")
    .notEmpty()
    .withMessage("Destination is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Destination must be between 2 and 255 characters"),

  body("current_location")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Current location must not exceed 255 characters"),

  body("status")
    .optional()
    .isIn(["Package Received", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Delayed", "On Hold"])
    .withMessage("Invalid status value"),

  body("type")
    .optional()
    .isIn(["Standard Package", "Express", "Fragile", "Perishable", "Hazardous", "Oversized"])
    .withMessage("Invalid package type"),

  body("weight").optional().isFloat({ min: 0.1, max: 10000 }).withMessage("Weight must be between 0.1 and 10000 kg"),

  body("priority_level").optional().isIn(["Low", "Standard", "High", "Urgent"]).withMessage("Invalid priority level"),

  body("estimated_delivery").optional().isISO8601().withMessage("Estimated delivery must be a valid ISO 8601 date"),

  body("declared_value").optional().isFloat({ min: 0 }).withMessage("Declared value must be a positive number"),

  body("insurance_required").optional().isBoolean().withMessage("Insurance required must be a boolean value"),

  handleValidationErrors,
]

// Package update validation
const validatePackageUpdate = [
  param("id").isInt({ min: 1 }).withMessage("Package ID must be a positive integer"),

  body("sender_name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Sender name must be between 2 and 100 characters"),

  body("receiver_name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Receiver name must be between 2 and 100 characters"),

  body("weight").optional().isFloat({ min: 0.1, max: 10000 }).withMessage("Weight must be between 0.1 and 10000 kg"),

  body("status")
    .optional()
    .isIn(["Package Received", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Delayed", "On Hold"])
    .withMessage("Invalid status value"),

  body("estimated_delivery").optional().isISO8601().withMessage("Estimated delivery must be a valid ISO 8601 date"),

  handleValidationErrors,
]

// Tracking event validation
const validateTrackingEvent = [
  param("id").isInt({ min: 1 }).withMessage("Package ID must be a positive integer"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Status must be between 2 and 100 characters"),

  body("location").optional().isLength({ max: 255 }).withMessage("Location must not exceed 255 characters"),

  body("comment").optional().isLength({ max: 1000 }).withMessage("Comment must not exceed 1000 characters"),

  body("event_type")
    .optional()
    .isIn(["status_update", "location_update", "delivery_attempt", "exception", "customs", "bulk_update"])
    .withMessage("Invalid event type"),

  handleValidationErrors,
]

// Search validation
const validateSearch = [
  query("q")
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
]

// Bulk update validation
const validateBulkUpdate = [
  body("package_ids").isArray({ min: 1, max: 100 }).withMessage("Package IDs must be an array with 1-100 items"),

  body("package_ids.*").isInt({ min: 1 }).withMessage("Each package ID must be a positive integer"),

  body("updates").isObject().withMessage("Updates must be an object"),

  body("updates.status")
    .optional()
    .isIn(["Package Received", "In Transit", "Out for Delivery", "Delivered", "Cancelled", "Delayed", "On Hold"])
    .withMessage("Invalid status value"),

  handleValidationErrors,
]

// Export validation
const validateExport = [
  query("format").optional().isIn(["csv", "json"]).withMessage("Format must be either 'csv' or 'json'"),

  query("date_from").optional().isISO8601().withMessage("Date from must be a valid ISO 8601 date"),

  query("date_to").optional().isISO8601().withMessage("Date to must be a valid ISO 8601 date"),

  handleValidationErrors,
]

module.exports = {
  validatePackageCreation,
  validatePackageUpdate,
  validateTrackingEvent,
  validateSearch,
  validateBulkUpdate,
  validateExport,
  handleValidationErrors,
}