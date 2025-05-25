<template>
  <div class="flex h-screen">
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

            <button @click="navigateToView('packages')" :title="(sidebarCollapsed && !isMobileDevice) ? 'Packages' : ''"
              class="flex items-center text-gray-300 hover:bg-[#273272] hover:text-white rounded-md transition-colors text-sm group relative"
              :class="{
                'justify-center px-2 py-3': sidebarCollapsed && !isMobileDevice,
                'px-3 py-2.5': !sidebarCollapsed || isMobileDevice,
                'bg-[#273272] text-white': currentView === 'packages'
              }" active-class="bg-[#273272] text-white">
              <ArchiveBoxIcon
                :class="{ 'h-6 w-6': sidebarCollapsed && !isMobileDevice, 'h-5 w-5': !sidebarCollapsed || isMobileDevice }"
                class="flex-shrink-0" />
              <span v-if="!sidebarCollapsed || isMobileDevice" class="ml-3 font-medium">Packages</span>
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
            <p class="text-sm font-medium text-white truncate">{{ currentUser.name }}</p>
            <p class="text-xs text-gray-400">{{ currentUser.role }}</p>
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
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              <div class="bg-white rounded-lg shadow p-3 sm:p-6 border-l-4 border-[#273272]">
                <div class="flex items-center">
                  <div class="p-2 sm:p-3 rounded-full bg-[#273272]/10 mr-2 sm:mr-4">
                    <ArchiveBoxIcon class="h-4 w-4 sm:h-6 sm:w-6 text-[#273272]" />
                  </div>
                  <div>
                    <p class="text-xs sm:text-sm text-gray-500">Total Packages</p>
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
                    <p class="text-lg sm:text-2xl font-bold">{{ getPackagesByStatus('transit') }}</p>
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
                    <p class="text-lg sm:text-2xl font-bold">{{ getPackagesByStatus('delivered') }}</p>
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
                    <p class="text-lg sm:text-2xl font-bold">{{ getPackagesByStatus('delayed') }}</p>
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
                              {{ getInitials(user.name) }}
                            </div>
                            <div class="ml-4">
                              <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                              <div class="text-sm text-gray-500">{{ user.username }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="[
                            'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'operator' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                          ]">
                            {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
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
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.lastLogin || 'Never' }}
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

          <!-- Package Management View -->
          <div v-if="currentView === 'packages'" class="space-y-6 sm:space-y-8">
            <div class="rounded-lg border bg-white shadow-lg overflow-hidden mb-6 sm:mb-8">
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#273272] text-white p-4 sm:p-6 rounded-t-lg gap-4 sm:gap-0">
                <div>
                  <h2 class="text-lg sm:text-xl font-semibold">Package Management</h2>
                  <p class="text-gray-200 text-sm">
                    Update the current location and next stop information for packages
                  </p>
                </div>
                <button @click="openAddPackageModal"
                  class="bg-transparent text-white border border-white hover:bg-red-600 hover:border-red-600 transition-colors duration-300 px-3 sm:px-4 py-2 rounded inline-flex items-center text-sm">
                  <PlusIcon class="h-4 w-4 mr-2" />
                  <span class="hidden sm:inline">Add Package</span>
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
                        <tr v-if="filteredPackages.length === 0">
                          <td colspan="8" class="text-center py-4 text-gray-500">No packages found</td>
                        </tr>
                        <tr v-for="pkg in filteredPackages" :key="pkg.id" class="hover:bg-gray-50">
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                            {{ pkg.containerNumber }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ pkg.truckNumber }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ pkg.blNumber }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 max-w-xs truncate"
                            :title="pkg.currentLocation">
                            {{ pkg.currentLocation }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 max-w-xs truncate" :title="pkg.nextStop">
                            {{ pkg.nextStop }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ pkg.nextStopETA }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-sm text-gray-900 whitespace-nowrap">
                            {{ pkg.lastUpdated }}
                          </td>
                          <td class="px-6 py-4 sm:px-4 text-right text-sm font-medium whitespace-nowrap">
                            <div class="flex justify-end gap-1">
                              <button
                                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-8 px-2"
                                @click="viewPackageDetails(pkg)" title="View Details">
                                View
                              </button>
                              <button
                                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-8 px-2"
                                @click="editPackage(pkg)" title="Edit Package">
                                <PencilIcon class="h-3 w-3" />
                              </button>
                              <button
                                class="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-gray-300 bg-white hover:bg-gray-50 h-8 px-2"
                                @click="printPackageDetails(pkg)" title="Print Details">
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
                    <div v-for="pkg in filteredPackages" :key="pkg.id"
                      class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                          <h3 class="font-bold text-gray-900 text-sm">{{ pkg.containerNumber }}</h3>
                          <p class="text-xs text-gray-500 mt-1">{{ pkg.truckNumber }} • {{ pkg.blNumber }}</p>
                        </div>
                        <div class="flex gap-1 ml-2">
                          <button @click="viewPackageDetails(pkg)"
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
                          <button @click="editPackage(pkg)"
                            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Print Details">
                            <PencilIcon class="h-4 w-4" />
                          </button>
                          <button @click="printPackageDetails(pkg)"
                            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                            title="Print Details">
                            <PrinterIcon class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 gap-2 text-xs">
                        <div class="flex justify-between">
                          <span class="text-gray-500">Current:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ pkg.currentLocation }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">Next:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ pkg.nextStop }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">ETA:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ pkg.nextStopETA }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-500">Updated:</span>
                          <span class="text-gray-900 text-right flex-1 ml-2 truncate">{{ pkg.lastUpdated }}</span>
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
                    <option value="package">Package Updates</option>
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
          <!-- Edit Package Modal -->
          <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeEditModal">
            <div class="bg-white rounded-lg shadow-lg max-w-[600px] w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Update Package Information</h2>
                  <p class="text-sm text-muted-foreground">Update the package location and shipping address information.
                  </p>
                </div>

                <div v-if="editingPackage" class="space-y-4 py-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Container Number</p>
                      <p>{{ editingPackage.containerNumber }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Truck Number</p>
                      <p>{{ editingPackage.truckNumber }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">BL Number</p>
                      <p>{{ editingPackage.blNumber }}</p>
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
                      <button :class="[
                        'flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                        activeEditTab === 'address' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                      ]" @click="activeEditTab = 'address'">
                        Shipping Address
                      </button>
                    </div>
                    <div v-if="activeEditTab === 'location'" class="space-y-4 mt-4">
                      <div class="space-y-2">
                        <label for="currentLocation" class="text-sm font-medium">Current Location</label>
                        <select id="currentLocation" v-model="editData.currentLocation" @change="handleLocationChange"
                          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          <option value="" disabled>Select location</option>
                          <option v-for="location in allLocations" :key="location" :value="location">{{ location }}
                          </option>
                        </select>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label for="nextStop" class="text-sm font-medium">Next Stop</label>
                          <input id="nextStop" v-model="editData.nextStop" readonly
                            class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                          <p class="text-xs text-gray-500">Automatically determined based on current location</p>
                        </div>
                        <div class="space-y-2">
                          <label for="nextStopETA" class="text-sm font-medium">Next Stop ETA</label>
                          <input id="nextStopETA" type="date" v-model="editData.nextStopETA" readonly
                            class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                          <p class="text-xs text-gray-500">Estimated based on standard transit times</p>
                        </div>
                      </div>
                    </div>

                    <div v-if="activeEditTab === 'address'" class="space-y-4 mt-4">
                      <div class="space-y-2">
                        <label for="recipientName" class="text-sm font-medium">Recipient Name</label>
                        <input id="recipientName" v-model="editData.shippingAddress.recipientName"
                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>

                      <div class="space-y-2">
                        <label for="streetAddress" class="text-sm font-medium">Street Address</label>
                        <input id="streetAddress" v-model="editData.shippingAddress.streetAddress"
                          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label for="city" class="text-sm font-medium">City</label>
                          <input id="city" v-model="editData.shippingAddress.city"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div class="space-y-2">
                          <label for="state" class="text-sm font-medium">State/Province</label>
                          <input id="state" v-model="editData.shippingAddress.state"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label for="postalCode" class="text-sm font-medium">Postal Code</label>
                          <input id="postalCode" v-model="editData.shippingAddress.postalCode"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div class="space-y-2">
                          <label for="country" class="text-sm font-medium">Country</label>
                          <input id="country" v-model="editData.shippingAddress.country"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Comments Section in Edit Modal -->
                <div class="mt-6 pt-6 border-t">
                  <h3 class="text-lg font-medium mb-4">Comments</h3>
                  <div v-if="editingPackage.comments && editingPackage.comments.length > 0" class="space-y-4 mb-6">
                    <div v-for="(comment, index) in editingPackage.comments" :key="index"
                      class="bg-gray-50 p-4 rounded-md">
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
                    @click="savePackageChanges">
                    <DocumentCheckIcon class="h-4 w-4 mr-2" />
                    Update Package
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- View Package Modal -->
          <div v-if="showViewModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeViewModal">
            <div class="bg-white rounded-lg shadow-lg max-w-[800px] w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Package Details</h2>
                  <p class="text-sm text-muted-foreground" v-if="viewingPackage">
                    Container Number: {{ viewingPackage.containerNumber }} | Truck Number: {{ viewingPackage.truckNumber
                    }}
                    |
                    BL Number: {{ viewingPackage.blNumber }}
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
                  <ShippingProgress :trackingHistory="viewingPackage.trackingHistory"
                    :currentLocation="viewingPackage.currentLocation" :nextStop="viewingPackage.nextStop"
                    :nextStopETA="viewingPackage.nextStopETA" :finalDestination="viewingPackage.finalDestination"
                    :estimatedDelivery="viewingPackage.estimatedDelivery" showComments />
                </div>

                <!-- Comments Section -->
                <div class="rounded-lg border bg-white shadow-lg overflow-hidden mt-6">
                  <div class="bg-[#273272] text-white p-6 rounded-t-lg flex items-center">
                    <ChatBubbleLeftRightIcon class="h-5 w-5 mr-2" />
                    <h3 class="text-xl font-semibold">Comments</h3>
                  </div>
                  <div class="p-6">
                    <div v-if="viewingPackage.comment && viewingPackage.comment.length > 0" class="space-y-4 mb-6">
                      <div v-for="(comment, index) in viewingPackage.comment" :key="index"
                        class="bg-gray-50 p-4 rounded-md">
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
                    @click="editFromViewModal">
                    <PencilIcon class="h-4 w-4 mr-2" />
                    Edit Package
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

          <!-- Add Package Modal -->
          <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            @click="closeAddModal">
            <div class="bg-white rounded-lg shadow-lg max-w-[800px] w-full max-h-[90vh] overflow-auto" @click.stop>
              <div class="p-6">
                <div class="flex flex-col space-y-1.5 pb-4">
                  <h2 class="text-lg font-semibold leading-none tracking-tight">Add New Package</h2>
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
                      addPackageTab === 'details' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                    ]" @click="addPackageTab = 'details'">
                      Package Details
                    </button>
                    <button :class="[
                      'flex-1 text-sm font-medium rounded-md px-4 py-2 transition-colors duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                      addPackageTab === 'stops' ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-200 dark:text-black' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-600'
                    ]" @click="addPackageTab = 'stops'">
                      Tracking Stops
                    </button>
                  </div>


                  <div v-if="addPackageTab === 'details'" class="space-y-4 mt-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="containerNumber" class="text-sm font-medium">Container Number</label>
                        <input id="containerNumber" v-model="newPackage.containerNumber"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.containerNumber ? 'border-red-500' : '']" />
                        <p v-if="formErrors.containerNumber" class="text-red-500 text-sm">{{ formErrors.containerNumber
                        }}
                        </p>
                      </div>
                      <div class="space-y-2">
                        <label for="truckNumber" class="text-sm font-medium">Truck Number</label>
                        <input id="truckNumber" v-model="newPackage.truckNumber"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.truckNumber ? 'border-red-500' : '']" />
                        <p v-if="formErrors.truckNumber" class="text-red-500 text-sm">{{ formErrors.truckNumber }}</p>
                      </div>
                      <div class="space-y-2">
                        <label for="blNumber" class="text-sm font-medium">BL Number</label>
                        <input id="blNumber" v-model="newPackage.blNumber"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.blNumber ? 'border-red-500' : '']" />
                        <p v-if="formErrors.blNumber" class="text-red-500 text-sm">{{ formErrors.blNumber }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="type" class="text-sm font-medium">Package Type</label>
                        <input id="type" v-model="newPackage.type"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.type ? 'border-red-500' : '']" />
                        <p v-if="formErrors.type" class="text-red-500 text-sm">{{ formErrors.type }}</p>
                      </div>
                      <div class="space-y-2">
                        <label for="weight" class="text-sm font-medium">Weight (kg)</label>
                        <input id="weight" v-model="newPackage.weight"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.weight ? 'border-red-500' : '']" />
                        <p v-if="formErrors.weight" class="text-red-500 text-sm">{{ formErrors.weight }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="shippedDate" class="text-sm font-medium">Shipped Date</label>
                        <input id="shippedDate" type="date" v-model="newPackage.shippedDate"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.shippedDate ? 'border-red-500' : '']" />
                        <p v-if="formErrors.shippedDate" class="text-red-500 text-sm">{{ formErrors.shippedDate }}</p>
                      </div>
                      <div class="space-y-2">
                        <label for="estimatedDelivery" class="text-sm font-medium">Estimated Delivery</label>
                        <input id="estimatedDelivery" type="date" v-model="newPackage.estimatedDelivery"
                          :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.estimatedDelivery ? 'border-red-500' : '']" />
                        <p v-if="formErrors.estimatedDelivery" class="text-red-500 text-sm">{{
                          formErrors.estimatedDelivery
                        }}
                        </p>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="currentLocation" class="text-sm font-medium">Current Location</label>
                      <select id="currentLocation" v-model="newPackage.currentLocation"
                        @change="handleNewPackageLocationChange"
                        :class="['flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', formErrors.currentLocation ? 'border-red-500' : '']">
                        <option value="" disabled selected>Select location</option>
                        <option v-for="location in allLocations" :key="location" :value="location">{{ location }}
                        </option>
                      </select>
                      <p v-if="formErrors.currentLocation" class="text-red-500 text-sm">{{ formErrors.currentLocation }}
                      </p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label for="nextStop" class="text-sm font-medium">Next Stop</label>
                        <input id="nextStop" v-model="newPackage.nextStop" readonly
                          class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        <p class="text-xs text-gray-500">Automatically determined based on current location</p>
                      </div>
                      <div class="space-y-2">
                        <label for="nextStopETA" class="text-sm font-medium">Next Stop ETA</label>
                        <input id="nextStopETA" type="date" v-model="newPackage.nextStopETA" readonly
                          class="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label for="finalDestination" class="text-sm font-medium">Final Destination</label>
                      <input id="finalDestination" v-model="newPackage.finalDestination"
                        :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', formErrors.finalDestination ? 'border-red-500' : '']" />
                      <p v-if="formErrors.finalDestination" class="text-red-500 text-sm">{{ formErrors.finalDestination
                      }}
                      </p>
                    </div>
                  </div>

                  <div v-if="addPackageTab === 'stops'" class="space-y-4 mt-4">
                    <div v-if="stopErrors.general" class="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{{
                      stopErrors.general }}</div>

                    <div class="bg-gray-50 p-4 rounded-md border">
                      <h3 class="font-medium text-lg mb-3">Add Tracking Stop</h3>
                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="space-y-2">
                          <label for="status" class="text-sm font-medium">Status</label>
                          <input id="status" placeholder="e.g., Package received, In transit" v-model="newStop.status"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', stopErrors.status ? 'border-red-500' : '']" />
                          <p v-if="stopErrors.status" class="text-red-500 text-sm">{{ stopErrors.status }}</p>
                        </div>
                        <div class="space-y-2">
                          <label for="location" class="text-sm font-medium">Location</label>
                          <input id="location" placeholder="e.g., Nairobi Warehouse" v-model="newStop.location"
                            :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', stopErrors.location ? 'border-red-500' : '']" />
                          <p v-if="stopErrors.location" class="text-red-500 text-sm">{{ stopErrors.location }}</p>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="space-y-2">
                          <label for="timestamp" class="text-sm font-medium">Date & Time</label>
                          <div class="relative">
                            <input id="timestamp" type="datetime-local" v-model="newStop.timestamp"
                              :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', stopErrors.timestamp ? 'border-red-500' : '']" />
                            <CalendarIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                          </div>
                          <p v-if="stopErrors.timestamp" class="text-red-500 text-sm">{{ stopErrors.timestamp }}</p>
                        </div>

                        <div class="space-y-2">
                          <label for="stopComment" class="text-sm font-medium">Comment</label>
                          <textarea id="stopComment" placeholder="Enter comment for this stop" v-model="newStop.comment"
                            rows="2"
                            class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"></textarea>
                        </div>
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
                        <p class="text-sm text-gray-400 mt-1">Add stops to create the package's tracking history</p>
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
                    @click="addNewPackage">
                    Add Package
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
                  <p class="text-sm text-muted-foreground">Create a new user account with specific permissions.</p>
                </div>

                <form @submit.prevent="addNewUser" class="space-y-4 py-4">
                  <div class="space-y-2">
                    <label for="name" class="text-sm font-medium">Full Name</label>
                    <input id="name" v-model="newUser.name"
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.name ? 'border-red-500' : '']" />
                    <p v-if="userFormErrors.name" class="text-red-500 text-sm">{{ userFormErrors.name }}</p>
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
                    <p v-if="userFormErrors.username" class="text-red-500 text-sm">{{ userFormErrors.username }}</p>
                  </div>

                  <div class="space-y-2">
                    <label for="password" class="text-sm font-medium">Password</label>
                    <input id="password" type="password" v-model="newUser.password"
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.password ? 'border-red-500' : '']" />
                    <p v-if="userFormErrors.password" class="text-red-500 text-sm">{{ userFormErrors.password }}</p>
                  </div>

                  <div class="space-y-2">
                    <label for="role" class="text-sm font-medium">Role</label>
                    <select id="role" v-model="newUser.role"
                      :class="['flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', userFormErrors.role ? 'border-red-500' : '']">
                      <option value="" disabled selected>Select role</option>
                      <option value="admin">Admin</option>
                      <option value="operator">Operator</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <p v-if="userFormErrors.role" class="text-red-500 text-sm">{{ userFormErrors.role }}</p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium">Permissions</label>
                    <div class="space-y-2">
                      <div class="flex items-center">
                        <input id="perm-packages" type="checkbox" v-model="newUser.permissions.packages"
                          class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                        <label for="perm-packages" class="ml-2 text-sm text-gray-700">Manage Packages</label>
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
                    <button type="submit"
                      class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-[#273272] text-white hover:bg-[#1e2759] h-10 px-4 py-2">
                      Add User
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
                    <input id="edit-name" v-model="editingUser.name"
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
                    <select id="edit-role" v-model="editingUser.role"
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
                      <div class="flex items-center">
                        <input id="edit-perm-packages" type="checkbox" v-model="editingUser.permissions.packages"
                          class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                        <label for="edit-perm-packages" class="ml-2 text-sm text-gray-700">Manage Packages</label>
                      </div>
                      <div class="flex items-center">
                        <input id="edit-perm-users" type="checkbox" v-model="editingUser.permissions.users"
                          class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                        <label for="edit-perm-users" class="ml-2 text-sm text-gray-700">Manage Users</label>
                      </div>
                      <div class="flex items-center">
                        <input id="edit-perm-reports" type="checkbox" v-model="editingUser.permissions.reports"
                          class="h-4 w-4 rounded border-gray-300 text-[#273272] focus:ring-[#273272]" />
                        <label for="edit-perm-reports" class="ml-2 text-sm text-gray-700">View Reports</label>
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
                  <p class="text-sm text-muted-foreground">Are you sure you want to delete this user? This action cannot
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
      </main>

      <!-- Package Tracking Dialog -->
      <div v-if="showTrackingDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
        @click="closeTrackingDialog">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden" @click.stop>
          <!-- Dialog Header -->
          <div class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-[#273272] text-white">
            <div class="flex-1 min-w-0">
              <h2 class="text-lg sm:text-xl font-semibold truncate">Package Tracking Details</h2>
              <p class="text-gray-200 text-xs sm:text-sm mt-1 truncate">Container: {{ selectedPackage?.containerNumber
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
            <PackageTracking v-if="selectedPackage" :pkg="selectedPackage" class="print-content" />
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
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
  ExclamationTriangleIcon,
  ArchiveBoxIcon
} from '@heroicons/vue/24/outline'
import { LogOut } from 'lucide-vue-next'
import { mockPackages } from '../data/mock-data'
import PackageTracking from './PackageTracking.vue'
import ShippingProgress from '../components/ShippingProgress.vue'


// Authentication state
const isAuthenticated = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')

// Sidebar state
const sidebarCollapsed = ref(false)




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

// Package Tracking Dialog state
const showTrackingDialog = ref(false)
const selectedPackage = ref(null)

// Device detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)


// Current view state
const currentView = ref('dashboard')

// Current user
const currentUser = ref({
  id: 1,
  name: 'Admin User',
  email: 'admin@texmonlogistics.co.ke',
  username: 'admin',
  role: 'Administrator',
  initials: 'AU'
})

// Package management state
const packages = ref([...mockPackages])
const searchTerm = ref('')
const currentYear = computed(() => new Date().getFullYear())

// User management state
const users = ref([
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@texmonlogistics.co.ke',
    username: 'admin',
    password: 'texmon2024',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-05-22 09:30 AM',
    permissions: {
      packages: true,
      users: true,
      reports: true
    }
  },
  {
    id: 2,
    name: 'John Operator',
    email: 'john@texmonlogistics.co.ke',
    username: 'john',
    password: 'password123',
    role: 'operator',
    status: 'active',
    lastLogin: '2025-05-21 02:15 PM',
    permissions: {
      packages: true,
      users: false,
      reports: true
    }
  },
  {
    id: 3,
    name: 'Sarah Viewer',
    email: 'sarah@texmonlogistics.co.ke',
    username: 'sarah',
    password: 'password123',
    role: 'viewer',
    status: 'active',
    lastLogin: '2025-05-20 11:45 AM',
    permissions: {
      packages: false,
      users: false,
      reports: true
    }
  },
  {
    id: 4,
    name: 'Michael Johnson',
    email: 'michael@texmonlogistics.co.ke',
    username: 'michael',
    password: 'password123',
    role: 'operator',
    status: 'inactive',
    lastLogin: '2025-05-15 10:30 AM',
    permissions: {
      packages: true,
      users: false,
      reports: false
    }
  }
])
const userSearchTerm = ref('')
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteUserModal = ref(false)
const userToDelete = ref(null)
const userFormErrors = ref({})

// New user form
const newUser = ref({
  name: '',
  email: '',
  username: '',
  password: '',
  role: '',
  status: 'active',
  permissions: {
    packages: false,
    users: false,
    reports: false
  }
})

// Editing user
const editingUser = ref(null)

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
  {
    id: 2,
    type: 'package',
    user: 'John Operator',
    time: '2025-05-23 10:15 AM',
    message: 'Package location updated',
    details: 'Package MSCU7654321 location changed from "Nairobi Warehouse" to "Nairobi Distribution Center"'
  },
  {
    id: 3,
    type: 'user',
    user: 'Admin User',
    time: '2025-05-22 03:45 PM',
    message: 'New user account created',
    details: 'Created user account for Sarah Viewer with viewer role'
  },
  {
    id: 4,
    type: 'package',
    user: 'John Operator',
    time: '2025-05-22 01:30 PM',
    message: 'New package added',
    details: 'Added package CMAU2345678 to the system'
  },
  {
    id: 5,
    type: 'login',
    user: 'Sarah Viewer',
    time: '2025-05-22 11:45 AM',
    message: 'User logged in successfully',
    details: 'IP Address: 192.168.1.5, Browser: Firefox 98.0.0'
  },
  {
    id: 6,
    type: 'package',
    user: 'John Operator',
    time: '2025-05-21 09:20 AM',
    message: 'Package comment added',
    details: 'Added comment to package MAEU3456789: "Customer requested priority handling"'
  },
  {
    id: 7,
    type: 'user',
    user: 'Admin User',
    time: '2025-05-20 04:15 PM',
    message: 'User permissions updated',
    details: 'Updated permissions for John Operator: added report access'
  },
  {
    id: 8,
    type: 'system',
    user: 'System',
    time: '2025-05-20 12:00 AM',
    message: 'Daily backup completed',
    details: 'Database backup completed successfully. Size: 256MB'
  }
])
const activitySearchTerm = ref('')
const activityFilter = ref('all')

