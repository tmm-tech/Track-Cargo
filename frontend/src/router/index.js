// Enhanced router with authentication guards
import { createRouter, createWebHistory } from "vue-router"
import { authGuard, guestGuard } from "./authGuard.js"

// Import your components
import AdminPage from "../views/AdminPage.vue"
import LoginPage from "../views/LoginPage.vue"
import HomePage from "../views/HomePage.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    beforeEnter: guestGuard,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPage,
    beforeEnter: authGuard,
    meta: {
      requiresAuth: true,
      roles: ["admin", "operator"], // Optional: specify required roles
    },
  },
  {
    path: "/admin/:section?",
    name: "AdminSection",
    component: AdminPage,
    beforeEnter: authGuard,
    meta: {
      requiresAuth: true,
      roles: ["admin", "operator"],
    },
  },
  // Catch all route - redirect to home
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // You can add global logic here if needed
  next()
})

export default router
