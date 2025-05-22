<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">Admin Dashboard</h1>

    <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div class="flex gap-2">
        <button @click="openCreateModal" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Create Package
        </button>
        <button @click="showUserManagement = true" class="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
          <UserIcon class="h-4 w-4 inline mr-1" />
          Users
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
              Container No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Truck No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              B/L
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
              <div class="text-sm text-gray-900">{{ pkg.trackingNumber }}</div>
            </td>
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
                <label for="truckNumber" class="block text-sm font-medium text-gray-700">Truck No</label>
                <input type="text" id="truckNumber" v-model="editingPackage.truckNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
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
              <p class="text-sm font-medium text-gray-500">Recipient Name</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.recipientName }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Container No</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.containerNumber }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Truck No</p>
              <p class="text-sm text-gray-900">{{ viewingPackage.truckNumber }}</p>
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
            Are you sure you want to print the details for package #{{ printingPackage.containerNumber }}?
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

    <!-- User Management Modal -->
    <div v-if="showUserManagement" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeUserManagement">
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight">User Management</h2>
            <p class="text-sm text-muted-foreground">Manage users who can access the admin dashboard.</p>
          </div>

          <div class="flex justify-between items-center mb-6">
            <div class="relative w-64">
              <input 
                v-model="userSearchQuery" 
                type="text" 
                placeholder="Search users..." 
                class="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <SearchIcon class="w-4 h-4" />
              </div>
            </div>
            <button 
              @click="openAddUserModal" 
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <UserPlusIcon class="h-4 w-4 mr-1" />
              Add User
            </button>
          </div>

          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                        {{ user.name.charAt(0) }}
                      </div>
                      <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.username }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      :class="[
                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      ]"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.lastLogin || 'Never' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex justify-end gap-2">
                      <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        @click="editUser(user)"
                      >
                        <PencilIcon class="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                        @click="resetUserPassword(user)"
                      >
                        <KeyIcon class="h-4 w-4 mr-1" />
                        Reset
                      </button>
                      <button 
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-red-300 text-red-700 hover:bg-red-50 h-9 px-3"
                        @click="confirmDeleteUser(user)"
                        :disabled="user.username === 'admin'"
                      >
                        <TrashIcon class="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <button
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              @click="closeUserManagement"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div v-if="showUserFormModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeUserFormModal">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight">{{ editingUser.id ? 'Edit User' : 'Add New User' }}</h2>
            <p class="text-sm text-muted-foreground">{{ editingUser.id ? 'Update user information and permissions.' : 'Create a new user account.' }}</p>
          </div>

          <form @submit.prevent="saveUser">
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="name" class="text-sm font-medium">Full Name</label>
                <input 
                  id="name" 
                  v-model="editingUser.name" 
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': userFormErrors.name }"
                  placeholder="John Doe"
                />
                <p v-if="userFormErrors.name" class="text-red-500 text-xs mt-1">{{ userFormErrors.name }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="username" class="text-sm font-medium">Username</label>
                <input 
                  id="username" 
                  v-model="editingUser.username" 
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': userFormErrors.username }"
                  placeholder="johndoe"
                  :disabled="editingUser.id && editingUser.username === 'admin'"
                />
                <p v-if="userFormErrors.username" class="text-red-500 text-xs mt-1">{{ userFormErrors.username }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="email" class="text-sm font-medium">Email</label>
                <input 
                  id="email" 
                  v-model="editingUser.email" 
                  type="email"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': userFormErrors.email }"
                  placeholder="john.doe@example.com"
                />
                <p v-if="userFormErrors.email" class="text-red-500 text-xs mt-1">{{ userFormErrors.email }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="role" class="text-sm font-medium">Role</label>
                <select 
                  id="role" 
                  v-model="editingUser.role"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="editingUser.id && editingUser.username === 'admin'"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              
              <div v-if="!editingUser.id" class="space-y-2">
                <label for="password" class="text-sm font-medium">Password</label>
                <input 
                  id="password" 
                  v-model="editingUser.password" 
                  type="password"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': userFormErrors.password }"
                  placeholder="••••••••"
                />
                <p v-if="userFormErrors.password" class="text-red-500 text-xs mt-1">{{ userFormErrors.password }}</p>
              </div>
              
              <div v-if="!editingUser.id" class="space-y-2">
                <label for="confirmPassword" class="text-sm font-medium">Confirm Password</label>
                <input 
                  id="confirmPassword" 
                  v-model="editingUser.confirmPassword" 
                  type="password"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': userFormErrors.confirmPassword }"
                  placeholder="••••••••"
                />
                <p v-if="userFormErrors.confirmPassword" class="text-red-500 text-xs mt-1">{{ userFormErrors.confirmPassword }}</p>
              </div>
            </div>
            
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                @click="closeUserFormModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
              >
                {{ editingUser.id ? 'Update User' : 'Create User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeResetPasswordModal">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight">Reset Password</h2>
            <p class="text-sm text-muted-foreground">Reset password for user: <strong>{{ resetPasswordUser.username }}</strong></p>
          </div>

          <form @submit.prevent="saveNewPassword">
            <div class="space-y-4">
              <div class="space-y-2">
                <label for="newPassword" class="text-sm font-medium">New Password</label>
                <input 
                  id="newPassword" 
                  v-model="resetPasswordUser.newPassword" 
                  type="password"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': resetPasswordErrors.newPassword }"
                  placeholder="••••••••"
                />
                <p v-if="resetPasswordErrors.newPassword" class="text-red-500 text-xs mt-1">{{ resetPasswordErrors.newPassword }}</p>
              </div>
              
              <div class="space-y-2">
                <label for="confirmNewPassword" class="text-sm font-medium">Confirm New Password</label>
                <input 
                  id="confirmNewPassword" 
                  v-model="resetPasswordUser.confirmNewPassword" 
                  type="password"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  :class="{ 'border-red-500': resetPasswordErrors.confirmNewPassword }"
                  placeholder="••••••••"
                />
                <p v-if="resetPasswordErrors.confirmNewPassword" class="text-red-500 text-xs mt-1">{{ resetPasswordErrors.confirmNewPassword }}</p>
              </div>
            </div>
            
            <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                @click="closeResetPasswordModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete User Confirmation Modal -->
    <div v-if="showDeleteUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeDeleteUserModal">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight text-red-600">Delete User</h2>
            <p class="text-sm text-muted-foreground">Are you sure you want to delete the user <strong>{{ userToDelete.username }}</strong>? This action cannot be undone.</p>
          </div>
          
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6">
            <button
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              @click="closeDeleteUserModal"
            >
              Cancel
            </button>
            <button
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
              @click="deleteUser"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { PencilIcon, PrinterIcon, SearchIcon, UserIcon, UserPlusIcon, TrashIcon, KeyIcon } from '@heroicons/vue/24/outline'

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
  truckNumber: '',
  blNumber: '',
  weight: 0,
})
const editingPackage = ref({
  id: null,
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  truckNumber: '',
  blNumber: '',
  weight: 0,
})
const viewingPackage = ref({
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  truckNumber: '',
  blNumber: '',
  weight: 0,
  trackingHistory: []
})
const printingPackage = ref({
  recipientName: '',
  destinationAddress: '',
  containerNumber: '',
  truckNumber: '',
  blNumber: '',
  weight: 0,
  trackingHistory: []
})

// User management state
const showUserManagement = ref(false)
const userSearchQuery = ref('')
const users = ref([
  {
    id: 1,
    name: 'Admin User',
    username: 'admin',
    email: 'admin@texmonlogistics.com',
    role: 'Admin',
    lastLogin: new Date().toLocaleDateString()
  },
  {
    id: 2,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@texmonlogistics.com',
    role: 'User',
    lastLogin: '2023-05-15'
  },
  {
    id: 3,
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@texmonlogistics.com',
    role: 'Viewer',
    lastLogin: '2023-06-20'
  }
])

// User form state
const showUserFormModal = ref(false)
const editingUser = ref({
  id: null,
  name: '',
  username: '',
  email: '',
  role: 'User',
  password: '',
  confirmPassword: ''
})
const userFormErrors = ref({})

// Reset password state
const showResetPasswordModal = ref(false)
const resetPasswordUser = ref({
  id: null,
  username: '',
  newPassword: '',
  confirmNewPassword: ''
})
const resetPasswordErrors = ref({})

// Delete user state
const showDeleteUserModal = ref(false)
const userToDelete = ref({
  id: null,
  username: ''
})

// Filtered users based on search query
const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return users.value

  const query = userSearchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  )
})