// Recent activity for dashboard
const recentActivity = computed(() => {
  return activityLogs.value.slice(0, 5)
})



// Filtered packages based on search term
const filteredPackages = computed(() => {
  if (!searchTerm.value) return packages.value

  return packages.value.filter(pkg =>
    pkg.containerNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    pkg.truckNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    pkg.blNumber.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Filtered users based on search term
const filteredUsers = computed(() => {
  if (!userSearchTerm.value) return users.value

  return users.value.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.value.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.value.toLowerCase()) ||
    user.username.toLowerCase().includes(userSearchTerm.value.toLowerCase())
  )
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
  containerNumber: '',
  truckNumber: '',
  blNumber: '',
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
  comment: []
})
const stopErrors = ref({})

// Comments state
const newComment = ref({
  text: '',
  author: 'Admin',
  timestamp: ''
})

// Helper functions
const getInitials = (name) => {
  if (!name) return 'NA'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'login':
      return LogOut
    case 'package':
      return ArchiveBoxIcon
    case 'user':
      return UsersIcon
    default:
      return CogIcon
  }
}

const getPackagesByStatus = (status) => {
  if (status === 'transit') {
    return packages.value.filter(pkg =>
      pkg.trackingHistory.some(event => event.status.toLowerCase().includes('transit'))
    ).length
  } else if (status === 'delivered') {
    return packages.value.filter(pkg =>
      pkg.trackingHistory.some(event => event.status.toLowerCase().includes('delivered'))
    ).length
  } else if (status === 'delayed') {
    return packages.value.filter(pkg =>
      pkg.trackingHistory.some(event => event.status.toLowerCase().includes('delay'))
    ).length
  }
  return 0
}

