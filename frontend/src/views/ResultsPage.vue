<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-[#273272] text-white">
      <div class="container mx-auto">
        <div class="flex justify-between items-center py-2 px-4">
          <div class="flex items-center">
            <span class="text-sm">
              <i class="mr-2">📍</i> Texmon Logistics Limited, Kenya
            </span>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> Facebook
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> Twitter
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> WhatsApp
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <i class="mr-1">📱</i> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Logo section -->
    <div class="bg-white border-b">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center py-4 px-4">
          <div class="mb-4 md:mb-0">
            <router-link to="/" class="flex items-center">
              <span class="text-2xl font-bold text-[#273272]">Texmon Logistics</span>
            </router-link>
          </div>
          <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <div class="flex items-center">
              <div class="mr-2 text-[#ffb600]">📞</div>
              <div>
                <p class="text-sm text-gray-600">Call Us</p>
                <p class="font-semibold">(+254) 795 616 827</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="mr-2 text-[#ffb600]">✉️</div>
              <div>
                <p class="text-sm text-gray-600">Email Us</p>
                <p class="font-semibold">enquiries@texmonlogistics.co.ke</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-[#273272] text-white">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex flex-col md:flex-row">
            <button @click="toggleMobileMenu" class="md:hidden p-4 text-white focus:outline-none">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div :class="['md:flex flex-col md:flex-row', mobileMenuOpen ? 'flex' : 'hidden']">
              <router-link to="/" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Home
              </router-link>
              <a href="#" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                About Us
              </a>
              <a href="#" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Services
              </a>
              <a href="#" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Contact Us
              </a>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-6">
            <router-link to="/"
              class="px-4 py-2 bg-transparent text-white border border-white rounded-md hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300 inline-block">
              Track Cargo
            </router-link>
          </div>

        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1 bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <div class="w-16 h-16 border-4 border-[#ffb600] border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-4 text-gray-600">Loading tracking information...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="max-w-2xl mx-auto rounded-lg border bg-white shadow-lg overflow-hidden">
          <div class="bg-[#273272] text-white p-6 rounded-t-lg">
            <h2 class="text-2xl font-semibold">Package Not Found</h2>
            <p class="text-gray-200">
              We couldn't find any package with the provided information.
            </p>
          </div>
          <div class="p-6">
            <p class="mb-6 text-gray-600">Please check your tracking or dispatch number and try again.</p>
            <router-link to="/">
              <button
                class="bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] font-bold px-4 py-2 rounded inline-flex items-center justify-center">
                Try Again
              </button>
            </router-link>
          </div>
        </div>

        <!-- Results -->
        <div v-else-if="packageData" class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold text-[#273272] mb-6">Tracking Information</h1>

          <!-- Package Details Card -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Package Details</h2>
              <p class="text-gray-200">Package Number: {{ trackingNumber }}</p>
            </div>
            <div class="p-6">
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 class="font-medium text-gray-500">Package Type</h3>
                  <p class="text-lg">{{ packageData.type }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Weight</h3>
                  <p class="text-lg">{{ packageData.weight }} kg</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Shipped Date</h3>
                  <p class="text-lg">{{ packageData.shippedDate }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Estimated Delivery</h3>
                  <p class="text-lg">{{ packageData.estimatedDelivery }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Status Card -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Current Status</h2>
            </div>
            <div class="p-6">
              <div class="flex items-start gap-4 mb-8">
                <div :class="[
                  'p-3 rounded-full transition-all duration-300',
                  isCurrentLocation ? 'bg-[#ffb600]/20 ring-2 ring-[#ffb600]' : 'bg-[#273272]/10'
                ]">
                  <MapPinIcon :class="[
                    'h-6 w-6 transition-colors duration-300',
                    isCurrentLocation ? 'text-[#ffb600]' : 'text-[#273272]'
                  ]" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-500 text-lg">Current Location</h3>
                  <p class="text-xl font-bold text-[#273272]">{{ packageData.currentLocation }}</p>
                  <p class="text-gray-500">Updated: {{ packageData.lastUpdated }}</p>
                  <div class="flex items-center mt-2">
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full capitalize',
                      getStatusClass(getCurrentLocationStatus())
                    ]">
                      {{ getCurrentLocationStatus() }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-4 mb-8">
                <div :class="[
                  'p-3 rounded-full transition-all duration-300',
                  isNextStop ? 'bg-[#ffb600]/20 ring-2 ring-[#ffb600]' : 'bg-[#273272]/10'
                ]">
                  <TruckIcon :class="[
                    'h-6 w-6 transition-colors duration-300',
                    isNextStop ? 'text-[#ffb600]' : 'text-[#273272]'
                  ]" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-500 text-lg">Next Stop</h3>
                  <p class="text-xl font-bold text-[#273272]">{{ packageData.nextStop }}</p>
                  <p class="text-gray-500">Estimated arrival: {{ packageData.nextStopETA }}</p>
                  <div class="flex items-center mt-2">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div :class="[
                  'p-3 rounded-full transition-all duration-300',
                  isFinalDestination ? 'bg-[#ffb600]/20 ring-2 ring-[#ffb600]' : 'bg-[#273272]/10'
                ]">
                  <CheckCircleIcon :class="[
                    'h-6 w-6 transition-colors duration-300',
                    isFinalDestination ? 'text-[#ffb600]' : 'text-[#273272]'
                  ]" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-500 text-lg">Final Destination</h3>
                  <p class="text-xl font-bold text-[#273272]">{{ packageData.finalDestination }}</p>
                  <p class="text-gray-500">Estimated delivery: {{ packageData.estimatedDelivery }}</p>
                  <div class="flex items-center mt-2">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                      {{ isDelivered ? 'Delivered' : 'Pending' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Shipping Status Icons with Animation -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Shipping Status</h2>
            </div>
            <div class="p-6">
              <div class="relative">
                <!-- Progress Line -->
                <div class="absolute top-6 left-4 w-full h-1 bg-gray-200"></div>
                <div class="absolute top-6 left-4 h-1 bg-[#ffb600] transition-all duration-1000 ease-out"
                  :style="{ width: `${progressPercentage}%` }"></div>

                <!-- Status Icons -->
                <div class="flex justify-between relative">
                  <!-- Shipped -->
                  <div class="flex flex-col items-center z-10">
                    <div :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500',
                      currentStep >= 1 ? 'bg-[#ffb600]' : 'bg-gray-200'
                    ]">
                      <transition name="icon-fade">
                        <ArchiveBoxIcon v-if="currentStep >= 1" class="h-6 w-6 text-white" />
                      </transition>
                    </div>
                    <p class="mt-2 text-sm font-medium">Shipped</p>
                    <transition name="fade">
                      <div v-if="currentStep >= 1" class="mt-1 text-xs text-gray-500">
                        {{ formatDate(packageData.shippedDate) }}
                      </div>
                    </transition>
                  </div>

                  <!-- In Transit -->
                  <div class="flex flex-col items-center z-10">
                    <div :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500',
                      currentStep >= 2 ? 'bg-[#ffb600]' : 'bg-gray-200'
                    ]">
                      <transition name="icon-fade">
                        <TruckIcon v-if="currentStep >= 2" class="h-6 w-6 text-white" />
                      </transition>
                    </div>
                    <p class="mt-2 text-sm font-medium">In Transit</p>
                    <transition name="fade">
                      <div v-if="currentStep >= 2" class="mt-1 text-xs text-gray-500">
                        {{ getInTransitDate() }}
                      </div>
                    </transition>
                  </div>

                  <!-- Out for Delivery -->
                  <div class="flex flex-col items-center z-10">
                    <div :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500',
                      currentStep >= 3 ? 'bg-[#ffb600]' : 'bg-gray-200'
                    ]">
                      <transition name="icon-fade">
                        <MapPinIcon v-if="currentStep >= 3" class="h-6 w-6 text-white" />
                      </transition>
                    </div>
                    <p class="mt-2 text-sm font-medium">Out for Delivery</p>
                    <transition name="fade">
                      <div v-if="currentStep >= 3" class="mt-1 text-xs text-gray-500">
                        {{ getOutForDeliveryDate() }}
                      </div>
                    </transition>
                  </div>

                  <!-- Delivered -->
                  <div class="flex flex-col items-center z-10">
                    <div :class="[
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500',
                      currentStep >= 4 ? 'bg-[#ffb600]' : 'bg-gray-200'
                    ]">
                      <transition name="icon-fade">
                        <CheckCircleIcon v-if="currentStep >= 4" class="h-6 w-6 text-white" />
                      </transition>
                    </div>
                    <p class="mt-2 text-sm font-medium">Delivered</p>
                    <transition name="fade">
                      <div v-if="currentStep >= 4" class="mt-1 text-xs text-gray-500">
                        {{ getDeliveredDate() || 'Pending' }}
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Shipping Progress Card -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Shipping Progress</h2>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div v-for="(event, index) in packageData.tracking_history" :key="index" class="flex gap-4">
                  <div class="relative flex flex-col items-center">
                    <div :class="`w-4 h-4 rounded-full ${index === 0 ? 'bg-[#ffb600]' : 'bg-gray-300'}`"></div>
                    <div v-if="index < packageData.tracking_history.length - 1"
                      class="w-0.5 h-full bg-gray-200 absolute top-4"></div>
                  </div>
                  <div class="flex-1 pb-6">
                    <p class="font-medium text-[#273272]">{{ event.status }}</p>
                    <p class="text-sm text-gray-500">{{ event.location }}</p>
                    <p class="text-sm text-gray-500">{{ event.timestamp }}</p>
                    <p v-if="event.comment" class="text-sm text-gray-400 mt-1">{{ event.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1a1a1a] text-white pt-12 pb-4">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 class="text-xl font-bold mb-4">About Us</h3>
            <p class="text-gray-400 mb-4">
              Texmon Logistics Limited, established in 2019, has swiftly evolved into a leading integrated logistics
              solutions provider across East Africa.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">Facebook</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">Twitter</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">WhatsApp</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">LinkedIn</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                    clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">Working Hours</h3>
            <ul class="text-gray-400">
              <li class="flex justify-between mb-2">
                <span>Monday - Friday:</span>
                <span>08:00 - 17:00</span>
              </li>
              <li class="flex justify-between mb-2">
                <span>Saturday:</span>
                <span>Open</span>
              </li>
              <li class="flex justify-between mb-2">
                <span>Sunday and holidays:</span>
                <span>Open</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold mb-4">Services</h3>
            <ul class="text-gray-400 space-y-2">
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Land Freight
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Sea Freight
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Air Freight
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Customs Clearance
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Cross Border Clearance
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Project Cargo
                </a>
              </li>
              <li>
                <a href="#" class="hover:text-[#ffb600]">
                  Reverse Logistics
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400">Copyright © {{ currentYear }} Texmon Logistics Limited</p>
            <div class="flex space-x-4 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                About Us
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                Services
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MapPinIcon, TruckIcon, CheckCircleIcon, ArchiveBoxIcon } from '@heroicons/vue/24/outline'
import ShippingServices from '../Services/ShippingServices.js';

