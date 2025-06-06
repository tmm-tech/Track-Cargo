// Authentication guard for Vue Router
import userServices from "..userServices.js"

export const authGuard = async (to, from, next) => {
  try {
    // Check if route requires authentication
    if (to.meta.requiresAuth) {
      const token = userServices.getAuthToken()

      if (!token) {
        // No token, redirect to login
        next("/login")
        return
      }

      // Verify token with backend
      const response = await userServices.verifyToken()

      if (response.success) {
        // Token is valid, allow access
        next()
      } else {
        // Token is invalid, clear it and redirect to login
        localStorage.removeItem("authToken")
        sessionStorage.removeItem("authToken")
        next("/login")
      }
    } else {
      // Route doesn't require auth
      next()
    }
  } catch (error) {
    console.error("Auth guard error:", error)
    // On error, redirect to login for safety
    next("/login")
  }
}

// Guest guard - redirect authenticated users away from login page
export const guestGuard = async (to, from, next) => {
  try {
    const token = userService.getAuthToken()

    if (token) {
      // Verify if token is still valid
      const response = await userService.verifyToken()

      if (response.success) {
        // User is authenticated, redirect to admin
        next("/admin")
        return
      } else {
        // Token is invalid, clear it and allow access to login
        localStorage.removeItem("authToken")
        sessionStorage.removeItem("authToken")
      }
    }

    // No valid token, allow access to login page
    next()
  } catch (error) {
    console.error("Guest guard error:", error)
    // On error, allow access to login page
    next()
  }
}