// User management functions
const closeUserManagement = () => {
  showUserManagement.value = false
}

const openAddUserModal = () => {
  editingUser.value = {
    id: null,
    name: '',
    username: '',
    email: '',
    role: 'User',
    password: '',
    confirmPassword: ''
  }
  userFormErrors.value = {}
  showUserFormModal.value = true
}

const editUser = (user) => {
  editingUser.value = { ...user }
  userFormErrors.value = {}
  showUserFormModal.value = true
}

const closeUserFormModal = () => {
  showUserFormModal.value = false
}

const validateUserForm = () => {
  userFormErrors.value = {}
  let isValid = true

  if (!editingUser.value.name) {
    userFormErrors.value.name = 'Name is required'
    isValid = false
  }

  if (!editingUser.value.username) {
    userFormErrors.value.username = 'Username is required'
    isValid = false
  } else if (
    !editingUser.value.id && 
    users.value.some(u => u.username.toLowerCase() === editingUser.value.username.toLowerCase())
  ) {
    userFormErrors.value.username = 'Username already exists'
    isValid = false
  }

  if (!editingUser.value.email) {
    userFormErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(editingUser.value.email)) {
    userFormErrors.value.email = 'Email is invalid'
    isValid = false
  }

  if (!editingUser.value.id) {
    if (!editingUser.value.password) {
      userFormErrors.value.password = 'Password is required'
      isValid = false
    } else if (editingUser.value.password.length < 6) {
      userFormErrors.value.password = 'Password must be at least 6 characters'
      isValid = false
    }

    if (!editingUser.value.confirmPassword) {
      userFormErrors.value.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (editingUser.value.password !== editingUser.value.confirmPassword) {
      userFormErrors.value.confirmPassword = 'Passwords do not match'
      isValid = false
    }
  }

  return isValid
}

const saveUser = () => {
  if (!validateUserForm()) return

  if (editingUser.value.id) {
    // Update existing user
    users.value = users.value.map(user => 
      user.id === editingUser.value.id ? { ...editingUser.value } : user
    )
  } else {
    // Create new user
    const newUser = {
      id: users.value.length + 1,
      name: editingUser.value.name,
      username: editingUser.value.username,
      email: editingUser.value.email,
      role: editingUser.value.role,
      lastLogin: 'Never'
    }
    users.value.push(newUser)
  }

  closeUserFormModal()
}

const resetUserPassword = (user) => {
  resetPasswordUser.value = {
    id: user.id,
    username: user.username,
    newPassword: '',
    confirmNewPassword: ''
  }
  resetPasswordErrors.value = {}
  showResetPasswordModal.value = true
}

const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
}

