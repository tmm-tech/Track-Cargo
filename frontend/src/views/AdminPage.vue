<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">Admin Dashboard</h1>

    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div class="flex gap-2">
        <button @click="openCreateModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Package
        </button>
        <button @click="refreshPackages" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Refresh
        </button>
      </div>
      <div class="w-full md:w-1/2">
        <div class="relative">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by Container No, Truck No, or B/L..." 
            class="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          Search by Container No, Truck No, or B/L
        </p>
      </div>
    </div>

    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Container No #
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Truck No #
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              B/L #
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recipient
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="pkg in filteredPackages" :key="pkg.id">
            
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ pkg.containerNumber }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ pkg.truckNumber }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ pkg.blNumber }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                :class="[
                  'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getStatusBadgeStyle(pkg).bg,
                  getStatusBadgeStyle(pkg).text
                ]"
              >
                {{ pkg.trackingHistory[0]?.status || 'Unknown' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ pkg.recipientName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ pkg.destinationAddress }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ pkg.weight }} kg</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex justify-end gap-2">
                <button 
                  :class="[
                    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3',
                    getStatusBadgeStyle(pkg).bg,
                    getStatusBadgeStyle(pkg).text
                  ]"
                  @click="viewPackageDetails(pkg)"
                >
                  View
                </button>
                <button 
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  @click="editPackage(pkg)"
                >
                  <PencilIcon class="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button 
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  @click="printPackageDetails(pkg)"
                >
                  <PrinterIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Package Modal -->
    <Dialog :open="isCreateModalOpen" @update:open="isCreateModalOpen = $event">
      <DialogPanel class="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
          Create New Package
        </DialogTitle>
        <div class="mt-2">
          <form @submit.prevent="createPackage">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="recipientName" class="block text-sm font-medium text-gray-700">Recipient Name</label>
                <input type="text" id="recipientName" v-model="newPackage.recipientName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="destinationAddress" class="block text-sm font-medium text-gray-700">Destination Address</label>
                <input type="text" id="destinationAddress" v-model="newPackage.destinationAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="containerNumber" class="block text-sm font-medium text-gray-700">Container No</label>
                <input type="text" id="containerNumber" v-model="newPackage.containerNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="truckNumber" class="block text-sm font-medium text-gray-700">Truck No</label>
                <input type="text" id="truckNumber" v-model="newPackage.truckNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="blNumber" class="block text-sm font-medium text-gray-700">B/L</label>
                <input type="text" id="blNumber" v-model="newPackage.blNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input type="number" id="weight" v-model="newPackage.weight" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>
            <div class="mt-4">
              <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Create
              </button>
              <button type="button" class="ml-2 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="closeCreateModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogPanel>
    </Dialog>

    <!-- Edit Package Modal -->
    <Dialog :open="isEditModalOpen" @update:open="isEditModalOpen = $event">
      <DialogPanel class="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
          Edit Package
        </DialogTitle>
        <div class="mt-2">
          <form @submit.prevent="updatePackage">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label for="recipientName" class="block text-sm font-medium text-gray-700">Recipient Name</label>
                <input type="text" id="recipientName" v-model="editingPackage.recipientName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="destinationAddress" class="block text-sm font-medium text-gray-700">Destination Address</label>
                <input type="text" id="destinationAddress" v-model="editingPackage.destinationAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="containerNumber" class="block text-sm font-medium text-gray-700">Container No</label>
                <input type="text" id="containerNumber" v-model="editingPackage.containerNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="bookingNumber" class="block text-sm font-medium text-gray-700">Booking No</label>
                <input type="text" id="bookingNumber" v-model="editingPackage.bookingNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="blNumber" class="block text-sm font-medium text-gray-700">B/L</label>
                <input type="text" id="blNumber" v-model="editingPackage.blNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="weight" class="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input type="number" id="weight" v-model="editingPackage.weight" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>
            <div class="mt-4">
              <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Update
              </button>
              <button type="button" class="ml-2 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="closeEditModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogPanel>
    </Dialog>

    <!-- View Package Modal -->
    <Dialog :open="isViewModalOpen" @update:open="isViewModalOpen = $event">
      <DialogPanel class="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
          Package Details
        </DialogTitle>
        <div class="mt-2">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Tracking Number</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.trackingNumber }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Recipient Name</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.recipientName }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Container No</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.containerNumber }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Booking No</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.bookingNumber }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">B/L</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.blNumber }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Destination Address</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.destinationAddress }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Weight</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.weight }} kg</p>
            </div>
          </div>
          <div class="mt-4 mb-4">
            <p class="text-sm font-medium text-gray-500 mb-2">Current Status</p>
            <span 
              :class="[
                'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full',
                getStatusBadgeStyle(viewingPackage).bg,
                getStatusBadgeStyle(viewingPackage).text
              ]"
            >
              {{ viewingPackage.trackingHistory[0]?.status || 'Unknown' }}
            </span>
          </div>
          <div class="mt-4">
            <p class="text-sm font-medium text-gray-500">Tracking History</p>
            <ul class="list-disc pl-5">
              <li v-for="(history, index) in viewingPackage.trackingHistory" :key="index" class="text-sm text-gray-900">
                {{ history.status }} - {{ formatDate(history.timestamp) }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-4">
          <button type="button" class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="closeViewModal">
            Close
          </button>
        </div>
      </DialogPanel>
    </Dialog>

    <!-- Print Package Modal -->
    <Dialog :open="isPrintModalOpen" @update:open="isPrintModalOpen = $event">
      <DialogPanel class="max-w-md w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
          Print Package Details
        </DialogTitle>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            Are you sure you want to print the details for package #{{ printingPackage.trackingNumber }}?
          </p>
        </div>
        <div class="mt-4">
          <button type="button" class="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" @click="printPackage">
            Print
          </button>
          <button type="button" class="ml-2 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="closePrintModal">
            Cancel
          </button>
        </div>
      </DialogPanel>
    </Dialog>

    <!-- Hidden iframe for printing -->
    <iframe 
      ref="printFrame" 
      style="display: none;"
      title="Print Frame"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { PencilIcon, PrinterIcon, SearchIcon } from '@heroicons/vue/24/outline'

const packages = ref([])
const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isViewModalOpen = ref(false)
const isPrintModalOpen = ref(false)
const printFrame = ref(null)

const newPackage = ref({
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  bookingNumber: '',
  blNumber: '',
  weight: 0,
})
const editingPackage = ref({
  id: null,
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  bookingNumber: '',
  blNumber: '',
  weight: 0,
})
const viewingPackage = ref({
  trackingNumber: '',
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  bookingNumber: '',
  blNumber: '',
  weight: 0,
  trackingHistory: []
})
const printingPackage = ref({
  trackingNumber: '',
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  bookingNumber: '',
  blNumber: '',
  weight: 0,
  trackingHistory: []
})

onMounted(() => {
  fetchPackages()
})

const fetchPackages = async () => {
  try {
    // For demo purposes, we'll create some mock data instead of fetching from an API
    packages.value = generateMockPackages()
  } catch (error) {
    console.error('Error fetching packages:', error)
  }
}

// Generate mock package data
const generateMockPackages = () => {
  const statuses = [
    'Pending', 
    'Package Received', 
    'In Transit', 
    'Out for Delivery', 
    'Delivered'
  ]
  
  // Container prefixes for different shipping lines
  const containerPrefixes = ['MSCU', 'CMAU', 'MAEU', 'ZIMU', 'NYKU', 'EMSU', 'OOLU']
  
  // B/L prefixes
  const blPrefixes = ['MBLNO', 'HBLNO', 'BLNO', 'TXM']
  
  // Booking prefixes
  const bookingPrefixes = ['BKG', 'BOK', 'TXM', 'RES']
  
  return Array.from({ length: 10 }, (_, i) => {
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const trackingHistory = []
    
    // Generate tracking history based on current status
    for (let j = 0; j <= statusIndex; j++) {
      const date = new Date()
      date.setDate(date.getDate() - (statusIndex - j))
      
      trackingHistory.unshift({
        status: statuses[j],
        timestamp: date.toISOString(),
        location: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'][Math.floor(Math.random() * 5)]
      })
    