const route = useRoute()
const trackingNumber = computed(() => route.query.number || '')

const packageData = ref(null)
const loading = ref(true)
const error = ref('')
const mobileMenuOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())




// Shipping status tracking
const currentStep = ref(0)
const progressPercentage = ref(0)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Format date to more readable format
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Get dates for each shipping stage from tracking history
const getInTransitDate = () => {
  if (!packageData.value?.tracking_history) return 'N/A'
  const inTransitEvent = packageData.value.tracking_history.find(
    event => event.status.toLowerCase().includes('in transit')
  )
  return inTransitEvent ? inTransitEvent.timestamp.split(' ')[0] : 'N/A'
}

const getOutForDeliveryDate = () => {
  if (!packageData.value?.tracking_history) return 'N/A'
  const outForDeliveryEvent = packageData.value.tracking_history.find(
    event => event.status.toLowerCase().includes('out for delivery')
  )
  return outForDeliveryEvent ? outForDeliveryEvent.timestamp.split(' ')[0] : 'N/A'
}

const getDeliveredDate = () => {
  if (!packageData.value?.tracking_history) return null
  const deliveredEvent = packageData.value.tracking_history.find(
    event => event.status.toLowerCase().includes('delivered')
  )
  return deliveredEvent ? deliveredEvent.timestamp.split(' ')[0] : null
}