const validateResetPasswordForm = () => {
  resetPasswordErrors.value = {}
  let isValid = true

  if (!resetPasswordUser.value.newPassword) {
    resetPasswordErrors.value.newPassword = 'New password is required'
    isValid = false
  } else if (resetPasswordUser.value.newPassword.length < 6) {
    resetPasswordErrors.value.newPassword = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!resetPasswordUser.value.confirmNewPassword) {
    resetPasswordErrors.value.confirmNewPassword = 'Please confirm your password'
    isValid = false
  } else if (resetPasswordUser.value.newPassword !== resetPasswordUser.value.confirmNewPassword) {
    resetPasswordErrors.value.confirmNewPassword = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

const saveNewPassword = () => {
  if (!validateResetPasswordForm()) return

  // In a real application, you would send this to your API
  console.log(`Password reset for user ${resetPasswordUser.value.username}`)
  
  // Show success message
  alert(`Password has been reset for ${resetPasswordUser.value.username}`)
  
  closeResetPasswordModal()
}

const confirmDeleteUser = (user) => {
  userToDelete.value = { ...user }
  showDeleteUserModal.value = true
}

const closeDeleteUserModal = () => {
  showDeleteUserModal.value = false
}

const deleteUser = () => {
  // Remove the user from the list
  users.value = users.value.filter(user => user.id !== userToDelete.value.id)
  
  closeDeleteUserModal()
}

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
  
  // Truck prefixes
  const truckPrefixes = ['BKG', 'BOK', 'TXM', 'RES']
  
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
    }
    
    // Generate random shipping identifiers
    const containerPrefix = containerPrefixes[Math.floor(Math.random() * containerPrefixes.length)]
    const blPrefix = blPrefixes[Math.floor(Math.random() * blPrefixes.length)]
    const truckPrefix = truckPrefixes[Math.floor(Math.random() * truckPrefixes.length)]
    
    return {
      id: i + 1,
      containerNumber: `${containerPrefix}${Math.floor(1000000 + Math.random() * 9000000)}`,
      truckingNumber: `${truckPrefix}${Math.floor(10000000 + Math.random() * 90000000)}`,
      blNumber: `${blPrefix}${Math.floor(100000000 + Math.random() * 900000000)}`,
      recipientName: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown'][Math.floor(Math.random() * 5)],
      destinationAddress: ['123 Main St, Nairobi', '456 Park Ave, Mombasa', '789 Ocean Blvd, Kisumu'][Math.floor(Math.random() * 3)],
      weight: Math.floor(1 + Math.random() * 20),
      trackingHistory
    }
  })
}

