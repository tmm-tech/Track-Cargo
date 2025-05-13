<template>
  <div class="flex flex-col min-h-screen">
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

    <nav class="bg-[#273272] text-white">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="flex flex-col md:flex-row">
            <button class="md:hidden p-4 text-white focus:outline-none">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="hidden md:flex flex-col md:flex-row">
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
          <div class="hidden md:flex items-center space-x-2">
            <router-link
              to="/track"
              class="px-6 py-3 bg-transparent text-white border border-white rounded-md hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300 inline-block"
            >
              Track Cargo
            </router-link>
            <router-link
              to="/admin"
              class="px-6 py-3 bg-[#ffb600] text-[#273272] rounded-md hover:bg-[#e6a500] transition-colors duration-300 inline-block"
            >
              Admin
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main class="flex-1 bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto">
          <Card class="border-none shadow-lg">
            <CardHeader class="bg-[#273272] text-white rounded-t-lg">
              <CardTitle class="text-2xl">Track Your Cargo</CardTitle>
              <CardDescription class="text-gray-200">
                Enter your tracking information to see the current status of your package
              </CardDescription>
            </CardHeader>
            <CardContent class="pt-6">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="space-y-2">
                  <Label for="tracking-number">Tracking or Dispatch Number</Label>
                  <div class="relative">
                    <Input
                      id="tracking-number"
                      v-model="trackingNumber"
                      placeholder="Enter tracking or dispatch number"
                      class="pr-10 border-gray-300"
                    />
                    <Search class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
                </div>

                <Button type="submit" class="w-full bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] font-bold">
                  Track
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>

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
                  <path
                    fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">Twitter</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#ffb600]">
                <span class="sr-only">WhatsApp</span>
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1
