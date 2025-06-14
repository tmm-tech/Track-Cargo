<template>
  <div class="flex h-screen">

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

    <!-- Mobile Menu Overlay -->
    <div v-if="showMobileMenu && isAuthenticated" class="fixed inset-0 z-50 bg-black/50 md:hidden"
      @click="closeMobileMenu"></div>
    <!-- Sidebar Navigation -->
    <div v-if="isAuthenticated"
      class="sidebar bg-[#1e2338] text-white h-screen flex flex-col transition-all duration-300 shadow-lg relative z-50 overflow-hidden"
      :class="{
        'w-16': sidebarCollapsed && !isMobileDevice,
        'w-41': !sidebarCollapsed && !isMobileDevice,
        'fixed left-0 top-0 w-64 transform': isMobileDevice,
        'translate-x-0': isMobileDevice && showMobileMenu,
        '-translate-x-full': isMobileDevice && !showMobileMenu
      }">

      <!-- Logo and Brand -->
      <div class="py-4 px-3 flex items-center justify-center border-b border-gray-700/50"
        :class="{ 'px-2': sidebarCollapsed && !isMobileDevice }">
        <div class="flex items-center gap-3" :class="{ 'justify-center w-full': sidebarCollapsed && !isMobileDevice }">
          <img src="https://www.texmonlogistics.co.ke/assets/images/texmon-logo.png" alt="Texmon Logistics Logo"
            class="w-10 h-10 rounded object-contain" />
          <span v-if="!sidebarCollapsed || isMobileDevice"
            class="text-lg font-semibold tracking-wide text-gray-100 ">Texmon<br>Logistics</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div class="px-2 mb-3">
          <p v-if="!sidebarCollapsed || isMobileDevice" class="text-xs uppercase text-gray-500 font-medium px-3 py-2">
            Main Navigation</p>
          <nav class="space-y-1">
            <button @click="navigateToView('dashboard')"
              :title="(sidebarCollapsed && !isMobileDevice) ? 'Dashboard' : ''"
              class="flex items-center text-gray-300 hover:bg-[#273272] hover:text-white rounded-md transition-colors text-sm group relative"
              :class="{
                'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
                'px-3 py-2.5': !sidebarCollapsed || isMobileDevice,
                'bg-[#273272] text-white': currentView === 'dashboard'
              }" active-class="bg-[#273272] text-white">
              <HomeIcon
                :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
                class="flex-shrink-0" />
              <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 font-medium">Dashboard</span>
            </button>

            <button @click="navigateToView('packages')" :title="(sidebarCollapsed && !isMobileDevice) ? 'Cargos' : ''"
              class="flex items-center text-gray-300 hover:bg-[#273272] hover:text-white rounded-md transition-colors text-sm group relative"
              :class="{
                'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
                'px-3 py-2.5': !sidebarCollapsed || isMobileDevice,
                'bg-[#273272] text-white': currentView === 'packages'
              }" active-class="bg-[#273272] text-white">
              <ArchiveBoxIcon
                :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
                class="flex-shrink-0" />
              <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 font-medium">Cargo</span>
            </button>
            <button @click="navigateToView('locations')"
              :title="(sidebarCollapsed && !isMobileDevice) ? 'Locations' : ''"
              class="flex items-center text-gray-300 hover:bg-[#273272] hover:text-white rounded-md transition-colors text-sm group relative"
              :class="{
                'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
                'px-3 py-2.5': !sidebarCollapsed || isMobileDevice,
                'bg-[#273272] text-white': currentView === 'locations'
              }">
              <MapPinIcon
                :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
                class="flex-shrink-0" />
              <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 font-medium">Locations</span>
            </button>
            <button @click="navigateToView('users')" :title="(sidebarCollapsed && !isMobileDevice) ? 'Users' : ''"
              class="flex items-center text-gray-300 hover:bg-[#273272] hover:text-white rounded-md transition-colors text-sm group relative"
              :class="{
                'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
                'px-3 py-2.5': !sidebarCollapsed || isMobileDevice,
                'bg-[#273272] text-white': currentView === 'users'
              }" active-class="bg-[#273272] text-white">
              <UsersIcon
                :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
                class="flex-shrink-0" />
              <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 font-medium">Users</span>
            </button>
          </nav>
        </div>

        <div class="px-2 mb-3">
          <p v-if="!sidebarCollapsed || isMobileDevice" class="text-xs uppercase text-gray-500 font-medium px-3 py-2">
            System</p>
          <nav class="space-y-1">
            <button @click="navigateToView('activity')"
              :title="(sidebarCollapsed && !isMobileDevice) ? 'Activity Log' : ''"
              class="flex items-center text-gray-300 hover:bg-[#273272] hover:text-white rounded-md transition-colors text-sm group relative"
              :class="{
                'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
                'px-3 py-2.5': !sidebarCollapsed || isMobileDevice,
                'bg-[#273272] text-white': currentView === 'activity'
              }" active-class="bg-[#273272] text-white">
              <ClockIcon
                :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
                class="flex-shrink-0" />
              <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 font-medium">Activity Log</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Sidebar Toggle (Desktop only) -->
      <div v-if="!isMobileDevice" :class="[
        'p-2 transition-all duration-300',
        sidebarCollapsed ? 'flex justify-center' : 'flex justify-end'
      ]">
        <button @click="toggleSidebar" class="text-gray-400 hover:text-white transition-all duration-300"
          :title="sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'">
          <ChevronRightIcon v-if="sidebarCollapsed" class="h-5 w-5" />
          <ChevronLeftIcon v-else class="h-5 w-5" />
        </button>
      </div>


      <!-- User Profile & Logout -->
      <div class="border-t border-gray-700/50 pt-3 pb-3 px-3" :class="{ 'px-2': sidebarCollapsed && !isMobileDevice }">
        <div v-if="!sidebarCollapsed || isMobileDevice" class="flex items-center p-3 mb-3 rounded-md bg-gray-800/30">
          <div
            class="h-9 w-9 rounded-full bg-[#273272] flex items-center justify-center text-white text-sm font-medium">
            {{ currentUser.initials }}
          </div>
          <div class="ml-3 overflow-hidden">
            <p class="text-sm font-medium text-white truncate">{{ currentUser.fullname }}</p>
            <p class="text-xs text-gray-400">{{ currentUser.roles }}</p>
          </div>
        </div>
        <div v-else class="flex justify-center mb-3">
          <div
            class="h-9 w-9 rounded-full bg-[#273272] flex items-center justify-center text-white text-sm font-medium">
            {{ currentUser.initials }}
          </div>
        </div>

        <button @click="logout" :title="(sidebarCollapsed && !isMobileDevice) ? 'Log Out' : ''"
          class="w-full flex items-center text-gray-300 hover:bg-red-600 hover:text-white rounded-md transition-colors group relative"
          :class="{
            'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
            'px-3 py-2.5': !sidebarCollapsed || isMobileDevice
          }">
          <LogOut
            :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
            class="flex-shrink-0" />
          <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 text-sm">Logout</span>
        </button>
      </div>
    </div>


    <!-- Main Content -->
    <div class="flex-1 flex flex-col" :class="{ 'md:ml-0': isMobileDevice }">
      <!-- Header -->
      <header class="bg-[#273272] text-white">
        <div class="container mx-auto">
          <div class="flex justify-between items-center py-2 px-4">
            <div class="flex items-center">
              <!-- Mobile Menu Button -->
              <button v-if="isMobileDevice && isAuthenticated" @click="toggleMobileMenu"
                class="mr-3 p-1 rounded-md hover:bg-white/10 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16">
                  </path>
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
                  <div
                    class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-[#273272] font-medium">
                    {{ currentUser.initials }}
                  </div>
                </div>
              </div>
              <button @click="logout" class="text-sm hover:text-[#ffb600] transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Logo section -->
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
                <input id="username" placeholder="Enter your username" v-model="username"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required />
              </div>
              <div class="space-y-2">
                <label for="password" class="text-sm font-medium">Password</label>
                <input id="password" type="password" placeholder="Enter your password" v-model="password"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required />
              </div>
              <button type="submit"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] h-10 px-4 py-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clip-rule="evenodd" />
                </svg>
                Login
              </button>
            </form>
          </div>
        </div>
      </main>

      <!-- Admin Dashboard -->
      <main v-else class="flex-1 bg-gray-50 py-8 overflow-auto">
        <div class="container mx-auto px-2 sm:px-4">
          <!-- Dashboard View (default) -->
          <div v-if="currentView === 'dashboard'" class="space-y-6 sm:space-y-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div class="bg-white rounded-lg shadow p-3 sm:p-6 border-l-4 border-[#273272]">
                <div class="flex items-center">
                  <div class="p-2 sm:p-3 rounded-full bg-[#273272]/10 mr-2 sm:mr-4">
                    <ArchiveBoxIcon class="h-4 w-4 sm:h-6 sm:w-6 text-[#273272]" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500">Total Cargos</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ packages.length }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow  p-3 sm:p-6 border-l-4 border-[#ffb600]">
                <div class="flex items-center">
                  <div class="p-2 sm:p-3 rounded-full bg-[#ffb600]/10 mr-2 sm:mr-4">
                    <TruckIcon class="h-4 w-4 sm:h-6 sm:w-6 text-[#ffb600]" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500">In Transit</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ getCargosByStatus('in transit') }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div class="flex items-center">
                  <div class="p-2 sm:p-3 rounded-full bg-green-500/10 mr-2 sm:mr-4">
                    <CheckCircleIcon class="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500">Delivered</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ getCargosByStatus('delivered') }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow p-3 sm:p-6 border-l-4 border-red-500">
                <div class="flex items-center">
                  <div class="p-2 sm:p-3 rounded-full bg-red-500/10 mr-2 sm:mr-4">
                    <ClockIcon class="h-4 w-4 sm:h-6 sm:w-6 text-red-500" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500">Delayed</p>
                    <p class="text-lg sm:text-2xl font-bold">{{ getCargosByStatus('delayed') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div class="lg:col-span-2 bg-white rounded-lg shadow">
                <div class="p-4 sm:p-6 border-b">
                  <h3 class="text-base sm:text-lg font-semibold">Recent Activity</h3>
                </div>
                <div class="p-4 sm:p-6">
                  <div class="space-y-4 sm:space-y-6">
                    <div v-for="(activity, index) in recentActivity" :key="index" class="flex">
                      <div class="mr-3 sm:mr-4">
                        <div
                          class="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#273272]/10 flex items-center justify-center">
                          <component :is="getActivityIcon(activity.type)"
                            class="h-4 w-4 sm:h-5 sm:w-5 text-[#273272]" />
                        </div>
                      </div>
                      <div>
                        <p class="text-xs sm:text-sm font-medium">{{ activity.message }}</p>
                        <div class="flex items-center mt-1">
                          <p class="text-xs text-gray-500">{{ activity.user }}</p>
                          <span class="mx-1 text-gray-500">•</span>
                          <p class="text-xs text-gray-500">{{ activity.time }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow">
                <div class="p-4 sm:p-6 border-b">
                  <h3 class="text-base sm:text-lg font-semibold">User Statistics</h3>
                </div>
                <div class="p-4 sm:p-6">
                  <div class="space-y-4">
                    <div class="flex justify-between items-center">
                      <span class="text-xs sm:text-sm font-medium">Total Users</span>
                      <span class="text-xs sm:text-sm font-bold">{{ users.length }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs sm:text-sm font-medium">Admins</span>
                      <span class="text-xs sm:text-sm font-bold">{{ getUsersByRole('admin') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs sm:text-sm font-medium">Operators</span>
                      <span class="text-xs sm:text-sm font-bold">{{ getUsersByRole('operator') }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs sm:text-sm font-medium">Viewers</span>
                      <span class="text-xs sm:text-sm font-bold">{{ getUsersByRole('viewer') }}</span>
                    </div>
                  </div>

                  <div class="mt-6">
                    <button @click="currentView = 'users'"
                      class="w-full inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-8 sm:h-10 px-3 sm:px-4 py-2">
                      Manage Users
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- User Management View -->
          <div v-if="currentView === 'users'" class="space-y-8">
            <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
              <div class="flex flex-row items-center justify-between bg-[#273272] text-white p-6 rounded-t-lg">
                <div>
                  <h2 class="text-xl font-semibold">User Management</h2>
                  <p class="text-gray-200">
                    Create, edit, and manage user accounts and permissions
                  </p>
                </div>
                <button @click="openAddUserModal"
                  class="bg-transparent text-white border border-white hover:bg-red-600 hover:border-red-600 transition-colors duration-300 px-4 py-2 rounded inline-flex items-center">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add User
                </button>
              </div>
              <div class="p-6">
                <div class="mb-6">
                  <div class="relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input placeholder="Search users by name or email" v-model="userSearchTerm"
                      class="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                  </div>
                </div>

                <div class="rounded-md border border-gray-200 overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last
                          Login
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-if="filteredUsers.length === 0">
                        <td colspan="6" class="text-center py-4 text-gray-500">No users found</td>
                      </tr>
                      <tr v-for="user in filteredUsers" :key="user.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div
                              class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[#273272] font-medium">
                              {{ getInitials(user.fullname) }}
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ user.fullname }}</div>
                              <div class="text-sm text-gray-500">{{ user.username }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                            user.roles === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.roles === 'operator' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                          ]">
                            {{ user.roles.charAt(0).toUpperCase() + user.roles.slice(1) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ]">
                            {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.lastlogin || 'Never' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div class="flex justify-end gap-2">
                            <button
                              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                              @click="editUser(user)">
                              <PencilIcon class="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                              @click="resetUserPassword(user)">
                              <KeyIcon class="h-4 w-4 mr-1" />
                              Reset
                            </button>
                            <button
                              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 h-9 px-3"
                              @click="confirmDeleteUser(user)">
                              <TrashIcon class="h-4 w-4" />
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

          <!-- Cargo Management View -->
          <div v-if="currentView === 'packages'" class="space-y-6 sm:space-y-8">
            <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-6 sm:mb-8">
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#273272] text-white p-4 sm:p-6 rounded-t-lg gap-4 sm:gap-0">
                <div>
                  <h2 class="text-lg sm:text-xl font-semibold">Cargo Management</h2>
                  <p class="text-gray-200 text-sm">
                    Update the current location and next stop information for shipments.
                  </p>
                </div>
                <button @click="openAddCargoModal"
                  class="bg-transparent text-white border border-white hover:bg-red-600 hover:border-red-600 transition-colors duration-300 px-3 sm:px-4 py-2 rounded inline-flex items-center text-sm">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  <span class="hidden sm:inline">Add Cargo</span>
                  <span class="sm:hidden">Add</span>
                </button>
              </div>
              <div class="p-4 sm:p-6">
                <div class="mb-4 sm:mb-6">
                  <div class="relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input placeholder="Search by container, B/L or truck number" v-model="searchTerm"
                      class="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#273272] focus:ring-offset-2" />
                  </div>
                </div>

                <!-- Desktop Table View -->
                <div class="hidden md:block w-full overflow-hidden rounded-md border border-gray-200">
                  <div class="overflow-x-auto max-w-full">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Container #</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Truck #</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            BL #</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Current Location</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Next Stop</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Next Stop ETA</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Last Updated</th>
                          <th scope="col"
                            class="px-4 sm:px-5 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Actions</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="filteredCargos.length === 0">
                          <td colspan="8" class="text-center py-4 text-gray-500">No shipment found</td>
                        </tr>
                        <tr v-for="pkg in filteredCargos" :key="pkg.id" class="hover:bg-gray-50">
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {{ pkg.container_number || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ pkg.truck_number || 'N/A' }}
                          </td>

                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ pkg.bl_number || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 max-w-xs truncate"
                            :title="pkg.current_location">
                            {{ pkg.current_location || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 max-w-xs truncate" :title="pkg.nex_stop">
                            {{ pkg.next_stop || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ formatDate(pkg.next_stop_eta) || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ formatDate(pkg.latest_timestamp) || 'N/A' }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-right text-sm font-medium whitespace-nowrap">
                            <div class="flex justify-end gap-1">
                              <button
                                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-8 px-2"
                                @click="viewCargoDetails(pkg)" title="View Details">
                                View
                              </button>
                              <button
                                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-8 px-2"
                                @click="editCargo(pkg)" title="Edit Cargo">
                                <PencilIcon class="h-3 w-3" />
                              </button>
                              <button
                                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-8 px-2"
                                @click="printCargoDetails(pkg)" title="Print Details">
                                <PrinterIcon class="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Mobile-friendly card view for smaller screens -->
                <div class="block md:hidden">
                  <div class="space-y-4">
                    <div v-for="pkg in filteredCargos" :key="pkg.id"
                      class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                          <h3 class="font-bold text-gray-900 text-sm">{{ pkg.containerNumber }}</h3>
                          <p class="text-xs text-gray-500 mt-1">{{ pkg.truckNumber }} • {{ pkg.blNumber }}</p>
                        </div>
                        <div class="flex gap-1 ml-2">
                          <button @click="viewCargoDetails(pkg)"
                            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="View Details">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                              </path>
                            </svg>
                          </button>
                          <button @click="editCargo(pkg)"
                            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Print Details">
                            <PencilIcon class="h-4 w-4" />
                          </button>
                          <button @click="printCargoDetails(pkg)"
                            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Print Details">
                            <PrinterIcon class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 gap-2 text-xs">
                        <div class="flex justify-between">
                          <span class="text-gray-500">Current:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ pkg.current_location ||
                            'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">Next:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ pkg.next_stop || 'N/A'
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">ETA:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ formatDate(pkg.next_stop_eta)
                            || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">Updated:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{
                            formatDate(pkg.latest_timestamp) || 'N/A' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Log View -->
          <div v-if="currentView === 'activity'" class="space-y-8">
            <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
              <div class="bg-[#273272] text-white p-6 rounded-t-lg">
                <h2 class="text-xl font-semibold">Activity Log</h2>
                <p class="text-gray-200">
                  Track all user actions and system events
                </p>
              </div>
              <div class="p-6">
                <div class="mb-6 flex flex-wrap gap-4">
                  <div class="relative flex-1">
                    <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input placeholder="Search activity log" v-model="activitySearchTerm"
                      class="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                  </div>

                  <select v-model="activityFilter"
                    class="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="all">All Activities</option>
                    <option value="login">Login Events</option>
                    <option value="package">Cargo Updates</option>
                    <option value="user">User Management</option>
                  </select>
                </div>

                <div class="space-y-6">
                  <div v-for="(activity, index) in filteredActivities" :key="index"
                    class="flex p-4 border-b border-gray-100">
                    <div class="mr-4">
                      <div :class="[
                        'h-10 w-10 rounded-full flex items-center justify-center',
                        activity.type === 'login' ? 'bg-green-100 text-green-600' :
                          activity.type === 'package' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'user' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                      ]">
                        <component :is="getActivityIcon(activity.type)" class="h-5 w-5" />
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <div>
                          <p class="font-medium">{{ activity.message }}</p>
                          <div class="flex items-center mt-1">
                            <p class="text-sm text-gray-500">{{ activity.user }}</p>
                            <span class="mx-1 text-gray-500">•</span>
                            <p class="text-sm text-gray-500">{{ activity.time }}</p>
                          </div>
                        </div>
                        <div :class="[
                          'px-2 py-1 text-xs font-semibold rounded-full',
                          activity.type === 'login' ? 'bg-green-100 text-green-800' :
                            activity.type === 'package' ? 'bg-blue-100 text-blue-800' :
                              activity.type === 'user' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                        ]">
                          {{ activity.type.charAt(0).toUpperCase() + activity.type.slice(1) }}
                        </div>
                      </div>
                      <div v-if="activity.details" class="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                        {{ activity.details }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="filteredActivities.length === 0" class="text-center py-8">
                  <p class="text-gray-500">No activity logs found</p>
                </div>

                <div class="mt-6 flex justify-between items-center">
                  <div class="text-sm text-gray-500">
                    Showing {{ filteredActivities.length }} of {{ activityLogs.length }} activities
                  </div>
                  <div class="flex space-x-2">
                    <button class="px-3 py-1 rounded border text-sm">Previous</button>
                    <button class="px-3 py-1 rounded border bg-[#273272] text-white text-sm">1</button>
                    <button class="px-3 py-1 rounded border text-sm">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Edit Cargo Modal -->
          <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeEditModal">
            <div class="bg-white rounded-lg shadow-lg max-w-[600px] w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Update Cargo Information</h2>
                  <p class="text-sm text-muted-foreground">Update the package location and shipping address information.
                  </p>
                </div>

                <div v-if="editingCargo" class="space-y-4 py-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Container Number</p>
                      <p>{{ editingCargo.container_number }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Truck Number</p>
                      <p>{{ editingCargo.truck_number }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">BL Number</p>
                      <p>{{ editingCargo.bl_number }}</p>
                    </div>
                  </div>

                  <div>
                    <div
                      class="w-full max-w-md mx-auto rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-1 flex">
                      <button :class="[
                        'flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        activeEditTab === 'location' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                      ]" @click="activeEditTab = 'location'">
                        Location
                      </button>
                    </div>
                    <div v-if="activeEditTab === 'location'" class="space-y-4 mt-4">
                      <div class="space-y-2">
                        <label for="currentLocation" class="text-sm font-medium">Current Location</label>
                        <select id="currentLocation" v-model="editData.current_location" @change="handleLocationChange"
                          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          <option value="" disabled>Select location</option>
                          <option v-for="location in locations" :key="location.id" :value="location.name">
                            {{ location.name }}
                          </option>
                        </select>
                      </div>
                      <div class="space-y-2">
                        <label for="status" class="text-sm font-medium">Status</label>
                        <select id="status" v-model="newStop.status"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', stopErrors.status ? 'border-red-500' : '']">
                          <option value="" disabled selected>Select Status</option>
                          <option value="in transit">In Transit</option>
                          <option value="pending">Pending</option>
                          <option value="delivered">Delivered</option>
                          <option value="delayed">Delayed</option>
                          <option value="processing">Processing</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="sorted">sorted</option>
                          <option value="out for delivery">Out for Delivery</option>
                          <option value="arrived at destination">Arrived at Destination</option>
                          <option value="departed from origin">Departed from Origin</option>
                          <option value="customs clearance">Customs Clearance</option>
                          <option value="awaiting pickup">Awaiting Pickup</option>
                          <option value="ready for pickup">Ready for Pickup</option>
                          <option value="on hold">On Hold</option>
                          <option value="returned to sender">Returned to Sender</option>
                          <option value="damaged">Damaged</option>
                          <option value="lost">Lost</option>
                          <option value="rejected">Rejected</option>
                          <option value="rescheduled">Rescheduled</option>
                          <option value="delivered to agent">Delivered to Agent</option>
                          <option value="awaiting customs clearance">Awaiting Customs Clearance</option>
                          `<option value="documentation requested">Docummentation Requested</option>
                          <option value="awaiting final delivery">Awaiting Final Delivery</option>
                          <option value="awaiting pickup instructions">Awaiting Pickup Instructions</option>`
                        </select>
                        <p v-if="stopErrors.status" class="text-red-500 text-sm">{{ stopErrors.status }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label for="nextStop" class="text-sm font-medium">Next Stop</label>
                          <select id="nextStop" v-model="editData.next_stop"
                            class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <option value="" disabled>Select next stop</option>
                            <option v-for="location in locations" :key="location.id" :value="location.name">
                              {{ location.name }}
                            </option>
                          </select>
                          <p class="text-xs text-gray-500">Automatically determined based on current location</p>
                        </div>
                        <div class="space-y-2">
                          <label for="nextStopETA" class="text-sm font-medium">Next Stop ETA</label>
                          <input id="nextStopETA" type="date" v-model="editData.next_stop_eta"
                            class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                          <p class="text-xs text-gray-500">Estimated based on standard transit times</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 pt-6 border-t">
                  <h3 class="text-lg font-medium mb-4">Comments</h3>
                  <div v-if="editingCargo.comment && editingCargo.comment.length > 0" class="space-y-4 mb-6">
                    <div v-for="(comment, index) in [...editingCargo.comment].reverse()" <!-- reverse to show newest
                      first -->
                      :key="index"
                      class="bg-gray-50 p-4 rounded-md"
                      >
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

                  <form @submit.prevent="addComment(editingCargo.id)" class="space-y-4">
                    <div class="space-y-2">
                      <label for="editCommentText" class="text-sm font-medium">Add Comment</label>
                      <textarea id="editCommentText" v-model="newComment.text" rows="3"
                        placeholder="Enter your comment here..."
                        class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                    </div>
                    <button type="submit"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                      Add Comment
                    </button>
                  </form>
                </div>


                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    @click="closeEditModal">
                    Cancel
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
                    @click="saveEditedCargo">
                    <DocumentCheckIcon class="h-4 w-4 mr-2" />
                    Update Cargo
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Locations Management View -->
          <div v-if="currentView === 'locations'" class="space-y-8">
            <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-8">
              <div class="flex flex-row items-center justify-between bg-[#273272] text-white p-6 rounded-t-lg">
                <div>
                  <h2 class="text-xl font-semibold">Location Management</h2>
                  <p class="text-gray-200">
                    Manage shipping locations and transit points
                  </p>
                </div>
                <button @click="openAddLocationModal"
                  class="bg-transparent text-white border border-white hover:bg-[#ffb600] hover:border-[#ffb600] hover:text-[#273272] transition-colors duration-300 px-4 py-2 rounded inline-flex items-center">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add Location
                </button>
              </div>
              <div class="p-6">
                <div class="mb-6">
                  <div class="relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input placeholder="Search locations by name, or country" v-model="locationSearchTerm"
                      class="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
                  </div>
                </div>

                <div class="rounded-md border border-gray-200 overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location Name
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Country
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col"
                          class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-if="filteredLocations.length === 0">
                        <td colspan="6" class="text-center py-4 text-gray-500">No locations found</td>
                      </tr>
                      <tr v-for="location in filteredLocations" :key="location.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div
                              class="flex-shrink-0 h-10 w-10 rounded-full bg-[#273272]/10 flex items-center justify-center">
                              <MapPinIcon class="h-5 w-5 text-[#273272]" />
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ location.name }}</div>
                              <div class="text-sm text-gray-500">{{ location.address }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                            location.type === 'warehouse' ? 'bg-blue-100 text-blue-800' :
                              location.type === 'port' ? 'bg-green-100 text-green-800' :
                                location.type === 'transit' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                          ]">
                            {{ location.type.charAt(0).toUpperCase() + location.type.slice(1) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ location.country }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                            location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ]">
                            {{ location.status.charAt(0).toUpperCase() + location.status.slice(1) }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div class="flex justify-end gap-2">
                            <button
                              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                              @click="viewLocation(location)">
                              <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                                </path>
                              </svg>
                              View
                            </button>
                            <button
                              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                              @click="editLocation(location)">
                              <PencilIcon class="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 h-9 px-3"
                              @click="confirmDeleteLocation(location)">
                              <TrashIcon class="h-4 w-4" />
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

          <!-- Add Location Modal -->
          <div v-if="showAddLocationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeAddLocationModal">
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Add New Location</h2>
                  <p class="text-sm text-muted-foreground">Create a new shipping location or transit point.</p>
                </div>

                <form @submit.prevent="addNewLocation" class="space-y-4 py-4">
                  <div class="space-y-2">
                    <label for="location-name" class="text-sm font-medium">Location Name</label>
                    <input id="location-name" v-model="newLocation.name"
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', locationFormErrors.name ? 'border-red-500' : '']" />
                    <p v-if="locationFormErrors.name" class="text-red-500 text-sm">{{ locationFormErrors.name }}</p>
                  </div>

                  <div class="space-y-2">
                    <label for="location-type" class="text-sm font-medium">Type</label>
                    <select id="location-type" v-model="newLocation.type"
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', locationFormErrors.type ? 'border-red-500' : '']">
                      <option value="" disabled selected>Select type</option>
                      <option value="warehouse">Warehouse</option>
                      <option value="port">Port</option>
                      <option value="transit">Transit Point</option>
                      <option value="destination">Destination</option>
                    </select>
                    <p v-if="locationFormErrors.type" class="text-red-500 text-sm">{{ locationFormErrors.type }}</p>
                  </div>

                  <div class="space-y-2">
                    <label for="location-address" class="text-sm font-medium">Address</label>
                    <textarea id="location-address" v-model="newLocation.address" rows="3"
                      :class="['flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', locationFormErrors.address ? 'border-red-500' : '']"></textarea>
                    <p v-if="locationFormErrors.address" class="text-red-500 text-sm">{{ locationFormErrors.address }}
                    </p>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="location-city" class="text-sm font-medium">City</label>
                      <input id="location-city" v-model="newLocation.city"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', locationFormErrors.city ? 'border-red-500' : '']" />
                      <p v-if="locationFormErrors.city" class="text-red-500 text-sm">{{ locationFormErrors.city }}</p>
                    </div>
                    <div class="space-y-2">
                      <label for="location-country" class="text-sm font-medium">Country</label>
                      <input id="location-country" v-model="newLocation.country"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', locationFormErrors.country ? 'border-red-500' : '']" />
                      <p v-if="locationFormErrors.country" class="text-red-500 text-sm">{{ locationFormErrors.country }}
                      </p>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="location-coordinates" class="text-sm font-medium">Coordinates (Optional)</label>
                    <input id="location-coordinates" v-model="newLocation.coordinates"
                      placeholder="e.g., -1.2921, 36.8219"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>

                  <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                    <button type="button"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      @click="closeAddLocationModal">
                      Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                      <span v-if="!isSubmitting">Add Location</span>
                      <span v-else class="flex items-center">
                        <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"
                            fill="none" />
                          <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Edit Location Modal -->
          <div v-if="showEditLocationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeEditLocationModal">
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Edit Location</h2>
                  <p class="text-sm text-muted-foreground">Update location information.</p>
                </div>

                <form @submit.prevent="updateLocation" class="space-y-4 py-4">
                  <div class="space-y-2">
                    <label for="edit-location-name" class="text-sm font-medium">Location Name</label>
                    <input id="edit-location-name" v-model="editingLocation.name"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>

                  <div class="space-y-2">
                    <label for="edit-location-type" class="text-sm font-medium">Type</label>
                    <select id="edit-location-type" v-model="editingLocation.type"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="warehouse">Warehouse</option>
                      <option value="port">Port</option>
                      <option value="transit">Transit Point</option>
                      <option value="destination">Destination</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label for="edit-location-address" class="text-sm font-medium">Address</label>
                    <textarea id="edit-location-address" v-model="editingLocation.address" rows="3"
                      class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label for="edit-location-city" class="text-sm font-medium">City</label>
                      <input id="edit-location-city" v-model="editingLocation.city"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>
                    <div class="space-y-2">
                      <label for="edit-location-country" class="text-sm font-medium">Country</label>
                      <input id="edit-location-country" v-model="editingLocation.country"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label for="edit-location-coordinates" class="text-sm font-medium">Coordinates</label>
                    <input id="edit-location-coordinates" v-model="editingLocation.coordinates"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                  </div>

                  <div class="space-y-2">
                    <label for="edit-location-status" class="text-sm font-medium">Status</label>
                    <select id="edit-location-status" v-model="editingLocation.status"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                    <button type="button"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      @click="closeEditLocationModal">
                      Cancel
                    </button>
                    <button type="submit"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                      Update Location
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- View Location Modal -->
          <div v-if="showViewLocationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeViewLocationModal">
            <div class="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Location Details</h2>
                  <p class="text-sm text-muted-foreground" v-if="viewingLocation">
                    {{ viewingLocation.name }}
                  </p>
                </div>

                <div v-if="viewingLocation" class="space-y-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Location Name</p>
                      <p class="text-lg">{{ viewingLocation.name }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Type</p>
                      <span :class="[
                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        viewingLocation.type === 'warehouse' ? 'bg-blue-100 text-blue-800' :
                          viewingLocation.type === 'port' ? 'bg-green-100 text-green-800' :
                            viewingLocation.type === 'transit' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                      ]">
                        {{ viewingLocation.type.charAt(0).toUpperCase() + viewingLocation.type.slice(1) }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Status</p>
                      <span :class="[
                        'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                        viewingLocation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      ]">
                        {{ viewingLocation.status.charAt(0).toUpperCase() + viewingLocation.status.slice(1) }}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p class="text-sm font-medium text-gray-500 mb-2">Address</p>
                    <div class="bg-gray-50 p-3 rounded-md">
                      <p>{{ viewingLocation.address }}</p>
                      <p class="text-sm text-gray-600 mt-1">{{ viewingLocation.city }}, {{ viewingLocation.country }}
                      </p>
                    </div>
                  </div>

                  <div v-if="viewingLocation.coordinates">
                    <p class="text-sm font-medium text-gray-500 mb-2">Coordinates</p>
                    <p class="font-mono text-sm bg-gray-50 p-2 rounded">{{ viewingLocation.coordinates }}</p>
                  </div>

                  <div>
                    <p class="text-sm font-medium text-gray-500 mb-2">Created</p>
                    <p class="text-sm">{{ formatDate(viewingLocation.created_at) }}</p>
                  </div>
                </div>

                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    @click="closeViewLocationModal">
                    Close
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
                    @click="editFromViewLocationModal(viewingLocation)">
                    <PencilIcon class="h-4 w-4 mr-2" />
                    Edit Location
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete Location Confirmation Modal -->
          <div v-if="showDeleteLocationModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Confirm Delete</h2>
                  <p class="text-sm text-muted-foreground">Are you sure you want to delete this location? This action
                    cannot be undone.</p>
                </div>

                <div class="p-4 bg-red-50 rounded-md mb-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">Warning</h3>
                      <div class="mt-2 text-sm text-red-700">
                        <p>Deleting this location may affect existing shipment and tracking history.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="locationToDelete" class="py-4 border-t border-b">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full bg-[#273272]/10 flex items-center justify-center">
                      <MapPinIcon class="h-5 w-5 text-[#273272]" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ locationToDelete.name }}</div>
                      <div class="text-sm text-gray-500">{{ locationToDelete.city }}, {{
                        locationToDelete.country }}</div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    @click="closeDeleteLocationModal">
                    Cancel
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
                    @click="deleteLocation">
                    Delete Location
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- View Cargo Modal -->
          <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeViewModal">
            <div class="bg-white rounded-lg shadow-lg max-w-[800px] w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Cargo Details</h2>
                  <p class="text-sm text-muted-foreground" v-if="viewingCargo">
                    Container Number: {{ viewingCargo.container_number }} | Truck Number: {{
                      viewingCargo.truck_number
                    }}
                    |
                    BL Number: {{ viewingCargo.bl_number }}
                  </p>
                </div>

                <div v-if="viewingCargo" class="space-y-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Cargo Type</p>
                      <p class="text-lg">{{ viewingCargo.type.toUpperCase() }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Weight</p>
                      <p class="text-lg">{{ viewingCargo.weight }} kg</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Shipped Date</p>
                      <p class="text-lg">{{ formatDate(viewingCargo.shipped_date) }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Estimated Delivery</p>
                      <p class="text-lg">{{ formatDate(viewingCargo.estimated_delivery) }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Final Destination</p>
                      <p class="text-lg">{{ viewingCargo.final_destination }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Last Updated</p>
                      <p class="text-lg">{{ formatDate(viewingCargo.latest_timestamp) }}</p>
                    </div>
                  </div>

                  <!-- Cargo Address Card -->
                  <div class="rounded-lg border bg-white shadow-lg overflow-hidden">
                    <div class="bg-[#273272] text-white p-6 rounded-t-lg flex items-center">
                      <MapPinIcon class="h-5 w-5 mr-2" />
                      <h3 class="text-xl font-semibold">Cargo Address</h3>
                    </div>
                    <div class="p-6">
                      <div v-if="viewingCargo.shipping_address" class="space-y-1">
                        <p class="font-medium">{{ viewingCargo.shipping_address.recipientName }}</p>
                        <p>{{ viewingCargo.shipping_address.streetAddress }}</p>
                        <p>
                          {{ viewingCargo.shipping_address.city }}, {{ viewingCargo.shipping_address.state }}
                        </p>
                        <p>{{ viewingCargo.shipping_address.country }}</p>
                      </div>
                      <p v-else class="text-gray-500">No shipping address information available</p>
                    </div>
                  </div>
                  <pre>{{ JSON.stringify(viewingCargo.latest_history, null, 2) }}</pre>
                  <!-- Cargo Progress -->
                  <ShippingProgress v-if="viewingCargo && viewingCargo.tracking_history"  :tracking_history="viewingCargo.tracking_history || []"
                    :current_location="viewingCargo.current_location" :next_stop="viewingCargo.next_stop"
                    :next_stop_eta="viewingCargo.next_stop_eta" :final_destination="viewingCargo.final_destination"
                    :estimated_delivery="viewingCargo.estimated_delivery" showComments />
                </div>

                <!-- Comments Section -->
                <div class="rounded-lg border bg-white shadow-lg overflow-hidden mt-6">
                  <div class="bg-[#273272] text-white p-6 rounded-t-lg flex items-center">
                    <ChatBubbleLeftRightIcon class="h-5 w-5 mr-2" />
                    <h3 class="text-xl font-semibold">Comments</h3>
                  </div>
                  <div class="p-6">
                    <div v-if="viewingCargo && viewingCargo.tracking_history.length > 0" class="space-y-4 mb-6">
                      <div v-for="(comments, index) in viewingCargo.comment" :key="index"
                        class="bg-gray-50 p-4 rounded-md">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="font-medium">{{ comments.author }}</p>
                            <p class="text-sm text-gray-500">{{ comments.timestamp }}</p>
                          </div>
                        </div>
                        <p class="mt-2">{{ comments.text }}</p>
                      </div>
                    </div>
                    <div v-else class="text-gray-500 mb-6">No comments yet</div>

                    <form @submit.prevent="addComment(viewingCargo.id)" class="space-y-4">
                      <div class="space-y-2">
                        <label for="commentText" class="text-sm font-medium">Add Comment</label>
                        <textarea id="commentText" v-model="newComment.text" rows="3"
                          placeholder="Enter your comment here..."
                          class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                      </div>
                      <button type="submit"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                        Add Comment
                      </button>
                    </form>
                  </div>
                </div>

                <div class="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 space-y-2 sm:space-y-0"
                    @click="closeViewModal">
                    Close
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 space-y-2 sm:space-y-0"
                    @click="editFromViewModal(viewingCargo)">
                    <PencilIcon class="h-4 w-4 mr-2" />
                    Edit Cargo
                  </button>
                  <button
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#ffb600] text-[#273272] hover:bg-[#e6a500] h-10 px-4 space-y-2 sm:space-y-0"
                    @click="openTrackingDialog(pkg)">
                    <PrinterIcon class="h-4 w-4 mr-2" />
                    Print Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Cargo Modal -->
          <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeAddModal">
            <div class="bg-white rounded-lg shadow-lg max-w-[800px] w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Add New Cargo</h2>
                  <p class="text-sm text-muted-foreground">Enter the details for the new package and its tracking
                    history.
                  </p>
                </div>

                <div>
                  <div
                    class="w-full max-w-md mx-auto rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 p-1 flex">
                    <button :class="[
                      'flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      addCargoTab === 'details' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                    ]" @click="addCargoTab = 'details'">
                      Package Details
                    </button>
                    <button :class="[
                      'flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      addCargoTab === 'address' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                    ]" @click="addCargoTab = 'address'">
                      Shipping Address
                    </button>
                    <button :class="[
                      'flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      addCargoTab === 'stops' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                    ]" @click="addCargoTab = 'stops'">
                      Tracking Stops
                    </button>
                  </div>


                  <div v-if="addCargoTab === 'details'" class="space-y-4 mt-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="containerNumber" class="text-sm font-medium">Container Number</label>
                        <input id="containerNumber" v-model="newCargo.container_number"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.container_number ? 'border-red-500' : '']" />
                        <p v-if="formErrors.container_number" class="text-red-500 text-sm">{{
                          formErrors.container_number
                        }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label for="truckNumber" class="text-sm font-medium">Truck Number</label>
                        <input id="truckNumber" v-model="newCargo.truck_number"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.truck_number ? 'border-red-500' : '']" />
                        <p v-if="formErrors.truck_number" class="text-red-500 text-sm">{{ formErrors.truck_number }}</p>
                      </div>
                      <div class="space-y-2">
                        <label for="blNumber" class="text-sm font-medium">BL Number</label>
                        <input id="blNumber" v-model="newCargo.bl_number"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.bl_number ? 'border-red-500' : '']" />
                        <p v-if="formErrors.bl_number" class="text-red-500 text-sm">{{ formErrors.bl_number }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="type" class="text-sm font-medium">Cargo Type</label>
                        <select id="type" v-model="newCargo.type"
                          :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', formErrors.type ? 'border-red-500' : '']">
                          <option value="" disabled selected>Select Cargo Type</option>
                          <option value="fcl">FCL (Full Container Load)</option>
                          <option value="lcl">LCL (Less than Container Load)</option>
                        </select>
                        <p v-if="formErrors.type" class="text-red-500 text-sm">{{ formErrors.type }}</p>
                      </div>
                      <div class="space-y-2">
                        <label for="weight" class="text-sm font-medium">Weight (kg)</label>
                        <input id="weight" v-model="newCargo.weight"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.weight ? 'border-red-500' : '']" />
                        <p v-if="formErrors.weight" class="text-red-500 text-sm">{{ formErrors.weight }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="shippedDate" class="text-sm font-medium">Shipped Date</label>
                        <input id="shippedDate" type="date" v-model="newCargo.shipped_date"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.shipped_date ? 'border-red-500' : '']" />
                        <p v-if="formErrors.shipped_date" class="text-red-500 text-sm">{{ formErrors.shipped_date }}</p>
                      </div>
                      <div class="space-y-2">
                        <label for="estimatedDelivery" class="text-sm font-medium">Estimated Delivery</label>
                        <input id="estimatedDelivery" type="date" v-model="newCargo.estimated_delivery"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.estimated_delivery ? 'border-red-500' : '']" />
                        <p v-if="formErrors.estimated_delivery" class="text-red-500 text-sm">{{
                          formErrors.estimated_delivery
                        }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="currentLocation" class="text-sm font-medium">Current Location</label>
                      <select id="currentLocation" v-model="newCargo.current_location"
                        :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', formErrors.current_location ? 'border-red-500' : '']">
                        <option value="" disabled selected>Select location</option>
                        <option v-for="location in filteredLocations" :key="location.name" :value="location.name">{{
                          location.name }}
                        </option>
                      </select>
                      <p v-if="formErrors.current_location" class="text-red-500 text-sm">{{ formErrors.current_location
                      }}
                      </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="nextStop" class="text-sm font-medium">Next Stop</label>
                        <select id="nextStop" v-model="newCargo.next_stop"
                          :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', formErrors.next_stop ? 'border-red-500' : '']">
                          <option value="" disabled selected>Select Next Stop</option>
                          <option v-for="location in filteredLocations" :key="location.name" :value="location.name">{{
                            location.name }}
                          </option>
                        </select>
                        <p v-if="formErrors.next_stop" class="text-red-500 text-sm">{{ formErrors.next_stop }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label for="nextStopETA" class="text-sm font-medium">Next Stop ETA</label>
                        <input id="nextStopETA" type="datetime-local" v-model="newCargo.next_stop_eta"
                          class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="finalDestination" class="text-sm font-medium">Final Destination</label>
                      <select id="finalDestination" v-model="newCargo.final_destination"
                        :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', formErrors.final_destination ? 'border-red-500' : '']">
                        <option value="" disabled selected>Select Final Destination</option>
                        <option v-for="location in filteredLocations" :key="location.name" :value="location.name">{{
                          location.name }}
                        </option>
                      </select>
                      <p v-if="formErrors.final_destination" class="text-red-500 text-sm">{{
                        formErrors.final_destination
                      }}
                      </p>
                    </div>
                  </div>
                  <div v-if="addCargoTab === 'address'" class="space-y-4 mt-4">
                    <div class="space-y-2">
                      <label for="shippingAddress" class="text-sm font-medium">Shipping Address</label>
                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="space-y-2">
                          <label for="recipientName" class="text-sm font-medium">Recipient Name</label>
                          <input id="recipientName" v-model="newCargo.shipping_address.recipientName"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.recipient_name ? 'border-red-500' : '']" />
                          <p v-if="formErrors.recipient_name" class="text-red-500 text-sm">{{
                            formErrors.recipient_name }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="streetAddress" class="text-sm font-medium">Street Address</label>
                          <input id="streetAddress" v-model="newCargo.shipping_address.streetAddress"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.street_address ? 'border-red-500' : '']" />
                          <p v-if="formErrors.street_address" class="text-red-500 text-sm">{{
                            formErrors.street_address }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="city" class="text-sm font-medium">City/Town</label>
                          <input id="city" v-model="newCargo.shipping_address.city"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.city ? 'border-red-500' : '']" />
                          <p v-if="formErrors.city" class="text-red-500 text-sm">{{ formErrors.city }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="state" class="text-sm font-medium">County</label>
                          <input id="state" v-model="newCargo.shipping_address.state"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.state ? 'border-red-500' : '']" />
                          <p v-if="formErrors.state" class="text-red-500 text-sm">{{ formErrors.state }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="country" class="text-sm font-medium">Country</label>
                          <input id="country" v-model="newCargo.shipping_address.country"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.country ? 'border-red-500' : '']" />
                          <p v-if="formErrors.country" class="text-red-500 text-sm">{{ formErrors.country }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="phone" class="text-sm font-medium">Phone Number</label>
                          <input id="phone" v-model="newCargo.shipping_address.phone"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.phone ? 'border-red-500' : '']" />
                          <p v-if="formErrors.phone" class="text-red-500 text-sm">{{ formErrors.phone }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="email" class="text-sm font-medium">Email</label>
                          <input id="email" type="email" v-model="newCargo.shipping_address.email"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.email ? 'border-red-500' : '']" />
                          <p v-if="formErrors.email" class="text-red-500 text-sm">{{ formErrors.email }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="specialInstructions" class="text-sm font-medium">Special Instructions</label>
                          <textarea id="specialInstructions" v-model="newCargo.shipping_address.special_instructions"
                            rows="2"
                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="addCargoTab === 'stops'" class="space-y-4 mt-4">
                    <div v-if="stopErrors.general" class="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{{
                      stopErrors.general }}</div>

                    <div class="bg-gray-50 p-4 rounded-md border">
                      <h3 class="font-medium text-lg mb-3">Add Tracking Stop</h3>
                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="space-y-2">
                          <label for="status" class="text-sm font-medium">Status</label>
                          <select id="status" v-model="newStop.status"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', stopErrors.status ? 'border-red-500' : '']">
                            <option value="" disabled selected>Select Status</option>
                            <option value="in transit">In Transit</option>
                            <option value="pending">Pending</option>
                            <option value="delivered">Delivered</option>
                            <option value="delayed">Delayed</option>
                            <option value="processing">Processing</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="sorted">sorted</option>
                            <option value="out for delivery">Out for Delivery</option>
                            <option value="arrived at destination">Arrived at Destination</option>
                            <option value="departed from origin">Departed from Origin</option>
                            <option value="customs clearance">Customs Clearance</option>
                            <option value="awaiting pickup">Awaiting Pickup</option>
                            <option value="ready for pickup">Ready for Pickup</option>
                            <option value="on hold">On Hold</option>
                            <option value="returned to sender">Returned to Sender</option>
                            <option value="damaged">Damaged</option>
                            <option value="lost">Lost</option>
                            <option value="rejected">Rejected</option>
                            <option value="rescheduled">Rescheduled</option>
                            <option value="delivered to agent">Delivered to Agent</option>
                            <option value="awaiting customs clearance">Awaiting Customs Clearance</option>
                            `<option value="documentation requested">Docummentation Requested</option>
                            <option value="awaiting final delivery">Awaiting Final Delivery</option>
                            <option value="awaiting pickup instructions">Awaiting Pickup Instructions</option>`
                          </select>
                          <p v-if="stopErrors.status" class="text-red-500 text-sm">{{ stopErrors.status }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="location" class="text-sm font-medium">Location</label>
                          <select id="nextStop" v-model="newCargo.next_stop" readonly
                            :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', stopErrors.nextStop ? 'border-red-500' : '']">
                            <option value="" disabled selected>Select Next Stop</option>
                            <option v-for="location in filteredLocations" :key="location.name" :value="location.name">{{
                              location.name }}
                            </option>
                          </select>
                          <p v-if="stopErrors.location" class="text-red-500 text-sm">{{ stopErrors.location }}</p>
                        </div>

                        <div class="space-y-2">
                          <label for="timestamp" class="text-sm font-medium">Date & Time</label>
                          <input id="timestamp" type="datetime-local" v-model="newCargo.next_stop_eta" readonly
                            class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />

                          <p v-if="stopErrors.timestamp" class="text-red-500 text-sm">{{ stopErrors.timestamp }}</p>
                        </div>

                        <div class="space-y-2">
                          <label for="stopComment" class="text-sm font-medium">Comment</label>
                          <textarea id="stopComment" placeholder="Enter comment for this stop" v-model="newStop.comment"
                            rows="2"
                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                          <p v-if="stopErrors.comment" class="text-red-500 text-sm">{{ stopErrors.comment }}</p>
                        </div>

                        <button @click="addTrackingStop"
                          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] hover:bg-[#1e2759] text-white h-10 px-4 py-2">
                          <PlusIcon class="h-4 w-4 mr-2" />
                          Add Stop
                        </button>
                      </div>

                      <div class="mt-6">
                        <h3 class="font-medium text-lg mb-3">Tracking History</h3>
                        <div v-if="trackingStops.length === 0" class="text-center py-8 bg-gray-50 rounded-md border">
                          <p class="text-gray-500">No tracking stops added yet</p>
                          <p class="text-sm text-gray-400 mt-1">Add stops to create the package's tracking history
                          </p>
                        </div>
                        <div v-else class="space-y-4">
                          <div v-for="(stop, index) in trackingStops" :key="index"
                            class="flex items-start gap-4 bg-white p-4 rounded-md border">
                            <div class="flex-1">
                              <div class="flex justify-between">
                                <div>
                                  <p class="font-medium">{{ stop.status }}</p>
                                  <p class="text-sm text-gray-500">{{ stop.location }}</p>
                                  <p class="text-sm text-gray-500">{{ formatDate(stop.timestamp) }}</p>
                                  <div v-if="stop.comment" class="mt-2 p-2 bg-gray-50 rounded-md">
                                    <p class="text-sm font-medium text-gray-700">Comment:</p>
                                    <p class="text-sm text-gray-600">{{ stop.comment }}</p>
                                  </div>
                                </div>
                                <button @click="removeTrackingStop(index)"
                                  class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
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
                      @click="closeAddModal">
                      Cancel
                    </button>
                    <button
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2"
                      @click="addNewCargo">
                      Add Cargo
                    </button>
                  </div>
                </div>
              </div>
            </div>



            <!-- Add User Modal -->
            <div v-if="showAddUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              @click="closeAddUserModal">
              <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto" @click.stop>
                <div class="p-6">
                  <div class="flex flex-col space-y-1.5 pb-4">
                    <h2 class="text-lg font-semibold leading-none tracking-tight">Add New User</h2>
                    <p class="text-sm text-muted-foreground">Create a new user account with specific permissions.
                    </p>
                  </div>

                  <form @submit.prevent="addNewUser" class="space-y-4 py-4">
                    <div class="space-y-2">
                      <label for="fullname" class="text-sm font-medium">Full Name</label>
                      <input id="fullname" v-model="newUser.fullname"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.fullname ? 'border-red-500' : '']" />
                      <p v-if="userFormErrors.fullname" class="text-red-500 text-sm">{{ userFormErrors.fullname }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label for="email" class="text-sm font-medium">Email</label>
                      <input id="email" type="email" v-model="newUser.email"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.email ? 'border-red-500' : '']" />
                      <p v-if="userFormErrors.email" class="text-red-500 text-sm">{{ userFormErrors.email }}</p>
                    </div>

                    <div class="space-y-2">
                      <label for="username" class="text-sm font-medium">Username</label>
                      <input id="username" v-model="newUser.username"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.username ? 'border-red-500' : '']" />
                      <p v-if="userFormErrors.username" class="text-red-500 text-sm">{{ userFormErrors.username }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label for="password" class="text-sm font-medium">Password</label>
                      <input id="password" type="password" v-model="newUser.password"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.password ? 'border-red-500' : '']" />
                      <p v-if="userFormErrors.password" class="text-red-500 text-sm">{{ userFormErrors.password }}
                      </p>
                    </div>

                    <div class="space-y-2">
                      <label for="confirmPassword" class="text-sm font-medium">Confirm Password</label>
                      <input id="confirmPassword" type="password" v-model="newUser.confirmPassword"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.confirmPassword ? 'border-red-500' : '']" />
                      <p v-if="userFormErrors.confirmPassword" class="text-red-500 text-sm">{{
                        userFormErrors.confirmPassword }}</p>
                    </div>

                    <div class="space-y-2">
                      <label for="role" class="text-sm font-medium">Role</label>
                      <select id="role" v-model="newUser.roles"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.roles ? 'border-red-500' : '']">
                        <option value="" disabled selected>Select role</option>
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <p v-if="userFormErrors.role" class="text-red-500 text-sm">{{ userFormErrors.roles }}</p>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium">Permissions</label>
                      <div class="space-y-2">
                        <div class="flex items-center">
                          <input id="perm-packages" type="checkbox" v-model="newUser.permissions.packages"
                            class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                          <label for="perm-packages" class="ml-2 text-sm text-gray-700">Manage Shipments</label>
                        </div>
                        <div class="flex items-center">
                          <input id="perm-users" type="checkbox" v-model="newUser.permissions.users"
                            class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                          <label for="perm-users" class="ml-2 text-sm text-gray-700">Manage Users</label>
                        </div>
                        <div class="flex items-center">
                          <input id="perm-reports" type="checkbox" v-model="newUser.permissions.reports"
                            class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                          <label for="perm-reports" class="ml-2 text-sm text-gray-700">View Reports</label>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                      <button type="button"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        @click="closeAddUserModal">
                        Cancel
                      </button>
                      <button type="submit" :disabled="isSubmitting"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                        <span v-if="!isSubmitting">Add User</span>
                        <span v-else class="flex items-center">
                          <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="white" stroke-width="4"
                              fill="none" />
                            <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Edit User Modal -->
            <div v-if="showEditUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              @click="closeEditUserModal">
              <div class="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto" @click.stop>
                <div class="p-6">
                  <div class="flex flex-col space-y-1.5 pb-4">
                    <h2 class="text-lg font-semibold leading-none tracking-tight">Edit User</h2>
                    <p class="text-sm text-muted-foreground">Update user information and permissions.</p>
                  </div>

                  <form @submit.prevent="updateUser" class="space-y-4 py-4">
                    <div class="space-y-2">
                      <label for="edit-name" class="text-sm font-medium">Full Name</label>
                      <input id="edit-name" v-model="editingUser.fullname"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>

                    <div class="space-y-2">
                      <label for="edit-email" class="text-sm font-medium">Email</label>
                      <input id="edit-email" type="email" v-model="editingUser.email"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>

                    <div class="space-y-2">
                      <label for="edit-username" class="text-sm font-medium">Username</label>
                      <input id="edit-username" v-model="editingUser.username" readonly
                        class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      <p class="text-xs text-gray-500">Username cannot be changed</p>
                    </div>

                    <div class="space-y-2">
                      <label for="edit-password" class="text-sm font-medium">New Password (leave blank to keep
                        current)</label>
                      <input id="edit-password" type="password" v-model="editingUser.newPassword"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>

                    <div class="space-y-2">
                      <label for="edit-role" class="text-sm font-medium">Role</label>
                      <select id="edit-role" v-model="editingUser.roles"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="admin">Admin</option>
                        <option value="operator">Operator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label for="edit-status" class="text-sm font-medium">Status</label>
                      <select id="edit-status" v-model="editingUser.status"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div class="space-y-2">
                      <label class="text-sm font-medium">Permissions</label>
                      <div class="space-y-2">
                        <div class="flex items-center" v-for="perm in permissionOptions" :key="perm">
                          <input type="checkbox" :id="'edit-perm-' + perm" :checked="hasPermission(perm)"
                            @change="togglePermission(perm)"
                            class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                          <label :for="'edit-perm-' + perm" class="ml-2 text-sm text-gray-700">
                            {{ perm === 'packages' ? 'Manage Cargos' :
                              perm === 'users' ? 'Manage Users' :
                                perm === 'reports' ? 'View Reports' : perm }}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                      <button type="button"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        @click="closeEditUserModal">
                        Cancel
                      </button>
                      <button type="submit"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                        Update User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <!-- Delete User Confirmation Modal -->
            <div v-if="showDeleteUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
                <div class="p-6">
                  <div class="flex flex-col space-y-1.5 pb-4">
                    <h2 class="text-lg font-semibold leading-none tracking-tight">Confirm Delete</h2>
                    <p class="text-sm text-muted-foreground">Are you sure you want to delete this user? This action
                      cannot
                      be undone.</p>
                  </div>

                  <div class="p-4 bg-red-50 rounded-md mb-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                      </div>
                      <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">Warning</h3>
                        <div class="mt-2 text-sm text-red-700">
                          <p>Deleting this user will remove all their access to the system and cannot be undone.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="userToDelete" class="py-4 border-t border-b">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[#273272] font-medium">
                        {{ getInitials(userToDelete.name) }}
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ userToDelete.name }}</div>
                        <div class="text-sm text-gray-500">{{ userToDelete.email }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">
                    <button
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      @click="closeDeleteUserModal">
                      Cancel
                    </button>
                    <button
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-red-600 text-white hover:bg-red-700 h-10 px-4 py-2"
                      @click="deleteUser">
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Reset Password Modal -->
      <div v-if="showResetPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="closeResetPasswordModal">
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full" @click.stop>
          <div class="p-6">
            <div class="flex flex-col space-y-1.5 pb-4">
              <h2 class="text-lg font-semibold leading-none tracking-tight">Reset Password</h2>
              <p class="text-sm text-muted-foreground">Reset password for user: <strong>{{ resetPasswordUser.username
              }}</strong></p>
            </div>

            <form @submit.prevent="saveNewPassword">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label for="newPassword" class="text-sm font-medium">New Password</label>
                  <input id="newPassword" v-model="resetPasswordUser.newPassword" type="password"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="{ 'border-red-500': resetPasswordErrors.newPassword }" placeholder="••••••••" />
                  <p v-if="resetPasswordErrors.newPassword" class="text-red-500 text-xs mt-1">{{
                    resetPasswordErrors.newPassword }}</p>
                </div>

                <div class="space-y-2">
                  <label for="confirmNewPassword" class="text-sm font-medium">Confirm New Password</label>
                  <input id="confirmNewPassword" v-model="resetPasswordUser.confirmNewPassword" type="password"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="{ 'border-red-500': resetPasswordErrors.confirmNewPassword }" placeholder="••••••••" />
                  <p v-if="resetPasswordErrors.confirmNewPassword" class="text-red-500 text-xs mt-1">{{
                    resetPasswordErrors.confirmNewPassword }}</p>
                </div>
              </div>

              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-6">
                <button type="button"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  @click="closeResetPasswordModal">
                  Cancel
                </button>
                <button type="submit" @click="resetPassword"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Cargo Tracking Dialog -->
      <div v-if="showTrackingDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
        @click="closeTrackingDialog">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden" @click.stop>
          <!-- Dialog Header -->
          <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-[#273272] text-white">
            <div class="flex-1 min-w-0">
              <h2 class="text-lg sm:text-xl font-semibold truncate">Cargo Tracking Details</h2>
              <p class="text-gray-200 text-xs sm:text-sm mt-1 truncate">Container: {{ selectedCargo?.container_number
              }}</p>
            </div>
            <div class="flex items-center gap-2 sm:gap-3 ml-4">
              <!-- Action Buttons -->
              <button @click="handlePrint"
                class="px-2 sm:px-4 py-2 bg-[#ffb600] text-[#273272] rounded-md hover:bg-[#e6a500] transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <PrinterIcon class="w-4 h-4" />
                <span class="hidden sm:inline">{{ isMobileDevice ? 'Download PDF' : 'Print' }}</span>
              </button>
              <button @click="closeTrackingDialog" class="text-white/70 hover:text-white transition-colors p-1">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Dialog Content -->
          <div class="overflow-y-auto max-h-[calc(95vh-120px)]" id="tracking-content">
            <PackageTracking v-if="selectedCargo" :pkg="selectedCargo" class="print-content" />
          </div>
        </div>
      </div>


      <!-- Footer -->
      <footer class="bg-[#1a1a1a] text-white py-4">
        <div class="container mx-auto px-4 flex justify-center items-center">
          <p class="text-gray-400 text-center text-xs sm:text-sm">
            Copyright © {{ currentYear }} Texmon Logistics Limited - Admin Portal
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  DocumentCheckIcon,
  MapPinIcon,
  CalendarIcon,
  TrashIcon,
  PrinterIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon,
  UsersIcon,
  CogIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BellIcon,
  CheckCircleIcon,
  TruckIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'
import { LogOut } from 'lucide-vue-next'
import PackageTracking from './PackageTracking.vue'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ShippingProgress from '../components/ShippingProgress.vue';
import userServices from '../Services/userServices.js';
import locationService from '../Services/locationServices.js';
import ShippingServices from '../Services/ShippingServices.js';
import Alert from '../components/ui/Alert.vue';



const router = useRouter()
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('');
const isCheckingAuth = ref(false)

// Authentication state
const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')
const isSubmitting = ref(false)

// Sidebar state
const sidebarCollapsed = ref(false)


// Current view state
const currentView = ref('dashboard')

// Current user
const currentUser = ref({
  id: 1,
  fullname: 'Admin User',
  email: 'admin@texmonlogistics.co.ke',
  username: 'admin',
  roles: 'Administrator',
  initials: 'AU'
})


const formErrors = ref({})

// Tracking stops state
const trackingStops = ref([])
const newStop = ref({
  status: '',
  location: '',
  timestamp: '',
  comment: []
})
const stopErrors = ref({})

// Comments state
const newComment = ref({
  text: ''
})

const permissionOptions = ['packages', 'users', 'reports']

// Mobile state
const isMobileDevice = ref(false)
const showMobileMenu = ref(false)


// Mobile detection and handling
const checkMobileDevice = () => {
  isMobileDevice.value = window.innerWidth < 768
  if (isMobileDevice.value) {
    showMobileMenu.value = false
    sidebarCollapsed.value = false // Reset sidebar state on mobile
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const navigateToView = (view) => {
  currentView.value = view
  if (isMobileDevice.value) {
    closeMobileMenu()
  }
}

const toggleSidebar = () => {
  if (!isMobileDevice.value) {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)

// Cargo management functions

// Cargo Tracking Dialog state
const showTrackingDialog = ref(false)
const selectedCargo = ref(null)

// Cargo management state
const packages = ref([]);
const searchTerm = ref('')
const currentYear = computed(() => new Date().getFullYear())

// Edit package state
const showEditModal = ref(false)
const editingCargo = ref(null)
const activeEditTab = ref('location')
const editData = ref({
  currentLocation: '',
  nextStop: '',
  nextStopETA: '',
  comment: [],
})

// View package state
const showViewModal = ref(false)
const viewingCargo = ref(null)

// Add package state
const showAddModal = ref(false)
const addCargoTab = ref('details')
const newCargo = ref({
  container_number: '',
  truck_number: '',
  bl_number: '',
  cargo_type: '',
  current_location: '',
  next_stop: '',
  next_stop_eta: '',
  tracking_history: [],
  shipping_address: {
    recipientName: '',
    streetAddress: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    email: '',
    specialInstructions: ''
  }
})

// Load Cargo Details from the service
const fetchCargos = async () => {
  try {
    const response = await ShippingServices.getPackages();
    packages.value = response.data.cargo || [];

  } catch (error) {
    console.error('Error fetching Cargo:', error);
    setAlert('Failed to load cargo data', 'error')
  }
};

// Filtered packages based on search term
const filteredCargos = computed(() => {
  if (!searchTerm.value) return packages.value

  return packages.value.filter(pkg =>
    pkg.container_number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    pkg.truck_number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    pkg.bl_number.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})


// Cargo Tracking Dialog functions
const openTrackingDialog = (pkg) => {
  selectedCargo.value = pkg
  showTrackingDialog.value = true
}

const closeTrackingDialog = () => {
  showTrackingDialog.value = false
  selectedCargo.value = null
}

// Enhanced Print Function
const handlePrint = async () => {
  if (isMobileDevice.value) {
    await nextTick() // wait for DOM to be updated
    await handleDownloadPDF()
    return
  }

  try {
    // Wait for any images to load
    await waitForImages()

    // Get the content to print
    const printContent = document.getElementById('tracking-content')
    if (!printContent) {
      console.error('Print content not found')
      return
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600')

    // Write the complete HTML structure
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cargo Tracking - ${selectedCargo.value?.container_number}</title>
        <meta charset="utf-8">
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
          
          .print-content {
            max-width: 800px;
            margin: 0 auto;
          }
          
          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
          
          .qr-code img {
            width: 100px !important;
            height: 100px !important;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 10px;
            }
            
            .print-content {
              max-width: none;
              margin: 0;
            }
            
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="print-content">
          ${printContent.innerHTML}
        </div>
        <script>
          window.onload = function() {
            // Wait a bit for images to load, then print
            setTimeout(function() {
              window.print();
              window.close();
            }, 1000);
          };
        <\/script>
      </body>
      </html>
    `);

    printWindow.document.close()

  } catch (error) {
    console.error('Error printing document:', error)
    alert('Failed to print document')
  }
}

async function handleDownloadPDF() {
  try {
    if (!window.jspdf) {
      await loadJsPDFLibrary();
    }
    const element = document.getElementById("tracking-content");
    if (!element) throw new Error("Tracking content not found");

    // Save original styles
    const originalMaxHeight = element.style.maxHeight;
    const originalOverflowY = element.style.overflowY;
    const pkg = selectedCargo.value
    // Temporarily remove scroll & height limits to show all content
    element.style.maxHeight = "none";
    element.style.overflowY = "visible";

    // Wait for reflow so styles take effect
    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

    // Now capture the full content
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, scrollY: -window.scrollY });
    const imgData = canvas.toDataURL("image/png");

    // Restore original styles
    element.style.maxHeight = originalMaxHeight;
    element.style.overflowY = originalOverflowY;

    // Generate PDF
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let position = 0;
    let heightLeft = imgHeight;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) pdf.addPage();
    }

    pdf.save(`Texmon_Cargo_${pkg.container_number}_${new Date().toISOString().split('T')[0]}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF: " + error.message);
  }
}


async function loadJsPDFLibrary() {
  if (window.jspdf) return; // already loaded

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      // jsPDF loads as window.jspdf
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load jsPDF library'));
    document.head.appendChild(script);
  });
}


// Helper function to wait for images to load
const waitForImages = () => {
  return new Promise((resolve) => {
    const images = document.querySelectorAll('#tracking-content img')
    let loadedCount = 0
    const totalImages = images.length

    if (totalImages === 0) {
      resolve()
      return
    }

    const checkComplete = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        resolve()
      }
    }

    images.forEach(img => {
      if (img.complete) {
        checkComplete()
      } else {
        img.onload = checkComplete
        img.onerror = checkComplete
      }
    })

    // Fallback timeout
    setTimeout(resolve, 3000)
  })
}

const printCargoDetails = (pkg) => {
  // For now, open tracking dialog - you can implement a separate view modal if needed
  openTrackingDialog(pkg)
}




// Edit package functions
const openEditCargoModal = (pkg) => {
  editingCargo.value = { ...pkg }
  editData.value = {
    current_location: pkg.current_location,
    next_stop: pkg.next_stop,
    next_stop_eta: pkg.next_stop_eta,
    shipping_address: { ...pkg.shipping_address }
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingCargo.value = null
}

const editCargo = async (pkg) => {
  try {
    const response = await ShippingServices.getPackageById(pkg.id)
    if (!response || response.error) {
      setAlert('Failed to fetch package details for editing.', 'error')
      return
    }
    // Populate editingCargo with fetched data
    editingCargo.value = { ...response.data.package }
    editData.value = {
      current_location: editingCargo.value.current_location,
      next_stop: editingCargo.value.next_stop,
      next_stop_eta: editingCargo.value.next_stop_eta,
      shipping_address: { ...editingCargo.value.shipping_address }
    }
    showEditModal.value = true
  } catch (error) {
    console.error('Error fetching package data:', error)
    setAlert('Failed to load package data for editing.', 'error')
  }
}
const saveEditedCargo = async () => {
  if (!editingCargo.value) return

  // Validate the edited data
  if (!editData.value.current_location || !editData.value.next_stop || !editData.value.next_stop_eta) {
    setAlert('Please fill in all required fields.', 'error')
    return
  }

  // Update the package data
  editingCargo.value.current_location = editData.value.current_location
  editingCargo.value.next_stop = editData.value.next_stop
  editingCargo.value.next_stop_eta = editData.value.next_stop_eta
  editingCargo.value.shipping_address = { ...editData.value.shipping_address }
  editingCargo.value.lastUpdated = new Date().toLocaleDateString()

  try {
    const response = await ShippingServices.updatePackage(editingCargo.value.id, editingCargo.value)
    if (response.success) {
      setAlert('Cargo details updated successfully!', 'success')
      closeEditModal()
    } else {
      setAlert('Failed to update shipping details.', 'error')
      console.error(response.error)
    }
  } catch (error) {
    console.error('Error updating shipping details:', error)
    setAlert('Failed to update shipping details.', 'error')
  }
}

// View package functions
const openViewCargoModal = async (pkg) => {
  try {
    const response = await ShippingServices.getPackageById(pkg.id)
    if (!response || response.error) {
      setAlert('Failed to fetch package details for viewing.', 'error')
      return
    }

    // Populate viewingCargo with fetched data
    viewingCargo.value = response.data.package
    showViewModal.value = true
  } catch (error) {
    console.error('Error fetching package data:', error)
    setAlert('Failed to load package data for viewing.', 'error')
    return
  }

}

const closeViewModal = () => {
  showViewModal.value = false
  viewingCargo.value = null
}

const viewCargoDetails = (pkg) => {
  openViewCargoModal(pkg)
}

const editFromViewModal = (pkg) => {
  if (viewingCargo.value) {
    closeViewModal()
    editCargo(pkg)
  }
}

// Add package functions
const openAddCargoModal = () => {
  showAddModal.value = true
  addCargoTab.value = 'details'
  resetNewCargoForm()
  resetTrackingStops()
}

const closeAddModal = () => {
  showAddModal.value = false
}

const addNewCargo = async () => {
  // Validate the form before submission

  if (validateForm()) {
    isSubmitting.value = true
    const newCargoToAdd = {
      container_number: newCargo.value.container_number,
      truck_number: newCargo.value.truck_number,
      bl_number: newCargo.value.bl_number,
      recipient_name: newCargo.value.shipping_address.recipientName,
      type: newCargo.value.type,
      weight: newCargo.value.weight,
      shipped_date: newCargo.value.shipped_date,
      estimated_delivery: newCargo.value.estimated_delivery,
      current_location: newCargo.value.current_location,
      next_stop: newCargo.value.next_stop,
      next_stop_eta: newCargo.value.next_stop_eta,
      final_destination: newCargo.value.final_destination,
      shipping_address: { ...newCargo.value.shipping_address },
      trackingHistory: trackingStops.value
    }

    try {
      // Simulate API call
      const response = await ShippingServices.addPackage(newCargoToAdd)
      if (response.data.success) {
        setAlert('Cargo added successfully!', 'success')
        resetNewCargoForm()
        resetTrackingStops()
        closeAddModal()
      } else {
        setAlert('Failed to add new shipping.', 'error')
        console.error(response.error)
        return
      }
    } catch (error) {
      console.error('Error adding new shipping:', error)
      setAlert('Failed to add new shipping.', 'error')
    }
    finally {
      isSubmitting.value = false
    }

  }
}

const validateForm = () => {
  formErrors.value = {}
  let isValid = true

  if (!newCargo.value.container_number) {
    formErrors.value.container_number = 'Container number is required'
    isValid = false
  }

  if (!newCargo.value.truck_number) {
    formErrors.value.truck_number = 'Truck number is required'
    isValid = false
  }

  if (!newCargo.value.bl_number) {
    formErrors.value.bl_number = 'BL number is required'
    isValid = false
  }

  if (!newCargo.value.type) {
    formErrors.value.type = 'Cargo type is required'
    isValid = false
  }

  if (!newCargo.value.weight) {
    formErrors.value.weight = 'Weight is required'
    isValid = false
  }

  if (!newCargo.value.shipped_date) {
    formErrors.value.shipped_date = 'Shipped date is required'
    isValid = false
  }

  if (!newCargo.value.estimated_delivery) {
    formErrors.value.estimated_delivery = 'Estimated delivery is required'
    isValid = false
  }

  if (!newCargo.value.current_location) {
    formErrors.value.current_location = 'Current location is required'
    isValid = false
  }

  if (!newCargo.value.final_destination) {
    formErrors.value.final_destination = 'Final destination is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.recipientName.trim() === '') {
    formErrors.value.recipientName = 'Recipient name is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.streetAddress.trim() === '') {
    formErrors.value.streetAddress = 'Street address is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.city.trim() === '') {
    formErrors.value.city = 'City/Town is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.state.trim() === '') {
    formErrors.value.state = 'County is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.country.trim() === '') {
    formErrors.value.country = 'Country is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.phone.trim() === '') {
    formErrors.value.phone = 'Phone number is required'
    isValid = false
  }
  if (newCargo.value.shipping_address.email.trim() === '') {
    formErrors.value.email = 'Email address is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(newCargo.value.shipping_address.email)) {
    formErrors.value.email = 'Invalid email address'
    isValid = false
  }



  if (trackingStops.value.length === 0) {
    stopErrors.value.general = 'At least one tracking stop is required'
    setAlert('At least one tracking stop is required', 'error')
    isValid = false
  }


  return isValid
}

const resetNewCargoForm = () => {
  newCargo.value = {
    container_number: '',
    truck_number: '',
    bl_number: '',
    type: '',
    weight: '',
    shipped_date: '',
    estimated_delivery: '',
    current_location: '',
    next_stop: '',
    next_stop_eta: '',
    final_destination: '',
    shipping_address: {
      recipientName: '',
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      phone: '',
      email: '',
      specialInstructions: ''
    }
  }
  formErrors.value = {}
}

// Tracking stops functions
const addTrackingStop = () => {
  if (validateStopForm()) {
    trackingStops.value.push({
      status: newStop.value.status,
      location: newCargo.value.next_stop,
      timestamp: newCargo.value.next_stop_eta,
      comment: newStop.value.comment
    })
    resetNewStopForm()
  }
}

const removeTrackingStop = (index) => {
  trackingStops.value.splice(index, 1)
}

const validateStopForm = () => {
  const errors = {}

  if (!newStop.value.status || newStop.value.status.trim() === '') {
    errors.status = 'Status is required'
  }

  if (!newCargo.value.next_stop || newCargo.value.next_stop.trim() === '') {
    errors.location = 'Next stop is required'
  }

  if (!newCargo.value.next_stop_eta) {
    errors.timestamp = 'Timestamp is required'
  }

  if (!newStop.value.comment || newStop.value.comment.trim() === '') {
    errors.comment = 'Comment is required'
  }

  stopErrors.value = errors

  return Object.keys(errors).length === 0
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

const getCargosByStatus = (status) => {
  const targetStatus = status.toLowerCase();

  return packages.value.filter(pkg => {
    const history = pkg.trackingHistory;
    if (!Array.isArray(history) || history.length === 0) return false;

    // Find the latest tracking event by timestamp
    const latestEvent = history.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
    });

    const latestStatus = latestEvent?.status?.toLowerCase() || '';

    if (targetStatus === 'delivered') {
      return latestStatus.includes('delivered');
    }

    if (targetStatus === 'transit') {
      return latestStatus.includes('transit') || latestStatus.includes('in-transit');
    }

    if (targetStatus === 'delayed') {
      return latestStatus.includes('delay');
    }

    return false;
  }).length;
};

// // Add comment function
const addComment = async (packageId) => {
  if (!newComment.value.text.trim()) return;

  const comment = {
    author: 'You',
    text: newComment.value.text.trim(),
    timestamp: new Date().toLocaleString()
  };

  // Ensure array exists
  if (!Array.isArray(viewingCargo.tracking_history)) {
    viewingCargo.tracking_history = [];
  }

  // Push to UI immediately
  viewingCargo.tracking_history.push(comment);

 
  newComment.value.text = '';
};



//<!-- End of Cargo Management Function -->


// <!-- Activity Management Functions  -->

const getActivityIcon = (type) => {
  switch (type) {
    case 'login':
      return LogOut
    case 'package':
      return ArchiveBoxIcon
    case 'user':
      return UsersIcon
    case 'location':
      return MapPinIcon
    default:
      return CogIcon
  }
}

// Activity log state
const activityLogs = ref([
  {
    id: 1,
    type: 'login',
    user: 'Admin User',
    time: '2025-05-23 09:30 AM',
    message: 'User logged in successfully',
    details: 'IP Address: 192.168.1.1, Browser: Chrome 120.0.0'
  },
])
const activitySearchTerm = ref('')
const activityFilter = ref('all')

// Recent activity for dashboard
const recentActivity = computed(() => {
  return activityLogs.value.slice(0, 5)
})

// Filtered activities based on search term and filter
const filteredActivities = computed(() => {
  let filtered = activityLogs.value

  if (activitySearchTerm.value) {
    filtered = filtered.filter(activity =>
      activity.message.toLowerCase().includes(activitySearchTerm.value.toLowerCase()) ||
      activity.user.toLowerCase().includes(activitySearchTerm.value.toLowerCase()) ||
      (activity.details && activity.details.toLowerCase().includes(activitySearchTerm.value.toLowerCase()))
    )
  }

  if (activityFilter.value !== 'all') {
    filtered = filtered.filter(activity => activity.type === activityFilter.value)
  }

  return filtered
})

//<!-- End of Activity Management Function -->

//<!-- LOCATION MANAGEMENT FUNCTIONS -->

// Location management state
const locations = ref([]);
const locationSearchTerm = ref('')
const showAddLocationModal = ref(false)
const showEditLocationModal = ref(false)
const showViewLocationModal = ref(false)
const showDeleteLocationModal = ref(false)
const locationToDelete = ref(null)
const locationFormErrors = ref({})

// New location form
const newLocation = ref({
  name: '',
  type: '',
  address: '',
  city: '',
  country: '',
  coordinates: null,
  status: 'active'
})

// Editing location
const editingLocation = ref(null)
const viewingLocation = ref(null)

const fetchLocation = async () => {
  try {
    const responses = await locationService.getLocations();
    locations.value = responses.data.locations || [];

  } catch (error) {
    console.error('Error fetching Locations:', error);
  }
};
const filteredLocations = computed(() => {
  if (!locationSearchTerm.value) return locations.value || []

  return locations.value.filter(location =>
    location.name.toLowerCase().includes(locationSearchTerm.value.toLowerCase()) ||
    location.country.toLowerCase().includes(locationSearchTerm.value.toLowerCase()) ||
    location.city.toLowerCase().includes(locationSearchTerm.value.toLowerCase())
  )
})

const openAddLocationModal = () => {
  showAddLocationModal.value = true
  resetNewLocationForm()
}

const closeAddLocationModal = () => {
  locationFormErrors.value = {}
  resetNewLocationForm()
  showAddLocationModal.value = false
}

const addNewLocation = async () => {
  if (validateLocationForm()) {
    isSubmitting.value = true

    if (!newLocation.value.coordinates) {
      newLocation.value.coordinates = null; // or a valid fallback JSON
    }
    const newLocationToAdd = {
      name: newLocation.value.name,
      type: newLocation.value.type,
      address: newLocation.value.address,
      city: newLocation.value.city,
      country: newLocation.value.country,
      coordinates: newLocation.value.coordinates,
      status: newLocation.value.status
    }
    try {
      const response = await locationService.addLocation(newLocationToAdd)
      console.log('Response:', response)
      if (response.data.success) {
        setAlert('Location added successfully!', 'success')
        closeAddLocationModal()
      }
      else {
        setAlert('Failed to add new location.', 'error')
        console.log(response.error)
      }
    } catch (error) {
      setAlert('Error adding new location.', 'error')
    } finally {
      isSubmitting.value = false
    }
  }
}

const validateLocationForm = () => {
  locationFormErrors.value = {}
  let isValid = true

  if (!newLocation.value.name) {
    locationFormErrors.value.name = 'Location name is required'
    isValid = false
  }


  if (!newLocation.value.type) {
    locationFormErrors.value.type = 'Location type is required'
    isValid = false
  }

  if (!newLocation.value.address) {
    locationFormErrors.value.address = 'Address is required'
    isValid = false
  }

  if (!newLocation.value.city) {
    locationFormErrors.value.city = 'City is required'
    isValid = false
  }

  if (!newLocation.value.country) {
    locationFormErrors.value.country = 'Country is required'
    isValid = false
  }

  return isValid
}

const resetNewLocationForm = () => {
  newLocation.value = {
    name: '',
    type: '',
    address: '',
    city: '',
    country: '',
    coordinates: '',
    status: 'active'
  }
  locationFormErrors.value = {}
}

const editLocation = async (location) => {
  try {

    const response = await locationService.getLocationById(location.id)

    if (!response || response.error) {
      setAlert('Failed to fetch location details.', 'error')
      return
    }

    // Populate editingLocation with fetched data
    editingLocation.value = { ...response.data.location }
    showEditLocationModal.value = true
  } catch (error) {
    console.error('Error fetching Location data:', error)
    setAlert('Failed to load location data for editing.', 'error')
  }
}

const closeEditLocationModal = () => {
  showEditLocationModal.value = false
  editingLocation.value = null
}

const updateLocation = async () => {
  if (!editingLocation.value) return


  try {
    const updatedLocation = {
      name: editingLocation.value.name,
      type: editingLocation.value.type,
      address: editingLocation.value.address,
      city: editingLocation.value.city,
      country: editingLocation.value.country,
      coordinates: editingLocation.value.coordinates,
      status: editingLocation.value.status
    };

    if (!updatedLocation.coordinates) {
      updatedLocation.coordinates = null; // or a valid fallback JSON
    }
    const response = await locationService.updateLocation(editingLocation.value.id, updatedLocation);

    if (response.error) {
      setAlert(response.error, 'error');
      return;
    }

    setAlert('Location updated successfully!', 'success')
    closeEditLocationModal()
    // Refresh the user list
    await fetchLocation();




  } catch (error) {
    console.error('Error updating Location:', error);
    setAlert('Failed to update Location. Please try again.', 'error');
  }


}

const viewLocation = async (location) => {
  try {

    const response = await locationService.getLocationById(location.id)

    if (!response || response.error) {
      setAlert('Failed to fetch location details.', 'error')
      return
    }

    // Populate editingLocation with fetched data
    viewingLocation.value = { ...response.data.location }
    showViewLocationModal.value = true
  } catch (error) {
    console.error('Error fetching Location data:', error)
    setAlert('Failed to load location data for editing.', 'error')
  }
}

const closeViewLocationModal = () => {
  showViewLocationModal.value = false
  viewingLocation.value = null
}

const editFromViewLocationModal = (location) => {
  if (viewingLocation.value) {
    closeViewLocationModal()
    editLocation(location)
  }
}

const confirmDeleteLocation = (location) => {
  locationToDelete.value = location
  showDeleteLocationModal.value = true
}

const closeDeleteLocationModal = () => {
  showDeleteLocationModal.value = false
  locationToDelete.value = null
}

const deleteLocation = async () => {
  if (!locationToDelete.value) return
  try {
    const response = await locationService.deleteLocation(locationToDelete.value.id)

    if (response.error) {
      setAlert(response.error, 'error')
    } else {
      setAlert('Location deleted successfully!', 'success')
      locations.value = locations.value.filter(u => u.id !== locationToDelete.value.id)
    }
  } catch (error) {
    console.error('Delete error:', error)
    setAlert('An error occurred while deleting the user.', 'error')
  } finally {
    closeDeleteLocationModal()
    locationToDelete.value = null
  }
}

// <!-- End of Location Management Function -->

////<!-- User Management Function -->

// User management state
const users = ref([]);
const showUserManagement = ref(false)
const showUserFormModal = ref(false)
const userSearchTerm = ref('');
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteUserModal = ref(false)
const userToDelete = ref(null)
const userFormErrors = ref({})
// New user form
const newUser = ref({
  fullname: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  roles: '',
  status: 'active',
  permissions: {
    packages: false,
    users: false,
    reports: false
  }
})

// Load users from the service
const fetchUsers = async () => {
  try {
    const response = await userServices.getAllUsers();
    users.value = response.data.data;

  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Filtered users based on search term
const filteredUsers = computed(() => {
  if (!userSearchTerm.value) return users.value || []

  return users.value.filter(user =>
    (user.fullname || '').toLowerCase().includes(userSearchTerm.value.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(userSearchTerm.value.toLowerCase()) ||
    (user.username || '').toLowerCase().includes(userSearchTerm.value.toLowerCase())
  )
})

// Helper functions
const getInitials = (fullname) => {
  if (!fullname) return 'NA'
  return fullname.split(' ').map(n => n[0]).join('').toUpperCase()
}

// Editing user
const editingUser = ref({
  fullname: '',
  email: '',
  username: '',
  newPassword: '',
  roles: 'viewer',
  status: 'active',
  permissions: []
})



const closeUserFormModal = () => {
  showUserFormModal.value = false
}

const validateUserForm = () => {
  userFormErrors.value = {}
  let isValid = true

  if (!newUser.value.fullname) {
    userFormErrors.value.fullname = 'Name is required'
    isValid = false
  }

  if (!newUser.value.username) {
    userFormErrors.value.username = 'Username is required'
    isValid = false
  }
  if (!newUser.value.email) {
    userFormErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(newUser.value.email)) {
    userFormErrors.value.email = 'Email is invalid'
    isValid = false
  }


  if (!newUser.value.password) {
    userFormErrors.value.password = 'Password is required'
    isValid = false
  } else if (newUser.value.password.length < 6) {
    userFormErrors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  if (!newUser.value.confirmPassword) {
    userFormErrors.value.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (newUser.value.password !== newUser.value.confirmPassword) {
    userFormErrors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }


  return isValid
}



const resetPasswordUser = ref({
  id: null,
  username: '',
  newPassword: '',
  confirmNewPassword: ''
})
const resetPasswordErrors = ref({})
const showResetPasswordModal = ref(false)

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


  // Show success message
  setAlert(`Password has been reset for ${resetPasswordUser.value.username}`)

  closeResetPasswordModal()
}

// Call this function to show alert
const setAlert = (message, type) => {
  alertMessage.value = message
  alertType.value = type
  showAlert.value = true

  // Optional: auto clear after 3 seconds
  setTimeout(() => {
    alertMessage.value = ''
    alertType.value = ''
  }, 3000)
}

const hideAlert = () => {
  showAlert.value = false
}


const hasPermission = (perm) => {
  return editingUser.value?.permissions?.includes(perm)
}

const togglePermission = (perm) => {
  const perms = editingUser.value.permissions || []
  if (perms.includes(perm)) {
    editingUser.value.permissions = perms.filter(p => p !== perm)
  } else {
    editingUser.value.permissions = [...perms, perm]
  }
}


const getUsersByRole = (role) => {
  return users.value.filter(user => user.roles === role).length
}


// User management functions
const openAddUserModal = () => {
  showAddUserModal.value = true
  resetNewUserForm()
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
  resetNewUserForm()
}


const addNewUser = async () => {
  if (validateUserForm()) {
    isSubmitting.value = true
    const newUserToAdd = {
      fullname: newUser.value.fullname,
      email: newUser.value.email,
      username: newUser.value.username,
      password: newUser.value.password,
      confirmPassword: newUser.value.confirmPassword,
      roles: newUser.value.roles,
      status: newUser.value.status || 'active',
      permissions: Object.entries(newUser.value.permissions)
        .filter(([_, isChecked]) => isChecked)
        .map(([permission]) => permission),
      lastLogin: null,
    }
    try {
      const response = await userServices.registerUser(newUserToAdd)
      if (response.success) {
        setAlert('User created successfully!', 'success')
        closeUserFormModal()
      } else {
        setAlert('Failed to add new user.', 'error');
      }
    } catch (error) {
      setAlert('Error adding new user.', 'error');
      // Optionally show error feedback to user
      const rawMessage = error.response?.data?.message || 'An error occurred.';
      const userMessage = rawMessage.includes('profiles_email_key')
        ? 'A user with this email already exists.'
        : rawMessage.includes('profiles_username_key')
          ? 'A user with this username already exists.'
          : rawMessage.includes('duplicate key')
            ? 'Duplicate entry. Please use different credentials.'
            : rawMessage;

      setAlert(userMessage, 'error');

    } finally {
      resetNewUserForm()
      closeUserFormModal()
      closeAddUserModal()
      await fetchUsers()
      // Reset isSubmitting state
      isSubmitting.value = false
    }
  }
}


const resetNewUserForm = () => {
  newUser.value = {
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    roles: '',
    status: 'active',
    permissions: {
      packages: false,
      users: false,
      reports: false
    }
  }
  userFormErrors.value = {}
}

const editUser = async (user) => {
  try {

    const response = await userServices.getUserById(user.id)

    if (!response || response.error) {
      setAlert('Failed to fetch user details.', 'error')
      return
    }

    // Populate editingUser with fetched data
    editingUser.value = { ...response.data.data, newPassword: '' }

    // Populate editingUser with fetched data
    editingUser.value = {
      ...response.data.data,
      permissions: response.data.data.permissions || [],
      newPassword: ''
    }

    showEditUserModal.value = true
  } catch (error) {
    console.error('Error fetching user data:', error)
    setAlert('Failed to load user data for editing.', 'error')
  }
}

const closeEditUserModal = () => {
  showEditUserModal.value = false
  editingUser.value = null
}

const updateUser = async () => {
  if (!editingUser.value) return;

  try {
    const updatedUser = {
      id: editingUser.value.id,
      fullname: editingUser.value.fullname,
      email: editingUser.value.email,
      roles: editingUser.value.roles,
      status: editingUser.value.status,
      permissions: editingUser.value.permissions,
    };

    if (editingUser.value.newPassword) {
      updatedUser.password = editingUser.value.newPassword;
    }

    const response = await userServices.updateUser(editingUser.value.id, updatedUser);

    if (response.error) {
      setAlert(response.error, 'error');
      return;
    }

    setAlert('User updated successfully.', 'success');
    closeEditUserModal();
    // Refresh the user list
    await fetchUsers();




  } catch (error) {
    console.error('Error updating user:', error);
    setAlert('Failed to update user. Please try again.', 'error');
  }
};


const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeleteUserModal.value = true
}

const closeDeleteUserModal = () => {
  showDeleteUserModal.value = false
  userToDelete.value = null
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  try {
    const response = await userServices.deleteUser(userToDelete.value.id)

    if (response.error) {
      setAlert(response.error, 'error')
    } else {
      setAlert('User deleted successfully.', 'success')
      users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    }
  } catch (error) {
    console.error('Delete error:', error)
    setAlert('An error occurred while deleting the user.', 'error')
  } finally {
    closeDeleteUserModal()
    userToDelete.value = null
  }
}

// Handle login function
const handleLogin = async () => {
  try {
    isSubmitting.value = true
    const userData = { username: username.value, password: password.value }
    // Call the user service to perform login
    const response = await userServices.login(userData)
    if (response.data.success) {

      isAuthenticated.value = true;
      currentUser.value = response.data.data
      setAlert('Login successful!', 'success')
      // Optionally redirect to dashboard or home page
      router.push('/admin')
    } else {
      isAuthenticated.value = false
      loginError.value = response.error || 'Login failed. Please try again.'
      console.log(response.error)
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

// Handle logout function
const logout = async () => {
  try {
    await userServices.logout()
    isAuthenticated.value = false
    currentUser.value = null
    setAlert('Logout successful!', 'success')
    // Optionally redirect to login page
  } catch (error) {
    console.error('Logout error:', error)
    setAlert('An error occurred during logout. Please try again.', 'error')
  }
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


// Event listeners
onMounted(() => {

  isAuthenticated.value = true
  fetchUsers()
  fetchCargos()
  fetchLocation()
  window.addEventListener('resize', checkMobileDevice)
})


onUnmounted(() => {

  window.removeEventListener('resize', checkMobileDevice)
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

.sidebar {
  transition: width 0.3s ease, transform 0.3s ease;
}

@media print {
  .print-content {
    max-width: 800px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    background: white;
    padding: 20px;
  }

  .print-content img {
    max-width: 100%;
    height: auto;
  }

  .qr-code img {
    width: 100px;
    height: 100px;
  }
}

.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-700 {
  scrollbar-color: #374151 transparent;
}

/* Mobile-specific styles */
@media (max-width: 767px) {
  .sidebar {
    position: fixed !important;
    z-index: 50;
  }
}
</style>
