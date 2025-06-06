import { createRouter, createWebHistory } from "vue-router"
import TrackPage from "../views/TrackPage.vue"
import ResultsPage from "../views/ResultsPage.vue"
import AdminPage from "../views/AdminPage.vue"
import userServices from "../services/userServices.js"

// Authentication guard
const authGuard = async (to, from, next) => {
  try {
    // Check if user has a valid token
    const token = userServices.checkAuth()

    if (!token) {
      // No token, allow access to admin page (it will show login form)
      next()
      return
    }

    // Verify token with backend
    const response = await userServices.verifyToken()

    if (response.success) {
      // Token is valid, allow access
      next()
    } else {
      // Token is invalid, clear it and allow access (will show login form)
      localStorage.removeItem("authToken")
      sessionStorage.removeItem("authToken")
      next()
    }
  } catch (error) {
    console.error("Auth guard error:", error)
    // On error, still allow access (admin page will handle authentication)
    next()
  }
}

// Guest guard - for pages that should redirect authenticated users
const guestGuard = async (to, from, next) => {
  try {
    const token = userServices.getAuthToken()

    if (token) {
      // Verify if token is still valid
      const response = await userServices.verifyToken()

      if (response.success) {
        // User is authenticated, redirect to admin dashboard
        next("/admin")
        return
      } else {
        // Token is invalid, clear it and allow access
        localStorage.removeItem("authToken")
        sessionStorage.removeItem("authToken")
      }
    }

    // No valid token, allow access
    next()
  } catch (error) {
    console.error("Guest guard error:", error)
    // On error, allow access
    next()
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "track",
      component: TrackPage,
      meta: {
        title: "Track Your Shipment - Texmon Logistics",
        description: "Track your cargo and shipments in real-time",
      },
    },
    {
      path: "/track/results",
      name: "results",
      component: ResultsPage,
      meta: {
        title: "Tracking Results - Texmon Logistics",
        description: "View detailed tracking information for your shipment",
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminPage,
      beforeEnter: authGuard,
      meta: {
        title: "Admin Dashboard - Texmon Logistics",
        description: "Administrative portal for managing shipments and users",
        requiresAuth: true,
      },
    },
    // Optional: Add a dedicated login route that redirects to admin
    {
      path: "/login",
      redirect: "/admin",
      meta: {
        title: "Login - Texmon Logistics",
      },
    },
    // Catch all route - redirect to home
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
      meta: {
        title: "Page Not Found - Texmon Logistics",
      },
    },
  ],
})

// Global navigation guard for setting page titles
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Set meta description
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", to.meta.description)
    } else {
      metaDescription = document.createElement("meta")
      metaDescription.name = "description"
      metaDescription.content = to.meta.description
      document.getElementsByTagName("head")[0].appendChild(metaDescription)
    }
  }

  next()
})

// Global after navigation guard for analytics or other tracking
router.afterEach((to, from) => {
  // You can add analytics tracking here
  // Example: gtag('config', 'GA_MEASUREMENT_ID', { page_path: to.path })
  console.log(`Navigated from ${from.path} to ${to.path}`)
})

export default router