const refreshPackages = () => {
  fetchPackages()
}

const filteredPackages = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return packages.value.filter(pkg => {
    return pkg.trackingNumber.toLowerCase().includes(query) ||
      pkg.recipientName.toLowerCase().includes(query) ||
      pkg.destinationAddress.toLowerCase().includes(query) ||
      pkg.containerNumber.toLowerCase().includes(query) ||
      pkg.truckNumber.toLowerCase().includes(query) ||
      pkg.blNumber.toLowerCase().includes(query)
  })
})

const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
  newPackage.value = {
    recipientName: '',
    destinationAddress: '',
    containerNumber: '',
    truckNumber: '',
    blNumber: '',
    weight: 0,
  }
}

const createPackage = async () => {
  // Generate random identifiers
  const containerPrefix = ['MSCU', 'CMAU', 'MAEU', 'ZIMU'][Math.floor(Math.random() * 4)]
  const containerNumber = newPackage.value.containerNumber || `${containerPrefix}${Math.floor(1000000 + Math.random() * 9000000)}`
  const truckNumber = newPackage.value.truckNumber || `BKG${Math.floor(10000000 + Math.random() * 90000000)}`
  const blNumber = newPackage.value.blNumber || `MBLNO${Math.floor(100000000 + Math.random() * 900000000)}`

  // Create a new package object with the generated tracking number and a default "Pending" status
  const newPackageWithTracking = {
    id: packages.value.length + 1,
    containerNumber: containerNumber,
    truckNumber: truckNumber,
    blNumber: blNumber,
    recipientName: newPackage.value.recipientName,
    destinationAddress: newPackage.value.destinationAddress,
    weight: newPackage.value.weight,
    trackingHistory: [{
      timestamp: new Date().toISOString(),
      status: 'Pending',
      location: 'Nairobi Warehouse'
    }]
  }

  // Update the local state
  packages.value.push(newPackageWithTracking)

  // Close the modal
  closeCreateModal()
}

