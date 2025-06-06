<template>
  <div class="bg-white border-b shadow-sm">
    <div class="container mx-auto">
      <div class="flex justify-between items-center py-4 px-4">
        <router-link to="/" class="flex items-center">
          <span class="text-2xl font-bold text-[#273272]">Texmon Logistics</span>
        </router-link>
        <div v-if="isAuthenticated" class="flex items-center">
          <h2 class="text-xl font-bold text-[#273272]">Admin Dashboard</h2>
        </div>
      </div>
    </div>
  </div>

  <!-- Top Navigation Bar -->
  <header class="bg-[#273272] text-white">
    <div class="container mx-auto">
      <div class="flex justify-between items-center py-2 px-4">
        <div class="flex items-center">
          <!-- Mobile Menu Button (only show on admin pages) -->
          <button 
            v-if="isMobileDevice && isAuthenticated && showMobileMenuButton" 
            @click="$emit('toggle-mobile-menu')"
            class="mr-3 p-1 rounded-md hover:bg-white/10 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <span class="text-sm">
            📍 Texmon Logistics Limited, Kenya
          </span>
        </div>
        <div class="flex items-center space-x-4" v-if="isAuthenticated">
          <div class="flex items-center space-x-3">
            <BellIcon class="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
            <div class="relative">
              <span class="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
              <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-[#273272] font-medium">
                {{ currentUser?.initials }}
              </div>
            </div>
          </div>
          <button @click="$emit('logout')" class="text-sm hover:text-[#ffb600] transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { BellIcon } from '@heroicons/vue/24/outline'

defineProps({
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: null
  },
  isMobileDevice: {
    type: Boolean,
    default: false
  },
  showMobileMenuButton: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-mobile-menu', 'logout'])
</script>