const fs = require("fs")
const path = require("path")

// Ensure logs directory exists
const logsDir = path.join(__dirname, "../logs")
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

// Request logging middleware
const logRequest = (req, res, next) => {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()

  // Log request
  const requestLog = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
    user: req.user ? { id: req.user.id, role: req.user.role } : null,
  }

  // Override res.json to capture response
  const originalJson = res.json
  res.json = function (data) {
    const duration = Date.now() - startTime

    const responseLog = {
      ...requestLog,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: data.success !== false,
    }

    // Log to file (async, non-blocking)
    const logEntry = JSON.stringify(responseLog) + "\n"
    const logFile = path.join(logsDir, `api-${new Date().toISOString().split("T")[0]}.log`)

    fs.appendFile(logFile, logEntry, (err) => {
      if (err) console.error("Failed to write log:", err)
    })

    // Console log for development
    if (process.env.NODE_ENV === "development") {
      console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`)
    }

    return originalJson.call(this, data)
  }

  next()
}

module.exports = {
  logRequest,
}