const editPackage = (pkg) => {
  editingPackage.value = { ...pkg }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingPackage.value = {
    id: null,
    recipientName: '',
    destinationAddress: '',
    containerNumber: '',
    truckNumber: '',
    blNumber: '',
    weight: 0,
  }
}

const updatePackage = async () => {
  // Update the local state
  const index = packages.value.findIndex(p => p.id === editingPackage.value.id)
  if (index !== -1) {
    packages.value[index] = { ...packages.value[index], ...editingPackage.value }
  }

  // Close the modal
  closeEditModal()
}

const viewPackageDetails = (pkg) => {
  viewingPackage.value = { ...pkg }
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  viewingPackage.value = {
    trackingNumber: '',
    recipientName: '',
    destinationAddress: '',
    containerNumber: '',
    truckNumber: '',
    blNumber: '',
    weight: 0,
    trackingHistory: []
  }
}

// Replace the printPackageDetails function with this mobile-friendly version
const printPackageDetails = (pkg) => {
  printingPackage.value = { ...pkg };
  isPrintModalOpen.value = true;
};

// Replace the printPackage function with this mobile-friendly version
const printPackage = () => {
  // Create a hidden div to hold the print content
  const printContainer = document.createElement('div');
  printContainer.style.position = 'absolute';
  printContainer.style.left = '-9999px';
  printContainer.style.top = '-9999px';
  document.body.appendChild(printContainer);
  
  // Generate the HTML content for printing
  const printContent = generatePrintContent(printingPackage.value);
  
  // Insert the content into the hidden div
  printContainer.innerHTML = printContent;
  
  // Get all images in the print content and wait for them to load
  const images = printContainer.querySelectorAll('img');
  let imagesLoaded = 0;
  const totalImages = images.length;
  
  // If there are no images, print immediately
  if (totalImages === 0) {
    performPrint();
    return;
  }
  
  // Wait for all images to load before printing
  images.forEach(img => {
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        performPrint();
      }
    };
    img.onerror = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        performPrint();
      }
    };
  });
  
  function performPrint() {
    // Save the current document body and replace it with our print content
    const originalBody = document.body.innerHTML;
    const originalBodyStyle = document.body.style.cssText;
    
    // Apply print-only styles to the body
    document.body.style.cssText = 'background-color: white; height: auto; padding: 0; margin: 0;';
    document.body.innerHTML = printContent;
    
    // Use a small timeout to ensure the content is rendered
    setTimeout(() => {
      window.print();
      
      // Restore the original document content
      document.body.innerHTML = originalBody;
      document.body.style.cssText = originalBodyStyle;
      
      // Clean up the print container
      if (document.body.contains(printContainer)) {
        document.body.removeChild(printContainer);
      }
      
      // Close the print modal
      closePrintModal();
    }, 300);
  }
};

const closePrintModal = () => {
  isPrintModalOpen.value = false
}

