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
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] h-10 px-4 py-2 w-full"
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
              showComments
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
                  <div class="space-y-2">
                    <label for="stopComment" class="text-sm font-medium">Comment</label>
                    <textarea 
                      id="stopComment" 
                      placeholder="Enter comment for this stop" 
                      v-model="newStop.comment" 
                      rows="2"
                      class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
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
                          <div v-if="stop.comment" class="mt-2 p-2 bg-gray-50 rounded-md">
                            <p class="text-sm font-medium text-gray-700">Comment:</p>
                            <p class="text-sm text-gray-600">{{ stop.comment }}</p>
                          </div>
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
  notes: '',
  comment: []
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
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
      }
      .header {
        background: linear-gradient(135deg, #273272 0%, #1a2050 100%);
        color: white;
        padding: 20px;
        text-align: center;
        margin-bottom: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      <div class="logo-container">
        <img src="https://www.texmonlogistics.co.ke/assets/images/texmon-logo.png" alt="Texmon Logistics Logo" class="logo-image" />
        <div class="company-name">Texmon Logistics</div>
      </div>
      .section {
        margin-bottom: 30px;
        border-radius: 8px;
        overflow: hidden;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .section-header {
        background: linear-gradient(to right, #273272, #3a4999);
        color: white;
        padding: 12px 15px;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
      }
      .section-header-icon {
        margin-right: 10px;
        font-size: 20px;
      }
      .section-content {
        padding: 20px;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      .field {
        margin-bottom: 15px;
      }
      .field-label {
        font-weight: bold;
        color: #273272;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .field-value {
        font-size: 16px;
        padding: 5px 0;
        border-bottom: 1px solid #eee;
      }
      .tracking-timeline {
        position: relative;
        padding-left: 30px;
      }
      .tracking-timeline::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: #ddd;
      }
      .tracking-item {
        position: relative;
        padding: 15px;
        margin-bottom: 15px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border-left: 3px solid #273272;
      }
      .tracking-item::before {
        content: '';
        position: absolute;
        left: -32px;
        top: 20px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #273272;
        border: 3px solid white;
        box-shadow: 0 0 0 1px #ddd;
      }
      .tracking-item.completed::before {
        background-color: #4CAF50;
      }
      .tracking-item.current::before {
        background-color: #ffb600;
      }
      .tracking-item.future::before {
        background-color: #ddd;
      }
      .tracking-status {
        font-weight: bold;
        margin-bottom: 5px;
        color: #273272;
      }
      .tracking-location {
        color: #555;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
      .tracking-location::before {
        content: '📍';
        margin-right: 5px;
      }
      .tracking-time {
        color: #777;
        font-size: 13px;
        display: flex;
        align-items: center;
        margin-top: 3px;
      }
      .tracking-time::before {
        content: '🕒';
        margin-right: 5px;
      }
      .tracking-notes {
        font-style: italic;
        color: #666;
        margin-top: 8px;
        padding: 5px 10px;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 13px;
      }
      .tracking-comment {
        margin-top: 8px;
        padding: 8px 10px;
        background-color: #fff3cd;
        border-left: 3px solid #ffb600;
        border-radius: 4px;
        font-size: 13px;
      }
      .comment {
        background-color: #f0f7ff;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 15px;
        border-left: 3px solid #273272;
      }
      .comment-author {
        font-weight: bold;
        color: #273272;
      }
      .comment-time {
        color: #666;
        font-size: 12px;
      }
      .comment-text {
        margin-top: 8px;
        line-height: 1.5;
      }
      .shipping-address {
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #eee;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #666;
      }
      .badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        color: white;
        background-color: #273272;
        margin-left: 8px;
      }
      .qr-code {
        text-align: center;
        margin: 20px 0;
      }
      .qr-code img {
        width: 100px;
        height: 100px;
        border: 1px solid #eee;
        padding: 5px;
        background: white;
      }
      .logo-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin-right: 15px;
        object-fit: contain;
        background-color: white;
        padding: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo-container">
        <img src="https://i.imgur.com/jWxX8ZS.png" alt="Texmon Logistics Logo" class="logo-image" />
        <div class="company-name">Texmon Logistics</div>
      </div>
      <div>Package Tracking Details</div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <span class="section-header-icon">📦</span>
        Package Information
      </div>
      <div class="section-content">
        <div class="grid">
          <div class="field">
            <div class="field-label">Tracking Number</div>
            <div class="field-value">${pkg.trackingNumber} <span class="badge">Active</span></div>
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
        
        <div class="qr-code">
          <div style="font-weight: bold; margin-bottom: 5px;">Scan to track</div>
          <div style="width: 100px; height: 100px; background-color: #fff; border: 1px solid #ddd; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            QR
          </div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <span class="section-header-icon">🚚</span>
        Current Status
      </div>
      <div class="section-content">
        <div class="grid">
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
        </div>
        
        <div style="margin-top: 20px; background-color: #f0f7ff; padding: 15px; border-radius: 8px; text-align: center;">
          <div style="font-weight: bold; color: #273272; margin-bottom: 10px;">Delivery Progress</div>
          <div style="display: flex; justify-content: space-between; position: relative; padding: 0 20px;">
            <div style="position: absolute; top: 10px; left: 0; right: 0; height: 4px; background-color: #ddd; z-index: 1;"></div>
            <div style="position: absolute; top: 10px; left: 0; width: ${calculateProgress(pkg)}%; height: 4px; background-color: #273272; z-index: 2;"></div>
            
            <div style="position: relative; z-index: 3; text-align: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${isCompleted(pkg, 'Shipped') ? '#273272' : '#ddd'}; margin: 0 auto;"></div>
              <div style="font-size: 12px; margin-top: 5px;">Shipped</div>
            </div>
            
            <div style="position: relative; z-index: 3; text-align: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${isCompleted(pkg, 'In Transit') ? '#273272' : '#ddd'}; margin: 0 auto;"></div>
              <div style="font-size: 12px; margin-top: 5px;">In Transit</div>
            </div>
            
            <div style="position: relative; z-index: 3; text-align: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${isCompleted(pkg, 'Out for Delivery') ? '#273272' : '#ddd'}; margin: 0 auto;"></div>
              <div style="font-size: 12px; margin-top: 5px;">Out for Delivery</div>
            </div>
            
            <div style="position: relative; z-index: 3; text-align: center;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${isCompleted(pkg, 'Delivered') ? '#273272' : '#ddd'}; margin: 0 auto;"></div>
              <div style="font-size: 12px; margin-top: 5px;">Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <span class="section-header-icon">📍</span>
        Shipping Address
      </div>
      <div class="section-content">
        ${pkg.shippingAddress ? `
          <div class="shipping-address">
            <div style="font-weight: bold;">${pkg.shippingAddress.recipientName}</div>
            <div>${pkg.shippingAddress.streetAddress}</div>
            <div>${pkg.shippingAddress.city}, ${pkg.shippingAddress.state} ${pkg.shippingAddress.postalCode}</div>
            <div>${pkg.shippingAddress.country}</div>
          </div>
        ` : '<div>No shipping address information available</div>'}
      </div>
    </div>
    
    <div class="section">
      <div class="section-header">
        <span class="section-header-icon">🔄</span>
        Tracking History
      </div>
      <div class="section-content">
        <div class="tracking-timeline">
          ${pkg.trackingHistory.map((event, index) => `
            <div class="tracking-item ${getTrackingItemClass(event, pkg, index)}">
              <div class="tracking-status">${event.status}</div>
              <div class="tracking-location">${event.location}</div>
              <div class="tracking-time">${event.timestamp}</div>
              ${event.notes ? `<div class="tracking-notes">${event.notes}</div>` : ''}
              ${event.comment ? `<div class="tracking-comment"><strong>Comment:</strong> ${event.comment}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    
    ${pkg.comments && pkg.comments.length > 0 ? `
      <div class="section">
        <div class="section-header">
          <span class="section-header-icon">💬</span>
          Comments
        </div>
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
      <p>Contact: +254 700 000000 | info@texmonlogistics.com</p>
    </div>
  </body>
  </html>
`

// Helper function to calculate progress percentage for the progress bar
function calculateProgress(pkg) {
  const stages = ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];
  let currentStageIndex = 0;
  
  // Find the current stage based on tracking history
  for (let i = stages.length - 1; i >= 0; i--) {
    if (pkg.trackingHistory.some(event => event.status.includes(stages[i]))) {
      currentStageIndex = i;
      break;
    }
  }
  
  // Calculate percentage (each stage is 25% of the total)
  return Math.min(100, (currentStageIndex + 1) * 25);
}

// Helper function to check if a stage is completed
function isCompleted(pkg, stage) {
  return pkg.trackingHistory.some(event => event.status.includes(stage));
}

// Helper function to determine the class for tracking items
function getTrackingItemClass(event, pkg, index) {
  if (index === 0) {
    return 'current';
  } else if (event.status.includes('Delivered')) {
    return 'completed';
  } else {
    return '';
  }
}

  printWindow.document.write(content)
  printWindow.document.close()
  
  // Wait for the content to load and then print
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }
}

// Handle login function
const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'texmon2024') {
    isAuthenticated.value = true
    loginError.value = ''
  } else {
    loginError.value = 'Invalid username or password'
  }
}

// Handle logout function
const logout = () => {
  isAuthenticated.value = false
  username.value = ''
  password.value = ''
}

// Edit package functions
const openEditPackageModal = (pkg) => {
  editingPackage.value = { ...pkg }
  editData.value = {
    currentLocation: pkg.currentLocation,
    nextStop: pkg.nextStop,
    nextStopETA: pkg.nextStopETA,
    shippingAddress: { ...pkg.shippingAddress }
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingPackage.value = null
}

const editPackage = (pkg) => {
  openEditPackageModal(pkg)
}

const savePackageChanges = () => {
  if (!editingPackage.value) return

  // Update the package in the packages array
  packages.value = packages.value.map(pkg => {
    if (pkg.id === editingPackage.value.id) {
      return {
        ...pkg,
        currentLocation: editData.value.currentLocation,
        nextStop: editData.value.nextStop,
        nextStopETA: editData.value.nextStopETA,
        shippingAddress: { ...editData.value.shippingAddress },
        lastUpdated: new Date().toLocaleDateString()
      }
    }
    return pkg
  })

  closeEditModal()
}

// View package functions
const openViewPackageModal = (pkg) => {
  viewingPackage.value = { ...pkg }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewingPackage.value = null
}

const viewPackageDetails = (pkg) => {
  openViewPackageModal(pkg)
}

const editFromViewModal = () => {
  if (viewingPackage.value) {
    closeViewModal()
    editPackage(viewingPackage.value)
  }
}

// Add package functions
const openAddPackageModal = () => {
  showAddModal.value = true
  addPackageTab.value = 'details'
  resetNewPackageForm()
  resetTrackingStops()
}

const closeAddModal = () => {
  showAddModal.value = false
}

const addNewPackage = () => {
  if (validateForm()) {
    const newPackageToAdd = {
      id: Date.now(),
      trackingNumber: newPackage.value.trackingNumber,
      dispatchNumber: newPackage.value.dispatchNumber,
      type: newPackage.value.type,
      weight: newPackage.value.weight,
      shippedDate: newPackage.value.shippedDate,
      estimatedDelivery: newPackage.value.estimatedDelivery,
      currentLocation: newPackage.value.currentLocation,
      nextStop: newPackage.value.nextStop,
      nextStopETA: newPackage.value.nextStopETA,
      finalDestination: newPackage.value.finalDestination,
      shippingAddress: { ...newPackage.value.shippingAddress },
      lastUpdated: new Date().toLocaleDateString(),
      trackingHistory: [...trackingStops.value],
      comments: []
    }

    packages.value.push(newPackageToAdd)
    closeAddModal()
  }
}

const validateForm = () => {
  formErrors.value = {}
  let isValid = true

  if (!newPackage.value.trackingNumber) {
    formErrors.value.trackingNumber = 'Tracking number is required'
    isValid = false
  }

  if (!newPackage.value.dispatchNumber) {
    formErrors.value.dispatchNumber = 'Dispatch number is required'
    isValid = false
  }

  if (!newPackage.value.type) {
    formErrors.value.type = 'Package type is required'
    isValid = false
  }

  if (!newPackage.value.weight) {
    formErrors.value.weight = 'Weight is required'
    isValid = false
  }

  if (!newPackage.value.shippedDate) {
    formErrors.value.shippedDate = 'Shipped date is required'
    isValid = false
  }

  if (!newPackage.value.estimatedDelivery) {
    formErrors.value.estimatedDelivery = 'Estimated delivery is required'
    isValid = false
  }

  if (!newPackage.value.currentLocation) {
    formErrors.value.currentLocation = 'Current location is required'
    isValid = false
  }

  if (!newPackage.value.finalDestination) {
    formErrors.value.finalDestination = 'Final destination is required'
    isValid = false
  }

  if (trackingStops.value.length === 0) {
    stopErrors.value.general = 'At least one tracking stop is required'
    isValid = false
  } else {
    stopErrors.value.general = ''
  }

  return isValid
}

const resetNewPackageForm = () => {
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
      country: ''
    }
  }
  formErrors.value = {}
}

// Tracking stops functions
const addTrackingStop = () => {
  if (validateStopForm()) {
    trackingStops.value.push({ ...newStop.value })
    resetNewStopForm()
  }
}

const removeTrackingStop = (index) => {
  trackingStops.value.splice(index, 1)
}

const validateStopForm = () => {
  stopErrors.value = {}
  let isValid = true

  if (!newStop.value.status) {
    stopErrors.value.status = 'Status is required'
    isValid = false
  }

  if (!newStop.value.location) {
    stopErrors.value.location = 'Location is required'
    isValid = false
  }

  if (!newStop.value.timestamp) {
    stopErrors.value.timestamp = 'Date & Time is required'
    isValid = false
  }

  return isValid
}

const resetNewStopForm = () => {
  newStop.value = {
    status: '',
    location: '',
    timestamp: '',
    notes: '',
    comment: ''
  }
}

const resetTrackingStops = () => {
  trackingStops.value = []
}

// Location change handlers
const handleLocationChange = () => {
  editData.value.nextStop = getNextStop(editData.value.currentLocation)
  editData.value.nextStopETA = calculateEstimatedArrival(editData.value.currentLocation)
}

const handleNewPackageLocationChange = () => {
  newPackage.value.nextStop = getNextStop(newPackage.value.currentLocation)
  newPackage.value.nextStopETA = calculateEstimatedArrival(newPackage.value.currentLocation)
}

// Date formatting function
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Simulate authentication on mount for development purposes
  // isAuthenticated.value = true
})
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
