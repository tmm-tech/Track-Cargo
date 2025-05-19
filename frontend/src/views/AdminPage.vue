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
          <div class="flex space-x-4" v-if="isAuthenticated">
            <button
              @click="logout"
              class="text-sm hover:text-[#ffb600]"
            >
              Logout
            </button>
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
          <div v-if="isAuthenticated">
            <h2 class="text-xl font-bold text-[#273272]">Admin Dashboard</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Form -->
    <main v-if="!isAuthenticated" class="flex-1 bg-gray-50 flex items-center justify-center p-4">
      <div class="rounded-lg border bg-white shadow-lg overflow-hidden w-full max-w-md">
        <div class="bg-[#273272] text-white p-6 rounded-t-lg">
          <h2 class="text-2xl font-semibold">Admin Login</h2>
          <p class="text-gray-200">Please login to access the admin dashboard</p>
        </div>
        <div class="p-6">
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div v-if="loginError" class="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{{ loginError }}</div>
            <div class="space-y-2">
              <label for="username" class="text-sm font-medium">Username</label>
              <input
                id="username"
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
                v-model="password"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              />
            </div>
            <button 
              type="submit" 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] font-bold h-10 px-4 py-2 w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
              </svg>
              Login
            </button>
          </form>
        </div>
      </div>
    </main>

    <!-- Admin Dashboard -->
    <main v-else class="flex-1 bg-gray-50 py-8">
      <div class="container mx-auto px-4">
        <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
          <div class="flex flex-row items-center justify-between bg-[#273272] text-white p-6 rounded-t-lg">
            <div>
              <h2 class="text-xl font-semibold">Package Management</h2>
              <p class="text-gray-200">
                Update the current location and next stop information for packages
              </p>
            </div>
            <button
              @click="openAddPackageModal"
              class="bg-transparent text-white border border-white hover:bg-red-600 hover:border-red-600 transition-colors duration-300 px-4 py-2 rounded inline-flex items-center"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Package
            </button>
          </div>
          <div class="p-6">
            <div class="mb-6">
              <div class="relative">
                <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  placeholder="Search by tracking or dispatch number"
                  v-model="searchTerm"
                  class="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>

            <div class="rounded-md border border-gray-200 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispatch #</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Stop</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Stop ETA</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="filteredPackages.length === 0">
                    <td colspan="7" class="text-center py-4 text-gray-500">No packages found</td>
                  </tr>
                  <tr v-for="pkg in filteredPackages" :key="pkg.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ pkg.trackingNumber }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ pkg.dispatchNumber }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ pkg.currentLocation }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ pkg.nextStop }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ pkg.nextStopETA }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ pkg.lastUpdated }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end gap-2">
                        <button 
                          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
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
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Package Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeEditModal">
      <div class="bg-white rounded-lg shadow-lg max-w-[600px] w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight">Update Package Information</h2>
            <p class="text-sm text-muted-foreground">Update the package location and shipping address information.</p>
          </div>

          <div v-if="editingPackage" class="space-y-4 py-4">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm font-medium text-gray-500">Tracking Number</p>
                <p>{{ editingPackage.trackingNumber }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Dispatch Number</p>
                <p>{{ editingPackage.dispatchNumber }}</p>
              </div>
            </div>

            <div>
              <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                <button 
                  :class="[
                    'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    activeEditTab === 'location' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50'
                  ]"
                  @click="activeEditTab = 'location'"
                >
                  Location
                </button>
                <button 
                  :class="[
                    'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    activeEditTab === 'address' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50'
                  ]"
                  @click="activeEditTab = 'address'"
                >
                  Shipping Address
                </button>
              </div>

              <div v-if="activeEditTab === 'location'" class="space-y-4 mt-4">
                <div class="space-y-2">
                  <label for="currentLocation" class="text-sm font-medium">Current Location</label>
                  <select 
                    id="currentLocation"
                    v-model="editData.currentLocation"
                    @change="handleLocationChange"
                    class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="" disabled>Select location</option>
                    <option v-for="location in allLocations" :key="location" :value="location">{{ location }}</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="nextStop" class="text-sm font-medium">Next Stop</label>
                    <input 
                      id="nextStop" 
                      v-model="editData.nextStop" 
                      readonly 
                      class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                    <p class="text-xs text-gray-500">Automatically determined based on current location</p>
                  </div>
                  <div class="space-y-2">
                    <label for="nextStopETA" class="text-sm font-medium">Next Stop ETA</label>
                    <input 
                      id="nextStopETA" 
                      type="date" 
                      v-model="editData.nextStopETA" 
                      readonly 
                      class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                    <p class="text-xs text-gray-500">Estimated based on standard transit times</p>
                  </div>
                </div>
              </div>

              <div v-if="activeEditTab === 'address'" class="space-y-4 mt-4">
                <div class="space-y-2">
                  <label for="recipientName" class="text-sm font-medium">Recipient Name</label>
                  <input 
                    id="recipientName" 
                    v-model="editData.shippingAddress.recipientName" 
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                </div>

                <div class="space-y-2">
                  <label for="streetAddress" class="text-sm font-medium">Street Address</label>
                  <input 
                    id="streetAddress" 
                    v-model="editData.shippingAddress.streetAddress" 
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="city" class="text-sm font-medium">City</label>
                    <input 
                      id="city" 
                      v-model="editData.shippingAddress.city" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="state" class="text-sm font-medium">State/Province</label>
                    <input 
                      id="state" 
                      v-model="editData.shippingAddress.state" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="postalCode" class="text-sm font-medium">Postal Code</label>
                    <input 
                      id="postalCode" 
                      v-model="editData.shippingAddress.postalCode" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="country" class="text-sm font-medium">Country</label>
                    <input 
                      id="country" 
                      v-model="editData.shippingAddress.country" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section in Edit Modal -->
          <div class="mt-6 pt-6 border-t">
            <h3 class="text-lg font-medium mb-4">Comments</h3>
            <div v-if="editingPackage.comments && editingPackage.comments.length > 0" class="space-y-4 mb-6">
              <div v-for="(comment, index) in editingPackage.comments" :key="index" class="bg-gray-50 p-4 rounded-md">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ comment.author }}</p>
                    <p class="text-sm text-gray-500">{{ comment.timestamp }}</p>
                  </div>
                </div>
                <p class="mt-2">{{ comment.text }}</p>
              </div>
            </div>
            <div v-else class="text-gray-500 mb-6">No comments yet</div>
            
            <form @submit.prevent="addComment(editingPackage.id)" class="space-y-4">
              <div class="space-y-2">
                <label for="editCommentText" class="text-sm font-medium">Add Comment</label>
                <textarea 
                  id="editCommentText" 
                  v-model="newComment.text" 
                  rows="3"
                  placeholder="Enter your comment here..."
                  class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <button 
                type="submit"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
              >
                Add Comment
              </button>
            </form>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              @click="closeEditModal"
            >
              Cancel
            </button>
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
              @click="savePackageChanges"
            >
              <DocumentCheckIcon class="h-4 w-4 mr-2" />
              Update Package
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Package Modal -->
    <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeViewModal">
      <div class="bg-white rounded-lg shadow-lg max-w-[800px] w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight">Package Details</h2>
            <p class="text-sm text-muted-foreground" v-if="viewingPackage">
              Tracking Number: {{ viewingPackage.trackingNumber }} | Dispatch Number: {{ viewingPackage.dispatchNumber }}
            </p>
          </div>

          <div v-if="viewingPackage" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Package Type</p>
                <p class="text-lg">{{ viewingPackage.type }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Weight</p>
                <p class="text-lg">{{ viewingPackage.weight }} kg</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Shipped Date</p>
                <p class="text-lg">{{ viewingPackage.shippedDate }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Estimated Delivery</p>
                <p class="text-lg">{{ viewingPackage.estimatedDelivery }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Final Destination</p>
                <p class="text-lg">{{ viewingPackage.finalDestination }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Last Updated</p>
                <p class="text-lg">{{ viewingPackage.lastUpdated }}</p>
              </div>
            </div>

            <!-- Shipping Address Card -->
            <div class="rounded-lg border bg-white shadow-lg overflow-hidden">
              <div class="bg-[#273272] text-white p-6 rounded-t-lg flex items-center">
                <MapPinIcon class="h-5 w-5 mr-2" />
                <h3 class="text-xl font-semibold">Shipping Address</h3>
              </div>
              <div class="p-6">
                <div v-if="viewingPackage.shippingAddress" class="space-y-1">
                  <p class="font-medium">{{ viewingPackage.shippingAddress.recipientName }}</p>
                  <p>{{ viewingPackage.shippingAddress.streetAddress }}</p>
                  <p>
                    {{ viewingPackage.shippingAddress.city }}, {{ viewingPackage.shippingAddress.state }}
                    {{ viewingPackage.shippingAddress.postalCode }}
                  </p>
                  <p>{{ viewingPackage.shippingAddress.country }}</p>
                </div>
                <p v-else class="text-gray-500">No shipping address information available</p>
              </div>
            </div>

            <!-- Shipping Progress -->
            <ShippingProgress
              :trackingHistory="viewingPackage.trackingHistory"
              :currentLocation="viewingPackage.currentLocation"
              :nextStop="viewingPackage.nextStop"
              :nextStopETA="viewingPackage.nextStopETA"
              :finalDestination="viewingPackage.finalDestination"
              :estimatedDelivery="viewingPackage.estimatedDelivery"
            />
          </div>

          <!-- Comments Section -->
          <div class="rounded-lg border bg-white shadow-lg overflow-hidden mt-6">
            <div class="bg-[#273272] text-white p-6 rounded-t-lg flex items-center">
              <ChatBubbleLeftRightIcon class="h-5 w-5 mr-2" />
              <h3 class="text-xl font-semibold">Comments</h3>
            </div>
            <div class="p-6">
              <div v-if="viewingPackage.comments && viewingPackage.comments.length > 0" class="space-y-4 mb-6">
                <div v-for="(comment, index) in viewingPackage.comments" :key="index" class="bg-gray-50 p-4 rounded-md">
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">{{ comment.author }}</p>
                      <p class="text-sm text-gray-500">{{ comment.timestamp }}</p>
                    </div>
                  </div>
                  <p class="mt-2">{{ comment.text }}</p>
                </div>
              </div>
              <div v-else class="text-gray-500 mb-6">No comments yet</div>
              
              <form @submit.prevent="addComment(viewingPackage.id)" class="space-y-4">
                <div class="space-y-2">
                  <label for="commentText" class="text-sm font-medium">Add Comment</label>
                  <textarea 
                    id="commentText" 
                    v-model="newComment.text" 
                    rows="3"
                    placeholder="Enter your comment here..."
                    class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
                >
                  Add Comment
                </button>
              </form>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              @click="closeViewModal"
            >
              Close
            </button>
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
              @click="editFromViewModal"
            >
              <PencilIcon class="h-4 w-4 mr-2" />
              Edit Package
            </button>
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] text-[#273272] hover:bg-[#e6a500] h-10 px-4 py-2"
              @click="printPackageDetails(viewingPackage)"
            >
              <PrinterIcon class="h-4 w-4 mr-2" />
              Print Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Package Modal -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeAddModal">
      <div class="bg-white rounded-lg shadow-lg max-w-[800px] w-full max-h-[90vh] overflow-auto" @click.stop>
        <div class="p-6">
          <div class="flex flex-col space-y-1.5 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight">Add New Package</h2>
            <p class="text-sm text-muted-foreground">Enter the details for the new package and its tracking history.</p>
          </div>

          <div>
            <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              <button 
                :class="[
                  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  addPackageTab === 'details' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50'
                ]"
                @click="addPackageTab = 'details'"
              >
                Package Details
              </button>
              <button 
                :class="[
                  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50',
                  addPackageTab === 'stops' ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50'
                ]"
                @click="addPackageTab = 'stops'"
              >
                Tracking Stops
              </button>
            </div>

            <div v-if="addPackageTab === 'details'" class="space-y-4 mt-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="trackingNumber" class="text-sm font-medium">Tracking Number</label>
                  <input 
                    id="trackingNumber" 
                    v-model="newPackage.trackingNumber" 
                    :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.trackingNumber ? 'border-red-500' : '']" 
                  />
                  <p v-if="formErrors.trackingNumber" class="text-red-500 text-sm">{{ formErrors.trackingNumber }}</p>
                </div>
                <div class="space-y-2">
                  <label for="dispatchNumber" class="text-sm font-medium">Dispatch Number</label>
                  <input 
                    id="dispatchNumber" 
                    v-model="newPackage.dispatchNumber" 
                    :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.dispatchNumber ? 'border-red-500' : '']" 
                  />
                  <p v-if="formErrors.dispatchNumber" class="text-red-500 text-sm">{{ formErrors.dispatchNumber }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="type" class="text-sm font-medium">Package Type</label>
                  <input 
                    id="type" 
                    v-model="newPackage.type" 
                    :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.type ? 'border-red-500' : '']" 
                  />
                  <p v-if="formErrors.type" class="text-red-500 text-sm">{{ formErrors.type }}</p>
                </div>
                <div class="space-y-2">
                  <label for="weight" class="text-sm font-medium">Weight (kg)</label>
                  <input 
                    id="weight" 
                    v-model="newPackage.weight" 
                    :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.weight ? 'border-red-500' : '']" 
                  />
                  <p v-if="formErrors.weight" class="text-red-500 text-sm">{{ formErrors.weight }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="shippedDate" class="text-sm font-medium">Shipped Date</label>
                  <input 
                    id="shippedDate" 
                    type="date" 
                    v-model="newPackage.shippedDate" 
                    :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.shippedDate ? 'border-red-500' : '']" 
                  />
                  <p v-if="formErrors.shippedDate" class="text-red-500 text-sm">{{ formErrors.shippedDate }}</p>
                </div>
                <div class="space-y-2">
                  <label for="estimatedDelivery" class="text-sm font-medium">Estimated Delivery</label>
                  <input 
                    id="estimatedDelivery" 
                    type="date" 
                    v-model="newPackage.estimatedDelivery" 
                    :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.estimatedDelivery ? 'border-red-500' : '']" 
                  />
                  <p v-if="formErrors.estimatedDelivery" class="text-red-500 text-sm">{{ formErrors.estimatedDelivery }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <label for="currentLocation" class="text-sm font-medium">Current Location</label>
                <select 
                  id="currentLocation"
                  v-model="newPackage.currentLocation"
                  @change="handleNewPackageLocationChange"
                  :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', formErrors.currentLocation ? 'border-red-500' : '']"
                >
                  <option value="" disabled selected>Select location</option>
                  <option v-for="location in allLocations" :key="location" :value="location">{{ location }}</option>
                </select>
                <p v-if="formErrors.currentLocation" class="text-red-500 text-sm">{{ formErrors.currentLocation }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="nextStop" class="text-sm font-medium">Next Stop</label>
                  <input 
                    id="nextStop" 
                    v-model="newPackage.nextStop" 
                    readonly 
                    class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                  <p class="text-xs text-gray-500">Automatically determined based on current location</p>
                </div>
                <div class="space-y-2">
                  <label for="nextStopETA" class="text-sm font-medium">Next Stop ETA</label>
                  <input 
                    id="nextStopETA" 
                    type="date" 
                    v-model="newPackage.nextStopETA" 
                    readonly 
                    class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label for="finalDestination" class="text-sm font-medium">Final Destination</label>
                <input 
                  id="finalDestination" 
                  v-model="newPackage.finalDestination" 
                  :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.finalDestination ? 'border-red-500' : '']" 
                />
                <p v-if="formErrors.finalDestination" class="text-red-500 text-sm">{{ formErrors.finalDestination }}</p>
              </div>
            </div>

            <div v-if="addPackageTab === 'stops'" class="space-y-4 mt-4">
              <div v-if="stopErrors.general" class="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{{ stopErrors.general }}</div>

              <div class="bg-gray-50 p-4 rounded-md border">
                <h3 class="font-medium text-lg mb-3">Add Tracking Stop</h3>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-2">
                    <label for="status" class="text-sm font-medium">Status</label>
                    <input 
                      id="status" 
                      placeholder="e.g., Package received, In transit" 
                      v-model="newStop.status" 
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', stopErrors.status ? 'border-red-500' : '']" 
                    />
                    <p v-if="stopErrors.status" class="text-red-500 text-sm">{{ stopErrors.status }}</p>
                  </div>
                  <div class="space-y-2">
                    <label for="location" class="text-sm font-medium">Location</label>
                    <input 
                      id="location" 
                      placeholder="e.g., Nairobi Warehouse" 
                      v-model="newStop.location" 
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', stopErrors.location ? 'border-red-500' : '']" 
                    />
                    <p v-if="stopErrors.location" class="text-red-500 text-sm">{{ stopErrors.location }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="space-y-2">
                    <label for="timestamp" class="text-sm font-medium">Date & Time</label>
                    <div class="relative">
                      <input 
                        id="timestamp" 
                        type="datetime-local" 
                        v-model="newStop.timestamp" 
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', stopErrors.timestamp ? 'border-red-500' : '']" 
                      />
                      <CalendarIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                    <p v-if="stopErrors.timestamp" class="text-red-500 text-sm">{{ stopErrors.timestamp }}</p>
                  </div>
                  <div class="space-y-2">
                    <label for="notes" class="text-sm font-medium">Notes (Optional)</label>
                    <input 
                      id="notes" 
                      placeholder="Additional information" 
                      v-model="newStop.notes" 
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    />
                  </div>
                </div>

                <button 
                  @click="addTrackingStop" 
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] hover:bg-[#1e2759] text-white h-10 px-4 py-2"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add Stop
                </button>
              </div>

              <div class="mt-6">
                <h3 class="font-medium text-lg mb-3">Tracking History</h3>
                <div v-if="trackingStops.length === 0" class="text-center py-8 bg-gray-50 rounded-md border">
                  <p class="text-gray-500">No tracking stops added yet</p>
                  <p class="text-sm text-gray-400 mt-1">Add stops to create the package's tracking history</p>
                </div>
                <div v-else class="space-y-4">
                  <div v-for="(stop, index) in trackingStops" :key="index" class="flex items-start gap-4 bg-white p-4 rounded-md border">
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <div>
                          <p class="font-medium">{{ stop.status }}</p>
                          <p class="text-sm text-gray-500">{{ stop.location }}</p>
                          <p class="text-sm text-gray-500">{{ formatDate(stop.timestamp) }}</p>
                          <p v-if="stop.notes" class="text-sm text-gray-400 mt-1">{{ stop.notes }}</p>
                        </div>
                        <button
                          @click="removeTrackingStop(index)"
                          class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                        >
                          <TrashIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              @click="closeAddModal"
            >
              Cancel
            </button>
            <button 
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
              @click="addNewPackage"
            >
              Add Package
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-[#1a1a1a] text-white py-4">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400">
            Copyright © {{ currentYear }} Texmon Logistics Limited - Admin Portal
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  PlusIcon, 
  DocumentCheckIcon, 
  MapPinIcon, 
  TruckIcon, 
  CheckCircleIcon,
  CalendarIcon,
  TrashIcon,
  PrinterIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'
import { mockPackages } from '../data/mock-data'
import { allLocations, getNextStop, calculateEstimatedArrival } from '../data/locations-data'
import ShippingProgress from '../components/ShippingProgress.vue'

// Authentication state
const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')

// Package management state
const packages = ref([...mockPackages])
const searchTerm = ref('')
const currentYear = computed(() => new Date().getFullYear())

// Filtered packages based on search term
const filteredPackages = computed(() => {
  if (!searchTerm.value) return packages.value
  
  return packages.value.filter(pkg => 
    pkg.trackingNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    pkg.dispatchNumber.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Edit package state
const showEditModal = ref(false)
const editingPackage = ref(null)
const activeEditTab = ref('location')
const editData = ref({
  currentLocation: '',
  nextStop: '',
  nextStopETA: '',
  shippingAddress: {
    recipientName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  }
})

// View package state
const showViewModal = ref(false)
const viewingPackage = ref(null)

// Add package state
const showAddModal = ref(false)
const addPackageTab = ref('details')
const newPackage = ref({
  trackingNumber: '',
  dispatchNumber: '',
  type: '',
  weight: '',
  shippedDate: '',
  estimatedDelivery: '',
  currentLocation: '',
  nextStop: '',
  nextStopETA: '',
  finalDestination: '',
  shippingAddress: {
    recipientName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  }
})
const formErrors = ref({})

// Tracking stops state
const trackingStops = ref([])
const newStop = ref({
  status: '',
  location: '',
  timestamp: '',
  notes: ''
})
const stopErrors = ref({})

// Comments state
const newComment = ref({
  text: '',
  author: 'Admin',
  timestamp: ''
})

// Add comment function
const addComment = (packageId) => {
  if (!newComment.value.text.trim()) return
  
  // Set the current timestamp
  newComment.value.timestamp = new Date().toLocaleString()
  
  // Find the package and add the comment
  packages.value = packages.value.map(pkg => {
    if (pkg.id === packageId) {
      const comments = pkg.comments || []
      return {
        ...pkg,
        comments: [...comments, { ...newComment.value }]
      }
    }
    return pkg
  })
  
  // Reset the comment form
  newComment.value.text = ''
}

// Print package details function
const printPackageDetails = async (pkg) => {
  if (!pkg) return
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  
  // Generate HTML content for the PDF
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Package Details - ${pkg.trackingNumber}</title>
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
          background-color: #273272;
          color: white;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 30px;
          border: 1px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
        }
        .section-header {
          background-color: #273272;
          color: white;
          padding: 10px 15px;
          font-size: 18px;
          font-weight: bold;
        }
        .section-content {
          padding: 15px;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .field {
          margin-bottom: 10px;
        }
        .field-label {
          font-weight: bold;
          color: #666;
          font-size: 14px;
        }
        .field-value {
          font-size: 16px;
        }
        .tracking-item {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        .tracking-item:last-child {
          border-bottom: none;
        }
        .tracking-status {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .tracking-location, .tracking-time {
          color: #666;
          font-size: 14px;
        }
        .tracking-notes {
          font-style: italic;
          color: #888;
          margin-top: 5px;
        }
        .comment {
          background-color: #f9f9f9;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .comment-author {
          font-weight: bold;
        }
        .comment-time {
          color: #666;
          font-size: 12px;
        }
        .comment-text {
          margin-top: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Texmon Logistics</div>
        <div>Package Tracking Details</div>
      </div>
      
      <div class="section">
        <div class="section-header">Package Information</div>
        <div class="section-content grid">
          <div class="field">
            <div class="field-label">Tracking Number</div>
            <div class="field-value">${pkg.trackingNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Dispatch Number</div>
            <div class="field-value">${pkg.dispatchNumber}</div>
          </div>
          <div class="field">
            <div class="field-label">Package Type</div>
            <div class="field-value">${pkg.type}</div>
          </div>
          <div class="field">
            <div class="field-label">Weight</div>
            <div class="field-value">${pkg.weight} kg</div>
          </div>
          <div class="field">
            <div class="field-label">Shipped Date</div>
            <div class="field-value">${pkg.shippedDate}</div>
          </div>
          <div class="field">
            <div class="field-label">Estimated Delivery</div>
            <div class="field-value">${pkg.estimatedDelivery}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">Current Status</div>
        <div class="section-content">
          <div class="field">
            <div class="field-label">Current Location</div>
            <div class="field-value">${pkg.currentLocation}</div>
          </div>
          <div class="field">
            <div class="field-label">Next Stop</div>
            <div class="field-value">${pkg.nextStop}</div>
          </div>
          <div class="field">
            <div class="field-label">Next Stop ETA</div>
            <div class="field-value">${pkg.nextStopETA}</div>
          </div>
          <div class="field">
            <div class="field-label">Final Destination</div>
            <div class="field-value">${pkg.finalDestination}</div>
          </div>
          <div class="field">
            <div class="field-label">Last Updated</div>
            <div class="field-value">${pkg.lastUpdated}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">Shipping Address</div>
        <div class="section-content">
          ${pkg.shippingAddress ? `
            <div class="field-value">${pkg.shippingAddress.recipientName}</div>
            <div class="field-value">${pkg.shippingAddress.streetAddress}</div>
            <div class="field-value">${pkg.shippingAddress.city}, ${pkg.shippingAddress.state} ${pkg.shippingAddress.postalCode}</div>
            <div class="field-value">${pkg.shippingAddress.country}</div>
          ` : 'No shipping address information available'}
        </div>
      </div>
      
      <div class="section">
        <div class="section-header">Tracking History</div>
        <div class="section-content">
          ${pkg.trackingHistory.map(event => `
            <div class="tracking-item">
              <div class="tracking-status">${event.status}</div>
              <div class="tracking-location">${event.location}</div>
              <div class="tracking-time">${event.timestamp}</div>
              ${event.notes ? `<div class="tracking-notes">${event.notes}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
      
      ${pkg.comments && pkg.comments.length > 0 ? `
        <div class="section">
          <div class="section-header">Comments</div>
          <div class="section-content">
            ${pkg.comments.map(comment => `
              <div class="comment">
                <div class="comment-author">${comment.author}</div>
                <div class="comment-time">${comment.timestamp}</div>
                <div class="comment-text">${comment.text}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>Texmon Logistics Limited, Kenya</p>
      </div>
    </body>
    </html>
  `
  
  // Write the content to the new window
  printWindow.document.open()
  printWindow.document.write(content)
  printWindow.document.close()
  
  // Wait for the content to load
  printWindow.onload = () => {
    // Print the window
    printWindow.print()
  }
}

// Check if user is authenticated on component mount
onMounted(() => {
  // In a real app, you would check for a valid session or token
  const checkAuth = localStorage.getItem('texmonAdminAuth')
  if (checkAuth === 'authenticated') {
    isAuthenticated.value = true
  }
  
  // Add comments array to each package if it doesn't exist
  packages.value = packages.value.map(pkg => {
    if (!pkg.comments) {
      return {
        ...pkg,
        comments: []
      }
    }
    return pkg
  })
})

// Authentication methods
const handleLogin = () => {
  // In a real app, you would validate against a secure backend
  // This is just a simple demo with hardcoded credentials
  if (username.value === 'admin' && password.value === 'texmon2024') {
    isAuthenticated.value = true
    localStorage.setItem('texmonAdminAuth', 'authenticated')
    loginError.value = ''
  } else {
    loginError.value = 'Invalid username or password'
  }
}

const logout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('texmonAdminAuth')
}

// Edit package methods
const editPackage = (pkg) => {
  editingPackage.value = pkg
  editData.value = {
    currentLocation: pkg.currentLocation,
    nextStop: pkg.nextStop,
    nextStopETA: pkg.nextStopETA,
    shippingAddress: {
      recipientName: pkg.shippingAddress?.recipientName || '',
      streetAddress: pkg.shippingAddress?.streetAddress || '',
      city: pkg.shippingAddress?.city || '',
      state: pkg.shippingAddress?.state || '',
      postalCode: pkg.shippingAddress?.postalCode || '',
      country: pkg.shippingAddress?.country || '',
    }
  }
  activeEditTab.value = 'location'
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingPackage.value = null
}

const handleLocationChange = (event) => {
  const location = event.target.value
  const nextStop = getNextStop(location)
  const nextStopETA = calculateEstimatedArrival(location)

  editData.value = {
    ...editData.value,
    currentLocation: location,
    nextStop: nextStop,
    nextStopETA: nextStopETA
  }
}

const savePackageChanges = () => {
  if (!editingPackage.value) return

  // Get the current date and time
  const currentDateTime = new Date().toLocaleString()

  // Create a new tracking history entry for the location change
  const newHistoryEntry = {
    status: editData.value.currentLocation === editingPackage.value.currentLocation
      ? `Updated at ${editData.value.currentLocation}`
      : `Arrived at ${editData.value.currentLocation}`,
    location: editData.value.currentLocation,
    timestamp: currentDateTime
  }

  // Check if shipping address was changed
  const isAddressChanged =
    editData.value.shippingAddress.recipientName !== editingPackage.value.shippingAddress?.recipientName ||
    editData.value.shippingAddress.streetAddress !== editingPackage.value.shippingAddress?.streetAddress ||
    editData.value.shippingAddress.city !== editingPackage.value.shippingAddress?.city ||
    editData.value.shippingAddress.state !== editingPackage.value.shippingAddress?.state ||
    editData.value.shippingAddress.postalCode !== editingPackage.value.shippingAddress?.postalCode ||
    editData.value.shippingAddress.country !== editingPackage.value.shippingAddress?.country

  // Create a shipping address update entry if address was changed
  let addressHistoryEntry = null
  if (isAddressChanged) {
    addressHistoryEntry = {
      status: 'Shipping address updated',
      location: editData.value.currentLocation,
      timestamp: currentDateTime,
      notes: `Address changed to: ${editData.value.shippingAddress.streetAddress}, ${editData.value.shippingAddress.city}, ${editData.value.shippingAddress.state}, ${editData.value.shippingAddress.country}`
    }
  }

  // Update the package with new location data and add to tracking history
  packages.value = packages.value.map(pkg =>
    pkg.id === editingPackage.value.id
      ? {
          ...pkg,
          currentLocation: editData.value.currentLocation,
          nextStop: editData.value.nextStop,
          nextStopETA: editData.value.nextStopETA,
          shippingAddress: editData.value.shippingAddress,
          lastUpdated: currentDateTime,
          // Add the new entries at the beginning of the tracking history
          trackingHistory: addressHistoryEntry
            ? [addressHistoryEntry, newHistoryEntry, ...pkg.trackingHistory]
            : [newHistoryEntry, ...pkg.trackingHistory]
        }
      : pkg
  )

  closeEditModal()
}

// View package methods
const viewPackageDetails = (pkg) => {
  viewingPackage.value = pkg
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingPackage.value = null
}

const editFromViewModal = () => {
  closeViewModal()
  editPackage(viewingPackage.value)
}

// Add package methods
const openAddPackageModal = () => {
  showAddModal.value = true
  addPackageTab.value = 'details'
  resetAddPackageForm()
}

const closeAddModal = () => {
  showAddModal.value = false
  resetAddPackageForm()
}

const resetAddPackageForm = () => {
  newPackage.value = {
    trackingNumber: '',
    dispatchNumber: '',
    type: '',
    weight: '',
    shippedDate: '',
    estimatedDelivery: '',
    currentLocation: '',
    nextStop: '',
    nextStopETA: '',
    finalDestination: '',
    shippingAddress: {
      recipientName: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    }
  }
  trackingStops.value = []
  formErrors.value = {}
  stopErrors.value = {}
}

const handleNewPackageLocationChange = (event) => {
  const location = event.target.value
  const nextStop = getNextStop(location)
  const nextStopETA = calculateEstimatedArrival(location)

  newPackage.value.nextStop = nextStop
  newPackage.value.nextStopETA = nextStopETA
}

const addNewPackage = () => {
  // Validate form
  const errors = {}

  if (!newPackage.value.trackingNumber) errors.trackingNumber = 'Tracking number is required'
  if (!newPackage.value.dispatchNumber) errors.dispatchNumber = 'Dispatch number is required'
  if (!newPackage.value.type) errors.type = 'Package type is required'
  if (!newPackage.value.weight) errors.weight = 'Weight is required'
  if (!newPackage.value.shippedDate) errors.shippedDate = 'Shipped date is required'
  if (!newPackage.value.estimatedDelivery) errors.estimatedDelivery = 'Estimated delivery is required'
  if (!newPackage.value.currentLocation) errors.currentLocation = 'Current location is required'
  if (!newPackage.value.finalDestination) errors.finalDestination = 'Final destination is required'

  if (Object.keys(errors).length > 0) {
    formErrors.value = errors
    return
  }

  // Ensure we have at least one tracking stop
  if (trackingStops.value.length === 0) {
    stopErrors.value = { general: 'At least one tracking stop is required' }
    addPackageTab.value = 'stops'
    return
  }

  // Create new package
  const newPkg = {
    id: `pkg${packages.value.length + 1}`,
    ...newPackage.value,
    lastUpdated: new Date().toLocaleString(),
    trackingHistory: trackingStops.value
  }

  // Add to packages array
  packages.value = [...packages.value, newPkg]

  // Close modal and reset form
  closeAddModal()
}

// Tracking stops methods
const addTrackingStop = () => {
  // Validate stop
  const errors = {}
  if (!newStop.value.status) errors.status = 'Status is required'
  if (!newStop.value.location) errors.location = 'Location is required'
  if (!newStop.value.timestamp) errors.timestamp = 'Date and time is required'

  if (Object.keys(errors).length > 0) {
    stopErrors.value = errors
    return
  }

  // Add stop to tracking history
  trackingStops.value = [...trackingStops.value, { ...newStop.value }]

  // Reset form
  newStop.value = {
    status: '',
    location: '',
    timestamp: '',
    notes: ''
  }
  stopErrors.value = {}
}

const removeTrackingStop = (index) => {
  trackingStops.value = trackingStops.value.filter((_, i) => i !== index)
}

// Utility methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
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