// Determine current shipping step based on tracking history
const determineShippingStep = () => {
  if (!packageData.value) return 0

  const history = packageData.value.tracking_history

  // Always at least at step 1 (Shipped) if we have package data
  let step = 1

 // Check for "In Transit" status
if (history.some(event => (event.status || '').toLowerCase().includes('in transit'))) {
  step = 2;
}

// Check for "Out for Delivery" status
if (history.some(event => (event.status || '').toLowerCase().includes('out for delivery'))) {
  step = 3;
}

// Check for "Delivered" status
if (history.some(event => (event.status || '').toLowerCase().includes('delivered'))) {
  step = 4;
}


  return step
}

// Animate the progress when package data changes
watch(() => packageData.value, () => {
  if (packageData.value) {
    // Reset animation
    currentStep.value = 0
    progressPercentage.value = 0

    // Determine the final step based on tracking history
    const finalStep = determineShippingStep()

    // Animate step by step with delays
    const animateSteps = () => {
      const stepInterval = setInterval(() => {
        if (currentStep.value < finalStep) {
          currentStep.value++
          progressPercentage.value = (currentStep.value / 4) * 100
        } else {
          clearInterval(stepInterval)
        }
      }, 500)
    }

    // Start animation after a short delay
    setTimeout(animateSteps, 500)
  }
}, { immediate: false })

