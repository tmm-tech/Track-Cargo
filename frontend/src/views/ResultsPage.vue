<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-[#273272] text-white">
      <div class="container mx-auto">
        <div class="flex flex-col sm:flex-row justify-between items-center py-2 px-4 space-y-2 sm:space-y-0">
          <div class="flex items-center">
            <span class="text-sm">
              <i class="mr-2">📍</i> Texmon Logistics Limited, Kenya
            </span>
          </div>
          <div class="flex overflow-x-auto space-x-4">
            <a href="https://www.facebook.com/TexmonLogistics" class="text-sm hover:text-[#ffb600]">
              <span class="sr-only">Facebook</span>
              <svg class="w-4 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="text-sm hover:text-[#ffb600]">
              <span class="sr-only">Twitter</span>
              <svg class="w-4 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://wa.me/795616827" class="text-sm hover:text-[#ffb600]">
              <span class="sr-only">WhatsApp</span>
              <svg class="w-4 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                  clip-rule="evenodd" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/texmon-logistics-limited" class="text-sm hover:text-[#ffb600]">
              <span class="sr-only">LinkedIn</span>
              <svg class="w-4 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                  clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>


    <div class="bg-white py-4 px-4 border-b">
      <div class="container mx-auto">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">

          <!-- Branding -->
          <div class="text-center sm:text-left">
            <a href="https://www.texmonlogistics.co.ke/" class="inline-block">
              <span class="text-2xl font-bold text-[#273272]">Texmon Logistics</span>
            </a>
          </div>

          <!-- Contact Info -->
          <div class="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 items-center sm:items-start">

            <!-- Phone -->
            <div class="flex items-center space-x-2">
              <div class="text-[#ffb600] text-xl">📞</div>
              <div>
                <p class="text-sm text-gray-600">Call Us</p>
                <p class="font-semibold text-base">(+254) 795 616 827</p>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-center space-x-2">
              <div class="text-[#ffb600] text-xl">✉️</div>
              <div>
                <p class="text-sm text-gray-600">Email Us</p>
                <p class="font-semibold text-base">enquiries@texmonlogistics.co.ke</p>
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
              <a href="https://www.texmonlogistics.co.ke/" class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Home
              </a>
              <a href="https://www.texmonlogistics.co.ke/about-us"
                class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                About Us
              </a>
              <a href="https://www.texmonlogistics.co.ke/services"
                class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Services
              </a>
              <a href="https://www.texmonlogistics.co.ke/contact"
                class="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                Contact Us
              </a>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-6">
            <a href="/"
              class="px-4 py-2 bg-transparent text-white border border-white rounded-md hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300 inline-block">
              Track Cargo
            </a>
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
              We couldn't find any cargo with the provided information.
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

          <!-- Package Client Details Card -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Client Details</h2>
            </div>
            <div class="p-6">
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 class="font-medium text-gray-500">Client Name</h3>
                  <p class="text-lg uppercase">{{ packageData.shipping_address.recipientName }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Email</h3>
                  <p class="text-lg">{{ packageData.shipping_address.email }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Phone Number</h3>
                  <p class="text-lg">{{ packageData.shipping_address.phone }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Country</h3>
                  <p class="text-lg">{{ packageData.shipping_address.country }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">State</h3>
                  <p class="text-lg">{{ packageData.shipping_address.state }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">City</h3>
                  <p class="text-lg">{{ packageData.shipping_address.city }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Street Address</h3>
                  <p class="text-lg">{{ packageData.shipping_address.streetAddress }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Special Instructions</h3>
                  <p class="text-lg">{{ packageData.shipping_address.specialInstructions }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Package Details Card -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Cargo Details</h2>
              <p class="text-gray-200">Cargo Number: {{ trackingNumber }}</p>
            </div>
            <div class="p-6">
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 class="font-medium text-gray-500">Cargo Type</h3>
                  <p class="text-lg uppercase">{{ packageData.type }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Weight</h3>
                  <p class="text-lg">{{ packageData.weight }} kg</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Shipped Date</h3>
                  <p class="text-lg">{{ formatDate(packageData.shipped_date) }}</p>
                </div>
                <div>
                  <h3 class="font-medium text-gray-500">Estimated Delivery</h3>
                  <p class="text-lg">{{ formatDate(packageData.estimated_delivery) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Current Status Card -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Current Status</h2>
            </div>
            <div class="p-6 space-y-8">

              <!-- Current Location -->
              <div class="flex items-start gap-4">
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
                  <p class="text-xl font-bold text-[#273272]">{{ packageData.current_location }}</p>
                  <p class="text-gray-500">Updated: {{ formatDate(packageData.latest_timestamp) }}</p>
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

              <!-- Next Stop -->
              <div v-if="!isDelivered" class="flex items-start gap-4">
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
                  <p class="text-xl font-bold text-[#273272]">{{ packageData.next_stop }}</p>
                  <p class="text-gray-500">Estimated arrival: {{ formatDate(packageData.next_stop_eta) }}</p>
                  <div class="flex items-center mt-2">
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              <!-- Final Destination -->
              <div class="flex items-start gap-4">
                <div :class="[
                  'p-3 rounded-full transition-all duration-300',
                  isFinalDestination || isDelivered ? 'bg-green-100 ring-2 ring-green-500' : 'bg-[#273272]/10'
                ]">
                  <CheckCircleIcon :class="[
                    'h-6 w-6 transition-colors duration-300',
                    isFinalDestination || isDelivered ? 'text-green-600' : 'text-[#273272]'
                  ]" />
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-500 text-lg">Final Destination</h3>
                  <p class="text-xl font-bold text-[#273272]">{{ packageData.final_destination }}</p>
                  <p class="text-gray-500">Estimated delivery: {{ formatDate(packageData.estimated_delivery) }}</p>
                  <div class="flex items-center mt-2">
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      isDelivered
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    ]">
                      {{ isDelivered ? 'Delivered' : 'Pending' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Clearance Report -->
          <div v-if="clearanceReportEvents.length" class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg">
              <h2 class="text-xl font-semibold">Clearance Report</h2>
            </div>
            <div class="p-6 space-y-4">
              <div v-for="(event, index) in clearanceReportEvents" :key="index"
                class="p-4 border-l-4 border-[#ffb600] bg-yellow-50 rounded-md">
                <div class="flex justify-between items-center mb-2">
                  <p class="font-medium text-[#273272] capitalize">{{ event.status }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(event.timestamp) }}</p>
                </div>
                <p class="text-gray-600">{{ event.location }}</p>
                <p v-if="event.comment" class="text-gray-500 italic mt-1">{{ event.comment.text || event.comment.message
                }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Progress Timeline -->
          <!-- PREMIUM SHIPMENT TIMELINE -->
          <div v-if="shippingProgressEvents.length" class="rounded-xl border bg-white shadow-lg overflow-hidden mb-8">
            <div class="bg-[#273272] text-white px-6 py-5">
              <h2 class="text-xl font-semibold tracking-wide">Shipment Progress</h2>
            </div>

            <div class="px-6 py-10">

              <div class="relative">

                <!-- MAIN LINE -->
                <div class="absolute left-[20px] top-0 bottom-0 w-[2px] bg-gray-200"></div>

                <!-- PROGRESS LINE -->
                <div class="absolute left-[20px] top-0 w-[2px] transition-all duration-700" :class="{
                  'bg-green-500': shipmentStatus === 'delivered',
                  'bg-red-500': shipmentStatus === 'issue',
                  'bg-[#ffb600]': shipmentStatus === 'in-transit'
                }" :style="{
          height: shippingProgressEvents.length
            ? `${((currentStep + 1) / shippingProgressEvents.length) * 100}%`
            : '0%'
        }"></div>

                <!-- EVENTS -->
                <div v-for="(event, index) in shippingProgressEvents" :key="index"
                  class="relative flex items-start gap-6 mb-10">

                  <!-- NODE -->
                  <div class="relative z-10">

                    <!-- OUTER RING (for active pulse effect) -->
                    <div v-if="index === currentStep && shipmentStatus !== 'delivered'"
                      class="absolute inset-0 rounded-full animate-ping opacity-30"
                      :class="shipmentStatus === 'issue' ? 'bg-red-400' : 'bg-[#ffb600]'"></div>

                    <!-- ICON CIRCLE -->
                    <div :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 transition-all duration-300',

                      // completed
                      index < currentStep
                        ? 'bg-[#ffb600] text-white border-[#ffb600]'

                        // active
                        : index === currentStep
                          ? shipmentStatus === 'delivered'
                            ? 'bg-green-600 text-white border-green-600'
                            : shipmentStatus === 'issue'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-[#273272] text-white border-[#273272] scale-110'

                          // upcoming
                          : 'bg-white text-gray-400 border-gray-300'
                    ]">
                      <component :is="getEventIconComponent(event.status)" class="w-5 h-5" />
                    </div>
                  </div>

                  <!-- CONTENT -->
                  <div :class="[
                    'flex-1 transition-all duration-300',

                    index === currentStep
                      ? 'bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm'
                      : ''
                  ]">

                    <!-- HEADER -->
                    <div class="flex justify-between items-center">

                      <p class="font-semibold text-gray-800 capitalize flex items-center gap-2">
                        {{ event.status }}

                        <!-- STATUS BADGES -->
                        <span v-if="index === currentStep" :class="[
                          'text-xs px-2 py-1 rounded-full',

                          shipmentStatus === 'delivered'
                            ? 'bg-green-100 text-green-700'

                            : shipmentStatus === 'issue'
                              ? 'bg-red-100 text-red-700'

                              : 'bg-blue-100 text-blue-700 animate-pulse'
                        ]">
                          {{
                            shipmentStatus === 'delivered'
                              ? 'Delivered'
                              : shipmentStatus === 'issue'
                                ? 'Issue'
                                : 'In Progress'
                          }}
                        </span>
                      </p>

                      <p class="text-xs text-gray-400">
                        {{ formatDate(event.timestamp) }}
                      </p>
                    </div>

                    <!-- LOCATION -->
                    <p class="text-sm text-gray-500 uppercase tracking-wide mt-1">
                      {{ event.location }}
                    </p>

                    <!-- COMMENT -->
                    <p v-if="event.comment" class="mt-2 text-sm text-gray-500 italic">
                      {{ event.comment.text || event.comment.message }}
                    </p>

                    <!-- DELIVERED HIGHLIGHT -->
                    <p v-if="shipmentStatus === 'delivered' && index === currentStep"
                      class="text-green-600 text-sm mt-2 font-medium">
                      Delivered on {{ formatDate(event.timestamp) }}
                    </p>

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
              <a href="https://www.facebook.com/TexmonLogistics" class="text-gray-400 hover:text-[#ffb600]">
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
              <a href="https://wa.me/795616827" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">WhatsApp</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                    clip-rule="evenodd" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/texmon-logistics-limited"
                class="text-gray-400 hover:text-[#ffb600]">
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
                <a href="https://www.texmonlogistics.co.ke/land-freight" class="hover:text-[#ffb600]">
                  Transportation (Land Freight)
                </a>
              </li>
              <li>
                <a href="https://www.texmonlogistics.co.ke/sea-freight" class="hover:text-[#ffb600]">
                  Sea Freight
                </a>
              </li>
              <li>
                <a href="https://www.texmonlogistics.co.ke/air-freight" class="hover:text-[#ffb600]">
                  Air Freight
                </a>
              </li>
              <li>
                <a href="https://www.texmonlogistics.co.ke/custom-clearance" class="hover:text-[#ffb600]">
                  Customs Clearance
                </a>
              </li>
              <li>
                <a href="https://www.texmonlogistics.co.ke/cross-border-clearance" class="hover:text-[#ffb600]">
                  Cross Border Clearance
                </a>
              </li>
              <li>
                <a href="https://www.texmonlogistics.co.ke/projects" class="hover:text-[#ffb600]">
                  Project Cargo
                </a>
              </li>
              <li>
                <a href="https://www.texmonlogistics.co.ke/reverse-logistics" class="hover:text-[#ffb600]">
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
              <a href="https://www.texmonlogistics.co.ke/about-us" class="text-gray-400 hover:text-[#ffb600]">
                About Us
              </a>
              <a href="https://www.texmonlogistics.co.ke/services" class="text-gray-400 hover:text-[#ffb600]">
                Services
              </a>
              <a href="https://www.texmonlogistics.co.ke/contact" class="text-gray-400 hover:text-[#ffb600]">
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
import { MapPinIcon, TruckIcon, CheckCircleIcon, ArchiveBoxIcon, GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import ShippingServices from '../Services/ShippingServices.js';

const route = useRoute()
const trackingNumber = computed(() => route.query.number || '')

const packageData = ref(null)
const loading = ref(true)
const error = ref('')
const mobileMenuOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())


const getEventIconComponent = (status) => {
  const s = status?.toLowerCase() || ''

  if (s.includes('delivered')) return CheckCircleIcon
  if (s.includes('delay') || s.includes('hold')) return ExclamationTriangleIcon
  if (s.includes('transit')) return TruckIcon
  if (s.includes('arrival')) return MapPinIcon
  if (s.includes('departure')) return GlobeAltIcon
  if (s.includes('loaded') || s.includes('package')) return ArchiveBoxIcon

  return ArchiveBoxIcon
}


const shippingProgressEvents = computed(() => {
  if (!packageData.value?.tracking_history) return []

  return [...packageData.value.tracking_history]
    .filter(event => !clearanceReportEvents.value.includes(event))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
})

const progressPercentage = ref(0)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const shipmentStatus = computed(() => {
  if (!shippingProgressEvents.value.length) return 'processing'

  const latest =
    shippingProgressEvents.value[shippingProgressEvents.value.length - 1]
      ?.status?.toLowerCase() || ''

  if (latest.includes('delivered')) return 'delivered'
  if (latest.includes('delay') || latest.includes('hold')) return 'issue'
  return 'in-transit'
})


const currentStep = computed(() => {
  return shippingProgressEvents.value.length - 1
})

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

// Computed: Clearance events (filtered from tracking_history)
const clearanceReportEvents = computed(() => {
  if (!packageData.value?.tracking_history) return []

  return packageData.value.tracking_history.filter(event => {
    const status = event.status?.toLowerCase() || ''
    const commentText = event.comment?.text?.toLowerCase() || event.comment?.message?.toLowerCase() || ''
    return status.includes('customs') || status.includes('clearance') || commentText.includes('customs') || commentText.includes('clearance')
  })
})



// Fetch package data
onMounted(async () => {
  loading.value = true
  error.value = null
  packageData.value = null
  try {
    const response = await ShippingServices.trackPackage(trackingNumber.value)
    if (response.data.success) {
      packageData.value = response.data.data
    } else {
      error.value = response.message || 'No cargo found'
    }
  } catch (err) {
    console.error(err)
    error.value = 'An error occurred while fetching cargo data'
  } finally {
    loading.value = false
  }
})

// Compute current status highlights
const isCurrentLocation = computed(() => currentStep.value === 1 || currentStep.value === 2)
const isNextStop = computed(() => currentStep.value === 3)
const isFinalDestination = computed(() => currentStep.value === 4)
const isDelivered = computed(() => packageData.value?.tracking_history?.some(e => e.status.toLowerCase().includes('delivered')))


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

// Capitalize each word in a string
const capitalizeWords = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
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

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.5s;
}

.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
