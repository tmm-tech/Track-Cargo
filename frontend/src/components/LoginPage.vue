<template>
  <div class="min-h-screen flex flex-col">
    <!-- Alert Component -->
    <div v-if="alertMessage" :class="['alert', alertType]">
      <Alert v-if="showAlert" :message="alertMessage" :type="alertType" :show="showAlert" @close="hideAlert" />
    </div>

    <!-- Loading Screen -->
    <div v-if="isCheckingAuth" class="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#273272] mx-auto mb-4"></div>
        <p class="text-gray-600">Checking authentication...</p>
      </div>
    </div>

    <!-- Shared Header -->
    <AppHeader 
      :is-authenticated="false" 
      :show-mobile-menu-button="false"
    />

    <!-- Login Form -->
    <main class="flex-1 bg-gray-50 flex items-center justify-center p-4">
      <div class="rounded-lg border bg-white shadow-lg overflow-hidden w-full max-w-md">
        <div class="bg-[#273272] text-white p-6 rounded-t-lg">
          <h2 class="text-2xl font-semibold">Admin Login</h2>
          <p class="text-gray-200">Please login to access the admin dashboard</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div v-if="loginError" class="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
              {{ loginError }}
            </div>
            <div class="space-y-2">
              <label for="username" class="text-sm font-medium">Username</label>
              <input 
                id="username" 
                placeholder="Enter your username" 
                v-model="username"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required 
              />
            </div>
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium">Password</label>
              <input 
                id="password" 
                type="password" 
                placeholder="Enter your password" 
                v-model="password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required 
              />
            </div>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] h-10 px-4 py-2 w-full disabled:opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
              {{ isSubmitting ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1a1a1a] text-white py-4">
      <div class="container mx-auto px-4 flex justify-center items-center">
        <p class="text-gray-400 text-center text-xs sm:text-sm">
          Copyright © {{ currentYear }} Texmon Logistics Limited - Admin Portal
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/shared/AppHeader.vue'
import Alert from '../components/ui/Alert.vue'
import userService from '../services/userServices.js'

const router = useRouter()

// Reactive data
const username = ref('')
const password = ref('')
const loginError = ref('')
const isSubmitting = ref(false)
const isCheckingAuth = ref(true)
const showAlert = ref(false)
const alertMessage = ref('')
const alertType = ref('')

const currentYear = computed(() => new Date().getFullYear())

// Methods
const handleLogin = async () => {
  try {
    isSubmitting.value = true
    loginError.value = ''
    
    const response = await userService.login(username.value, password.value)

    if (response.success && response.data.user) {
      // Store authentication token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token)
      }
      
      setAlert('Login successful! Redirecting...', 'success')
      
      // Redirect to admin dashboard
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
      
    } else {
      loginError.value = response.error || 'Invalid username or password'
      setAlert(loginError.value, 'error')
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'An error occurred during login. Please try again.'
    setAlert(loginError.value, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const setAlert = (message, type) => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true

  setTimeout(() => {
    alertMessage.value = ''
    alertType.value = ''
  }, 3000)
}

const hideAlert = () => {
  showAlert.value = false
}

const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('authToken')
    
    if (token) {
      const response = await userService.verifyToken()
      
      if (response.success && response.data.user) {
        // User is already authenticated, redirect to admin
        router.push('/admin')
        return
      }
    }
  } catch (error) {
    console.error('Auth check error:', error)
  } finally {
    isCheckingAuth.value = false
  }
}

onMounted(() => {
  checkAuthStatus()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>