onMounted(async () => {
  loading.value = true
  error.value = null
  packageData.value = null

  try {
    // Call your backend service to track the package
    const response = await ShippingServices.trackPackage(trackingNumber.value)

    if (response.data.success && response.data.package) {
      packageData.value = response.data.package
    } else {
      error.value = response.message || 'No package found with the provided information'
    }
  } catch (err) {
    console.error('Error tracking package:', err)
    error.value = 'An error occurred while fetching package data'
  } finally {
    loading.value = false
  }
})

// Add these after the other computed properties in the script section
const isCurrentLocation = computed(() => {
  if (!packageData.value) return false
  // Check if we're in the "in transit" or earlier phase
  return currentStep.value <= 2
})

const isNextStop = computed(() => {
  if (!packageData.value) return false
  // Check if we're in the "out for delivery" phase
  return currentStep.value === 3
})

const isFinalDestination = computed(() => {
  if (!packageData.value) return false
  // Check if we're in the "delivered" phase
  return currentStep.value === 4
})

const isDelivered = computed(() => {
  if (!packageData.value) return false
  return packageData.value.tracking_history.some(
    event => event.status.toLowerCase().includes('delivered')
  )
})

// Get the current status based on tracking history
const getCurrentLocationStatus = () => {
  if (!packageData.value?.tracking_history || packageData.value.tracking_history.length === 0) {
    return 'Processing'
  }

  // Get the most recent status from tracking history
  const latestEvent = packageData.value.tracking_history[0]
  return latestEvent.status
}

// Get appropriate styling for different statuses
const getStatusClass = (status) => {
  const statusLower = status.toLowerCase()

  if (statusLower.includes('delivered')) {
    return 'bg-green-100 text-green-700 border border-green-300'
  } else if (statusLower.includes('transit') || statusLower.includes('shipped')) {
    return 'bg-blue-100 text-blue-700 border border-blue-300'
  } else if (statusLower.includes('delay') || statusLower.includes('hold')) {
    return 'bg-red-100 text-red-700 border border-red-300'
  } else if (statusLower.includes('out for delivery')) {
    return 'bg-purple-100 text-purple-700 border border-purple-300'
  } else if (statusLower.includes('processing') || statusLower.includes('scheduled')) {
    return 'bg-orange-100 text-orange-700 border border-orange-300'
  } else {
    return 'bg-gray-100 text-gray-700 border border-gray-300'
  }
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
