<template>
  <!-- Enhanced Login Form -->
  <main class="flex-1 bg-gray-50 flex items-center justify-center p-4">
    <div class="rounded-lg border bg-white shadow-lg overflow-hidden w-full max-w-md">
      <!-- Header with Logo -->
      <div class="bg-[#273272] text-white p-6 rounded-t-lg">
        <div class="flex items-center justify-center mb-4">
          <img src="https://www.texmonlogistics.co.ke/assets/images/texmon-logo.png" 
               alt="Texmon Logistics Logo"
               class="w-12 h-12 rounded object-contain" />
        </div>
        <h2 class="text-2xl font-semibold text-center">Admin Login</h2>
        <p class="text-gray-200 text-center">Please login to access the admin dashboard</p>
      </div>

      <!-- Login Form -->
      <div class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Error Message -->
          <div v-if="loginError" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mb-4 flex items-center">
            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {{ loginError }}
          </div>

          <!-- Success Message -->
          <div v-if="loginSuccess" class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm mb-4 flex items-center">
            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ loginSuccess }}
          </div>

          <!-- Username Field -->
          <div class="space-y-2">
            <label for="username" class="text-sm font-medium text-gray-700">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input 
                id="username" 
                type="text"
                placeholder="Enter your username" 
                v-model="username"
                :disabled="isSubmitting"
                class="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273272] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'border-red-500 focus:ring-red-500': loginError && !username }"
                required 
                autocomplete="username"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="text-sm font-medium text-gray-700">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                id="password" 
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password" 
                v-model="password"
                :disabled="isSubmitting"
                class="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273272] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'border-red-500 focus:ring-red-500': loginError && !password }"
                required 
                autocomplete="current-password"
              />
              <button 
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                :disabled="isSubmitting"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                type="checkbox" 
                v-model="rememberMe"
                :disabled="isSubmitting"
                class="h-4 w-4 text-[#273272] focus:ring-[#273272] border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" @click.prevent="showForgotPassword = true" class="font-medium text-[#273272] hover:text-[#1e2759]">
                Forgot password?
              </a>
            </div>
          </div>

          <!-- Login Button -->
          <button 
            type="submit"
            :disabled="isSubmitting || !username || !password"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] h-10 px-4 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ffb600] focus:ring-offset-2"
          >
            <!-- Loading Spinner -->
            <svg v-if="isSubmitting" class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <!-- Login Icon -->
            <svg v-else class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
            {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Need help?</span>
            </div>
          </div>

          <!-- Help Links -->
          <div class="text-center space-y-2">
            <p class="text-xs text-gray-500">
              Contact your system administrator for access
            </p>
            <p class="text-xs text-gray-500">
              📧 admin@texmonlogistics.co.ke | 📞 +254 XXX XXX XXX
            </p>
          </div>
        </form>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click="showForgotPassword = false">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Reset Password</h3>
            <button @click="showForgotPassword = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p class="text-sm text-gray-600 mb-4">
            Enter your username or email address and we'll send you instructions to reset your password.
          </p>
          <form @submit.prevent="handleForgotPassword" class="space-y-4">
            <div>
              <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1">
                Username or Email
              </label>
              <input 
                id="reset-email"
                type="text"
                v-model="resetEmail"
                placeholder="Enter username or email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#273272]"
                required
              />
            </div>
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="showForgotPassword = false"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="flex-1 px-4 py-2 bg-[#273272] text-white rounded-md text-sm font-medium hover:bg-[#1e2759]"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  },
  loginError: {
    type: String,
    default: ''
  },
  loginSuccess: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['login', 'forgot-password'])

// Form data
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const resetEmail = ref('')

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = () => {
  emit('login', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value
  })
}

const handleForgotPassword = () => {
  emit('forgot-password', resetEmail.value)
  showForgotPassword.value = false
  resetEmail.value = ''
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