const getUsersByRole = (role) => {
  return users.value.filter(user => user.role === role).length
}

// Activity logging function
const logActivity = (type, user, message, details = null) => {
  const newActivity = {
    id: activityLogs.value.length + 1,
    type,
    user,
    time: new Date().toLocaleString(),
    message,
    details
  }

  activityLogs.value.unshift(newActivity)
}

// User management functions
const openAddUserModal = () => {
  showAddUserModal.value = true
  resetNewUserForm()
}

const closeAddUserModal = () => {
  showAddUserModal.value = false
}

const addNewUser = () => {
  if (validateUserForm()) {
    const newUserToAdd = {
      id: users.value.length + 1,
      ...newUser.value,
      status: 'active',
      lastLogin: null
    }

    users.value.push(newUserToAdd)

    // Log the activity
    logActivity('user', currentUser.value.name, 'New user account created', `Created user account for ${newUserToAdd.name} with ${newUserToAdd.role} role`)

    closeAddUserModal()
  }
}

const validateUserForm = () => {
  userFormErrors.value = {}
  let isValid = true

  if (!newUser.value.name) {
    userFormErrors.value.name = 'Name is required'
    isValid = false
  }

  if (!newUser.value.email) {
    userFormErrors.value.email = 'Email is required'
    isValid = false
  } else if (!isValidEmail(newUser.value.email)) {
    userFormErrors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!newUser.value.username) {
    userFormErrors.value.username = 'Username is required'
    isValid = false
  } else if (users.value.some(user => user.username === newUser.value.username)) {
    userFormErrors.value.username = 'Username already exists'
    isValid = false
  }

  if (!newUser.value.password) {
    userFormErrors.value.password = 'Password is required'
    isValid = false
  } else if (newUser.value.password.length < 8) {
    userFormErrors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!newUser.value.role) {
    userFormErrors.value.role = 'Role is required'
    isValid = false
  }

  return isValid
}

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const resetNewUserForm = () => {
  newUser.value = {
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    status: 'active',
    permissions: {
      packages: false,
      users: false,
      reports: false
    }
  }
  userFormErrors.value = {}
}