const generatePrintContent = (pkg) => {
  // Get the status style for the package
  const statusStyle = getStatusBadgeStyle(pkg)
  const statusClass = `${statusStyle.bg} ${statusStyle.text}`
  const statusText = pkg.trackingHistory[0]?.status || 'Unknown'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Package Details - ${pkg.trackingNumber}</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eaeaea;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #273272;
        }
        .company-info {
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #273272;
          border-bottom: 1px solid #eaeaea;
          padding-bottom: 5px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
          color: #666;
          font-size: 14px;
        }
        .info-value {
          font-size: 16px;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: bold;
          font-size: 14px;
        }
        .bg-green-500 { background-color: #10b981; }
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-amber-500 { background-color: #f59e0b; }
        .bg-purple-500 { background-color: #8b5cf6; }
        .bg-gray-500 { background-color: #6b7280; }
        .bg-orange-400 { background-color: #fb923c; }
        .bg-gray-200 { background-color: #e5e7eb; }
        .text-white { color: white; }
        .text-black { color: black; }
        .text-gray-800 { color: #1f2937; }
        .tracking-history {
          margin-top: 20px;
        }
        .history-item {
          padding: 10px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .history-status {
          font-weight: bold;
        }
        .history-timestamp {
          font-size: 14px;
          color: #666;
        }
        .history-location {
          font-size: 14px;
          color: #666;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eaeaea;
          padding-top: 20px;
        }
        .qr-placeholder {
          width: 100px;
          height: 100px;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px auto;
          background: #f9f9f9;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none;
          }
        }
        .shipping-details {
          background-color: #f0f7ff;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
          border-left: 4px solid #3a4999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Texmon Logistics</div>
        <div class="company-info">P.O. Box 12345, Nairobi, Kenya | +254 700 123456 | info@texmonlogistics.com</div>
      </div>
      
      <div class="section">
        <div class="section-title">Package Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Tracking Number</div>
            <div class="info-value">${pkg.trackingNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">
              <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Weight</div>
            <div class="info-value">${pkg.weight} kg</div>
          </div>
          <div class="info-item">
            <div class="info-label">Created Date</div>
            <div class="info-value">${formatDate(pkg.trackingHistory[pkg.trackingHistory.length - 1]?.timestamp)}</div>
          </div>
        </div>
        
        <div class="shipping-details">
          <div class="section-title">Shipping Details</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Container No</div>
              <div class="info-value">${pkg.containerNumber}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Truck No</div>
              <div class="info-value">${pkg.truckNumber}</div>
            </div>
            <div class="info-item">
              <div class="info-label">B/L</div>
              <div class="info-value">${pkg.blNumber}</div>
            </div>
          </div>
        </div>
        
        <div class="qr-placeholder">QR Code</div>
      </div>
      
      <div class="section">
        <div class="section-title">Recipient Information</div>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name</div>
            <div class="info-value">${pkg.recipientName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Delivery Address</div>
            <div class="info-value">${pkg.destinationAddress}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Tracking History</div>
        <div class="tracking-history">
          ${pkg.trackingHistory.map(history => `
            <div class="history-item">
              <div class="history-status">${history.status}</div>
              <div class="history-timestamp">${formatDate(history.timestamp)}</div>
              ${history.location ? `<div class="history-location">Location: ${history.location}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="footer">
        <p>This document was generated on ${new Date().toLocaleString()}</p>
        <p>Thank you for choosing Texmon Logistics</p>
      </div>
      
      <script>
        // Auto-print when loaded
        window.onload = function() {
          // Small delay to ensure everything is rendered
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Function to determine status badge color based on tracking history
const getStatusBadgeStyle = (pkg) => {
  // Get the most recent status from tracking history
  const latestStatus = pkg.trackingHistory && pkg.trackingHistory[0]?.status.toLowerCase() || ''
  
  if (latestStatus.includes('delivered')) {
    return { bg: 'bg-green-500', text: 'text-white' }
  } else if (latestStatus.includes('out for delivery')) {
    return { bg: 'bg-blue-500', text: 'text-white' }
  } else if (latestStatus.includes('in transit')) {
    return { bg: 'bg-amber-500', text: 'text-white' }
  } else if (latestStatus.includes('package received') || latestStatus.includes('arrived')) {
    return { bg: 'bg-purple-500', text: 'text-white' }
  } else if (latestStatus.includes('shipping label') || latestStatus.includes('created')) {
    return { bg: 'bg-gray-500', text: 'text-white' }
  } else if (latestStatus.includes('pending')) {
    return { bg: 'bg-orange-400', text: 'text-black' }
  } else {
    return { bg: 'bg-gray-200', text: 'text-gray-800' }
  }
}
</script>
