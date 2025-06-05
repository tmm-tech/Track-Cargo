const { body, param, query, validationResult } = require("express-validator")

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation errors",
      errors: errors.array(),
    })
  }
  next()
}

// Package creation validation
const validatePackageCreation = [
  body("container_number")
    .notEmpty()
    .withMessage("Container number is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Container number must be between 3 and 50 characters"),

  body("truck_number").optional().isLength({ max: 50 }).withMessage("Truck number must not exceed 50 characters"),

  body("bl_number").optional().isLength({ max: 50 }).withMessage("B/L number must not exceed 50 characters"),

  body("type").notEmpty().withMessage("Package type is required"),

  body("weight").optional().isNumeric().withMessage("Weight must be a number"),

  body("shipped_date").optional().isISO8601().withMessage("Shipped date must be a valid date"),

  body("estimated_delivery").optional().isISO8601().withMessage("Estimated delivery must be a valid date"),

  body("shipping_address").optional().isObject().withMessage("Shipping address must be an object"),

  handleValidationErrors,
]

// Package update validation
const validatePackageUpdate = [
  param("id").isUUID().withMessage("Package ID must be a valid UUID"),

  body("container_number")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Container number must be between 3 and 50 characters"),

  body("weight").optional().isNumeric().withMessage("Weight must be a number"),

  handleValidationErrors,
]

// Tracking event validation
const validateTrackingEvent = [
  param("id").isUUID().withMessage("Package ID must be a valid UUID"),

  body("status").notEmpty().withMessage("Status is required"),

  body("location").optional().isLength({ max: 255 }).withMessage("Location must not exceed 255 characters"),

  body("comment").optional().isLength({ max: 1000 }).withMessage("Comment must not exceed 1000 characters"),

  handleValidationErrors,
]

// Comment validation
const validateComment = [
  param("id").isUUID().withMessage("Package ID must be a valid UUID"),

  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),

  body("user_id").isUUID().withMessage("User ID must be a valid UUID"),

  handleValidationErrors,
]

// Search validation
const validateSearch = [
  query("q")
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2 })
    .withMessage("Search query must be at least 2 characters"),

  handleValidationErrors,
]

// Pagination validation
const validatePagination = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),

  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
]

module.exports = {
  handleValidationErrors,
  validatePackageCreation,
  validatePackageUpdate,
  validateTrackingEvent,
  validateComment,
  validateSearch,
  validatePagination,
}