const editUser = (user) => {
  editingUser.value = { ...user, newPassword: '' }
  showEditUserModal.value = true
}

const closeEditUserModal = () => {
  showEditUserModal.value = false
  editingUser.value = null
}

const updateUser = () => {
  if (!editingUser.value) return

  // Update the user in the users array
  users.value = users.value.map(user => {
    if (user.id === editingUser.value.id) {
      const updatedUser = {
        ...user,
        name: editingUser.value.name,
        email: editingUser.value.email,
        role: editingUser.value.role,
        status: editingUser.value.status,
        permissions: { ...editingUser.value.permissions }
      }

      // Update password if provided
      if (editingUser.value.newPassword) {
        updatedUser.password = editingUser.value.newPassword
      }

      return updatedUser
    }
    return user
  })

  // Log the activity
  logActivity('user', currentUser.value.name, 'User account updated', `Updated user account for ${editingUser.value.name}`)

  closeEditUserModal()
}

const confirmDeleteUser = (user) => {
  userToDelete.value = user
  showDeleteUserModal.value = true
}

const closeDeleteUserModal = () => {
  showDeleteUserModal.value = false
  userToDelete.value = null
}

const deleteUser = () => {
  if (!userToDelete.value) return

  // Remove the user from the users array
  users.value = users.value.filter(user => user.id !== userToDelete.value.id)

  // Log the activity
  logActivity('user', currentUser.value.name, 'User account deleted', `Deleted user account for ${userToDelete.value.name}`)

  closeDeleteUserModal()
}

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

  // Log the activity
  logActivity('package', currentUser.value.name, 'Comment added to package', `Added comment to package ${packageId}: "${newComment.value.text.substring(0, 30)}${newComment.value.text.length > 30 ? '...' : ''}"`)

  // Reset the comment form
  newComment.value.text = ''
}


// Handle login function
const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'texmon2024') {
    isAuthenticated.value = true
    loginError.value = ''

    // Log the login activity
    logActivity('login', 'Admin User', 'User logged in successfully', 'IP Address: 192.168.1.1, Browser: Chrome 120.0.0')

    // Set current view to dashboard
    currentView.value = 'dashboard'
  } else {
    loginError.value = 'Invalid username or password'
  }
}

// Handle logout function
const logout = () => {
  // Log the logout activity
  logActivity('login', currentUser.value.name, 'User logged out', 'Session ended')

  isAuthenticated.value = false
  username.value = ''
  password.value = ''
}

// Package Tracking Dialog functions
const openTrackingDialog = (pkg) => {
  selectedPackage.value = pkg
  showTrackingDialog.value = true
}

const closeTrackingDialog = () => {
  showTrackingDialog.value = false
  selectedPackage.value = null
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
        <title>Package Tracking - ${selectedPackage.value?.containerNumber}</title>
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

const handleDownloadPDF = async () => {
  try {
    await nextTick(); // DOM updates
    await waitForImages(); // Ensure images like QR code are loaded

    const printContent = document.getElementById('tracking-content');
    if (!printContent) {
      console.error('Tracking content not found');
      alert('Tracking content not found');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Package Tracking - ${selectedPackage.value?.containerNumber}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
              setTimeout(function() {
                window.print();
                window.close();
              }, 800);
            };
          <\/script>
        </body>
      </html>
    `);

    printWindow.document.close();
  } catch (error) {
    console.error('Error creating PDF-like print window:', error);
    alert('Failed to generate PDF');
  }
};





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

const printPackageDetails = (pkg) => {
  // For now, open tracking dialog - you can implement a separate view modal if needed
  openTrackingDialog(pkg)
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

    const oldLocation = editingPackage.value.currentLocation
    const newLocation = editData.value.currentLocation

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

  // Log the activity if location changed
  if (oldLocation !== newLocation) {
    logActivity('package', currentUser.value.name, 'Package location updated',
      `Package ${editingPackage.value.containerNumber} location changed from "${oldLocation}" to "${newLocation}"`)
  }

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
      containerNumber: newPackage.value.containerNumber,
      truckNumber: newPackage.value.truckNumber,
      blNumber: newPackage.value.blNumber,
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

    // Log the activity
    logActivity('package', currentUser.value.name, 'New package added',
      `Added package ${newPackageToAdd.containerNumber} to the system`)

    closeAddModal()
  }
}

const validateForm = () => {
  formErrors.value = {}
  let isValid = true

  if (!newPackage.value.containerNumber) {
    formErrors.value.containerNumber = 'Container number is required'
    isValid = false
  }

  if (!newPackage.value.truckNumber) {
    formErrors.value.truckNumber = 'Truck number is required'
    isValid = false
  }

  if (!newPackage.value.blNumber) {
    formErrors.value.blNumber = 'BL number is required'
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
    containerNumber: '',
    truckNumber: '',
    blNumber: '',
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


// Event listeners
onMounted(() => {
  checkMobileDevice()
  window.addEventListener('resize', checkMobileDevice)
  // Auto-login for demo
  isAuthenticated.value = true
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