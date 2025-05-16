"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Save, Plus, LogIn, Trash, Calendar, MapPin } from "lucide-react"
import { mockPackages } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { allLocations, getNextStop, calculateEstimatedArrival } from "@/lib/locations-data"
// Import the ShippingProgress component
import { ShippingProgress } from "@/app/admin/shipping-progress"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  const [packages, setPackages] = useState(mockPackages)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    currentLocation: "",
    nextStop: "",
    nextStopETA: "",
    shippingAddress: {
      recipientName: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  })
  const [activeEditTab, setActiveEditTab] = useState("location")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPackage, setNewPackage] = useState({
    trackingNumber: "",
    dispatchNumber: "",
    type: "",
    weight: "",
    shippedDate: "",
    estimatedDelivery: "",
    currentLocation: "",
    nextStop: "",
    nextStopETA: "",
    finalDestination: "",
    shippingAddress: {
      recipientName: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // New state for tracking stops
  const [trackingStops, setTrackingStops] = useState<
    Array<{
      status: string
      location: string
      timestamp: string
      notes?: string
    }>
  >([])
  const [newStop, setNewStop] = useState({
    status: "",
    location: "",
    timestamp: "",
    notes: "",
  })
  const [stopErrors, setStopErrors] = useState<Record<string, string>>({})

  // Add a new state for viewing package details
  const [viewingPackage, setViewingPackage] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Check if user is authenticated on component mount
  useEffect(() => {
    // In a real app, you would check for a valid session or token
    const checkAuth = localStorage.getItem("texmonAdminAuth")
    if (checkAuth === "authenticated") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would validate against a secure backend
    // This is just a simple demo with hardcoded credentials
    if (username === "admin" && password === "texmon2024") {
      setIsAuthenticated(true)
      localStorage.setItem("texmonAdminAuth", "authenticated")
      setLoginError("")
    } else {
      setLoginError("Invalid username or password")
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.dispatchNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg)
    setEditData({
      currentLocation: pkg.currentLocation,
      nextStop: pkg.nextStop,
      nextStopETA: pkg.nextStopETA,
      shippingAddress: {
        recipientName: pkg.shippingAddress?.recipientName || "",
        streetAddress: pkg.shippingAddress?.streetAddress || "",
        city: pkg.shippingAddress?.city || "",
        state: pkg.shippingAddress?.state || "",
        postalCode: pkg.shippingAddress?.postalCode || "",
        country: pkg.shippingAddress?.country || "",
      },
    })
    setActiveEditTab("location")
    setIsEditDialogOpen(true)
  }

  // Add a new function to handle viewing package details
  const handleViewDetails = (pkg: any) => {
    setViewingPackage(pkg)
    setIsViewDialogOpen(true)
  }

  const handleLocationChange = (location: string) => {
    const nextStop = getNextStop(location)
    const nextStopETA = calculateEstimatedArrival(location)

    setEditData({
      ...editData,
      currentLocation: location,
      nextStop: nextStop,
      nextStopETA: nextStopETA,
    })
  }

  const handleShippingAddressChange = (field: string, value: string) => {
    setEditData({
      ...editData,
      shippingAddress: {
        ...editData.shippingAddress,
        [field]: value,
      },
    })
  }

  // Update the handleSave function to save shipping address changes
  const handleSave = () => {
    if (!editingPackage) return

    // Get the current date and time
    const currentDateTime = new Date().toLocaleString()

    // Create a new tracking history entry for the location change
    const newHistoryEntry = {
      status:
        editData.currentLocation === editingPackage.currentLocation
          ? `Updated at ${editData.currentLocation}`
          : `Arrived at ${editData.currentLocation}`,
      location: editData.currentLocation,
      timestamp: currentDateTime,
    }

    // Check if shipping address was changed
    const isAddressChanged =
      editData.shippingAddress.recipientName !== editingPackage.shippingAddress?.recipientName ||
      editData.shippingAddress.streetAddress !== editingPackage.shippingAddress?.streetAddress ||
      editData.shippingAddress.city !== editingPackage.shippingAddress?.city ||
      editData.shippingAddress.state !== editingPackage.shippingAddress?.state ||
      editData.shippingAddress.postalCode !== editingPackage.shippingAddress?.postalCode ||
      editData.shippingAddress.country !== editingPackage.shippingAddress?.country

    // Create a shipping address update entry if address was changed
    let addressHistoryEntry = null
    if (isAddressChanged) {
      addressHistoryEntry = {
        status: "Shipping address updated",
        location: editData.currentLocation,
        timestamp: currentDateTime,
        notes: `Address changed to: ${editData.shippingAddress.streetAddress}, ${editData.shippingAddress.city}, ${editData.shippingAddress.state}, ${editData.shippingAddress.country}`,
      }
    }

    // Update the package with new location data and add to tracking history
    setPackages(
      packages.map((pkg) =>
        pkg.id === editingPackage.id
          ? {
              ...pkg,
              currentLocation: editData.currentLocation,
              nextStop: editData.nextStop,
              nextStopETA: editData.nextStopETA,
              shippingAddress: editData.shippingAddress,
              lastUpdated: currentDateTime,
              // Add the new entries at the beginning of the tracking history
              trackingHistory: addressHistoryEntry
                ? [addressHistoryEntry, newHistoryEntry, ...pkg.trackingHistory]
                : [newHistoryEntry, ...pkg.trackingHistory],
            }
          : pkg,
      ),
    )

    setIsEditDialogOpen(false)
    setEditingPackage(null)
  }

  const handleAddPackage = () => {
    // Validate form
    const errors: Record<string, string> = {}

    if (!newPackage.trackingNumber) errors.trackingNumber = "Tracking number is required"
    if (!newPackage.dispatchNumber) errors.dispatchNumber = "Dispatch number is required"
    if (!newPackage.type) errors.type = "Package type is required"
    if (!newPackage.weight) errors.weight = "Weight is required"
    if (!newPackage.shippedDate) errors.shippedDate = "Shipped date is required"
    if (!newPackage.estimatedDelivery) errors.estimatedDelivery = "Estimated delivery is required"
    if (!newPackage.currentLocation) errors.currentLocation = "Current location is required"
    if (!newPackage.nextStop) errors.nextStop = "Next stop is required"
    if (!newPackage.nextStopETA) errors.nextStopETA = "Next stop ETA is required"
    if (!newPackage.finalDestination) errors.finalDestination = "Final destination is required"

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Ensure we have at least one tracking stop
    if (trackingStops.length === 0) {
      setStopErrors({ general: "At least one tracking stop is required" })
      return
    }

    // Create new package
    const newPkg = {
      id: `pkg${packages.length + 1}`,
      ...newPackage,
      lastUpdated: new Date().toLocaleString(),
      trackingHistory: trackingStops,
    }

    // Add to packages array
    setPackages([...packages, newPkg])

    // Reset form and close dialog
    setNewPackage({
      trackingNumber: "",
      dispatchNumber: "",
      type: "",
      weight: "",
      shippedDate: "",
      estimatedDelivery: "",
      currentLocation: "",
      nextStop: "",
      nextStopETA: "",
      finalDestination: "",
      shippingAddress: {
        recipientName: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    })
    setTrackingStops([])
    setFormErrors({})
    setStopErrors({})
    setIsAddDialogOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setNewPackage({ ...newPackage, [field]: value })
    // Clear error for this field if it exists
    if (formErrors[field]) {
      const updatedErrors = { ...formErrors }
      delete updatedErrors[field]
      setFormErrors(updatedErrors)
    }
  }

  const handleStopInputChange = (field: string, value: string) => {
    setNewStop({ ...newStop, [field]: value })
    // Clear error for this field if it exists
    if (stopErrors[field]) {
      const updatedErrors = { ...stopErrors }
      delete updatedErrors[field]
      setStopErrors(updatedErrors)
    }
  }

  const addTrackingStop = () => {
    // Validate stop
    const errors: Record<string, string> = {}
    if (!newStop.status) errors.status = "Status is required"
    if (!newStop.location) errors.location = "Location is required"
    if (!newStop.timestamp) errors.timestamp = "Date and time is required"

    if (Object.keys(errors).length > 0) {
      setStopErrors(errors)
      return
    }

    // Add stop to tracking history
    setTrackingStops([...trackingStops, { ...newStop }])

    // Reset form
    setNewStop({
      status: "",
      location: "",
      timestamp: "",
      notes: "",
    })
    setStopErrors({})
  }

  const removeTrackingStop = (index: number) => {
    const updatedStops = [...trackingStops]
    updatedStops.splice(index, 1)
    setTrackingStops(updatedStops)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-[#273272] text-white">
          <div className="container mx-auto">
            <div className="flex justify-between items-center py-2 px-4">
              <div className="flex items-center">
                <span className="text-sm">
                  <i className="mr-2">📍</i> Texmon Logistics Limited, Kenya
                </span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-sm hover:text-[#ffb600]">
                  <i className="mr-1">📱</i> Facebook
                </a>
                <a href="#" className="text-sm hover:text-[#ffb600]">
                  <i className="mr-1">📱</i> Twitter
                </a>
                <a href="#" className="text-sm hover:text-[#ffb600]">
                  <i className="mr-1">📱</i> WhatsApp
                </a>
                <a href="#" className="text-sm hover:text-[#ffb600]">
                  <i className="mr-1">📱</i> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white border-b">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-[#273272]">Texmon Logistics</span>
                </Link>
              </div>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
                <div className="flex items-center">
                  <div className="mr-2 text-[#ffb600]">📞</div>
                  <div>
                    <p className="text-sm text-gray-600">Call Us</p>
                    <p className="font-semibold">(+254) 795 616 827</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 text-[#ffb600]">✉️</div>
                  <div>
                    <p className="text-sm text-gray-600">Email Us</p>
                    <p className="font-semibold">enquiries@texmonlogistics.co.ke</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-none shadow-lg">
            <CardHeader className="bg-[#273272] text-white rounded-t-lg">
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription className="text-gray-200">Please login to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{loginError}</div>}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] font-bold">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>

        <footer className="bg-[#1a1a1a] text-white pt-12 pb-4">
          <div className="container mx-auto px-4">
            <div className="border-t border-gray-800 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400">Copyright © {new Date().getFullYear()} Texmon Logistics Limited</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-[#273272] text-white">
        <div className="container mx-auto">
          <div className="flex justify-between items-center py-2 px-4">
            <div className="flex items-center">
              <span className="text-sm">
                <i className="mr-2">📍</i> Texmon Logistics Limited, Kenya
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem("texmonAdminAuth")
                  setIsAuthenticated(false)
                }}
                className="text-sm hover:text-[#ffb600]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 px-4">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#273272]">Texmon Logistics</span>
              </Link>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#273272]">Admin Dashboard</h2>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-lg mb-8">
            <CardHeader className="flex flex-row items-center justify-between bg-[#273272] text-white rounded-t-lg">
              <div>
                <CardTitle>Package Management</CardTitle>
                <CardDescription className="text-gray-200">
                  Update the current location and next stop information for packages
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-transparent text-white border border-white hover:bg-red-600 hover:border-red-600 transition-colors duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by tracking or dispatch number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>

              <div className="rounded-md border border-gray-200 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Tracking #</TableHead>
                      <TableHead>Dispatch #</TableHead>
                      <TableHead>Current Location</TableHead>
                      <TableHead>Next Stop</TableHead>
                      <TableHead>Next Stop ETA</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPackages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No packages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Update the TableRow to include a View Details button
                      filteredPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>{pkg.trackingNumber}</TableCell>
                          <TableCell>{pkg.dispatchNumber}</TableCell>
                          <TableCell>{pkg.currentLocation}</TableCell>
                          <TableCell>{pkg.nextStop}</TableCell>
                          <TableCell>{pkg.nextStopETA}</TableCell>
                          <TableCell>{pkg.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(pkg)}>
                                View
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit Package Dialog with Tabs for Location and Shipping Address */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Update Package Information</DialogTitle>
                <DialogDescription>Update the package location and shipping address information.</DialogDescription>
              </DialogHeader>

              {editingPackage && (
                <div className="space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                      <p>{editingPackage.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dispatch Number</p>
                      <p>{editingPackage.dispatchNumber}</p>
                    </div>
                  </div>

                  <Tabs value={activeEditTab} onValueChange={setActiveEditTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="address">Shipping Address</TabsTrigger>
                    </TabsList>

                    <TabsContent value="location" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentLocation">Current Location</Label>
                        <Select value={editData.currentLocation} onValueChange={handleLocationChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {allLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nextStop">Next Stop</Label>
                          <Input id="nextStop" value={editData.nextStop} readOnly className="bg-gray-50" />
                          <p className="text-xs text-gray-500">Automatically determined based on current location</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nextStopETA">Next Stop ETA</Label>
                          <Input
                            id="nextStopETA"
                            type="date"
                            value={editData.nextStopETA}
                            readOnly
                            className="bg-gray-50"
                          />
                          <p className="text-xs text-gray-500">Estimated based on standard transit times</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="address" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName">Recipient Name</Label>
                        <Input
                          id="recipientName"
                          value={editData.shippingAddress.recipientName}
                          onChange={(e) => handleShippingAddressChange("recipientName", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="streetAddress">Street Address</Label>
                        <Input
                          id="streetAddress"
                          value={editData.shippingAddress.streetAddress}
                          onChange={(e) => handleShippingAddressChange("streetAddress", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={editData.shippingAddress.city}
                            onChange={(e) => handleShippingAddressChange("city", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={editData.shippingAddress.state}
                            onChange={(e) => handleShippingAddressChange("state", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={editData.shippingAddress.postalCode}
                            onChange={(e) => handleShippingAddressChange("postalCode", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={editData.shippingAddress.country}
                            onChange={(e) => handleShippingAddressChange("country", e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-[#273272]">
                  <Save className="h-4 w-4 mr-2" />
                  Update Package
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Package Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Package Details</DialogTitle>
                <DialogDescription>
                  Tracking Number: {viewingPackage?.trackingNumber} | Dispatch Number: {viewingPackage?.dispatchNumber}
                </DialogDescription>
              </DialogHeader>

              {viewingPackage && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Package Type</p>
                      <p className="text-lg">{viewingPackage.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Weight</p>
                      <p className="text-lg">{viewingPackage.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Shipped Date</p>
                      <p className="text-lg">{viewingPackage.shippedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                      <p className="text-lg">{viewingPackage.estimatedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Final Destination</p>
                      <p className="text-lg">{viewingPackage.finalDestination}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="text-lg">{viewingPackage.lastUpdated}</p>
                    </div>
                  </div>

                  {/* Shipping Address Card */}
                  <Card className="border-none shadow-lg">
                    <CardHeader className="bg-[#273272] text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {viewingPackage.shippingAddress ? (
                        <div className="space-y-1">
                          <p className="font-medium">{viewingPackage.shippingAddress.recipientName}</p>
                          <p>{viewingPackage.shippingAddress.streetAddress}</p>
                          <p>
                            {viewingPackage.shippingAddress.city}, {viewingPackage.shippingAddress.state}{" "}
                            {viewingPackage.shippingAddress.postalCode}
                          </p>
                          <p>{viewingPackage.shippingAddress.country}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No shipping address information available</p>
                      )}
                    </CardContent>
                  </Card>

                  <ShippingProgress
                    trackingHistory={viewingPackage.trackingHistory}
                    currentLocation={viewingPackage.currentLocation}
                    nextStop={viewingPackage.nextStop}
                    nextStopETA={viewingPackage.nextStopETA}
                    finalDestination={viewingPackage.finalDestination}
                    estimatedDelivery={viewingPackage.estimatedDelivery}
                  />
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    handleEdit(viewingPackage)
                  }}
                  className="bg-[#273272]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Package
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Package Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Package</DialogTitle>
                <DialogDescription>Enter the details for the new package and its tracking history.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Package Details</TabsTrigger>
                  <TabsTrigger value="stops">Tracking Stops</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">Tracking Number</Label>
                      <Input
                        id="trackingNumber"
                        value={newPackage.trackingNumber}
                        onChange={(e) => handleInputChange("trackingNumber", e.target.value)}
                        className={formErrors.trackingNumber ? "border-red-500" : ""}
                      />
                      {formErrors.trackingNumber && <p className="text-red-500 text-sm">{formErrors.trackingNumber}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dispatchNumber">Dispatch Number</Label>
                      <Input
                        id="dispatchNumber"
                        value={newPackage.dispatchNumber}
                        onChange={(e) => handleInputChange("dispatchNumber", e.target.value)}
                        className={formErrors.dispatchNumber ? "border-red-500" : ""}
                      />
                      {formErrors.dispatchNumber && <p className="text-red-500 text-sm">{formErrors.dispatchNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Package Type</Label>
                      <Input
                        id="type"
                        value={newPackage.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                        className={formErrors.type ? "border-red-500" : ""}
                      />
                      {formErrors.type && <p className="text-red-500 text-sm">{formErrors.type}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        value={newPackage.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        className={formErrors.weight ? "border-red-500" : ""}
                      />
                      {formErrors.weight && <p className="text-red-500 text-sm">{formErrors.weight}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippedDate">Shipped Date</Label>
                      <Input
                        id="shippedDate"
                        type="date"
                        value={newPackage.shippedDate}
                        onChange={(e) => handleInputChange("shippedDate", e.target.value)}
                        className={formErrors.shippedDate ? "border-red-500" : ""}
                      />
                      {formErrors.shippedDate && <p className="text-red-500 text-sm">{formErrors.shippedDate}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                      <Input
                        id="estimatedDelivery"
                        type="date"
                        value={newPackage.estimatedDelivery}
                        onChange={(e) => handleInputChange("estimatedDelivery", e.target.value)}
                        className={formErrors.estimatedDelivery ? "border-red-500" : ""}
                      />
                      {formErrors.estimatedDelivery && (
                        <p className="text-red-500 text-sm">{formErrors.estimatedDelivery}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentLocation">Current Location</Label>
                    <Select
                      value={newPackage.currentLocation}
                      onValueChange={(value) => {
                        const nextStop = getNextStop(value)
                        const nextStopETA = calculateEstimatedArrival(value)

                        handleInputChange("currentLocation", value)
                        handleInputChange("nextStop", nextStop)
                        handleInputChange("nextStopETA", nextStopETA)
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {allLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.currentLocation && <p className="text-red-500 text-sm">{formErrors.currentLocation}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nextStop">Next Stop</Label>
                      <Input id="nextStop" value={newPackage.nextStop} readOnly className="bg-gray-50" />
                      <p className="text-xs text-gray-500">Automatically determined based on current location</p>
                      {formErrors.nextStop && <p className="text-red-500 text-sm">{formErrors.nextStop}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextStopETA">Next Stop ETA</Label>
                      <Input
                        id="nextStopETA"
                        type="date"
                        value={newPackage.nextStopETA}
                        readOnly
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">Estimated based on standard transit times</p>
                      {formErrors.nextStopETA && <p className="text-red-500 text-sm">{formErrors.nextStopETA}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finalDestination">Final Destination</Label>
                    <Input
                      id="finalDestination"
                      value={newPackage.finalDestination}
                      onChange={(e) => handleInputChange("finalDestination", e.target.value)}
                      className={formErrors.finalDestination ? "border-red-500" : ""}
                    />
                    {formErrors.finalDestination && (
                      <p className="text-red-500 text-sm">{formErrors.finalDestination}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="stops" className="space-y-4 mt-4">
                  {stopErrors.general && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">{stopErrors.general}</div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-md border">
                    <h3 className="font-medium text-lg mb-3">Add Tracking Stop</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Input
                          id="status"
                          placeholder="e.g., Package received, In transit"
                          value={newStop.status}
                          onChange={(e) => handleStopInputChange("status", e.target.value)}
                          className={stopErrors.status ? "border-red-500" : ""}
                        />
                        {stopErrors.status && <p className="text-red-500 text-sm">{stopErrors.status}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Nairobi Warehouse"
                          value={newStop.location}
                          onChange={(e) => handleStopInputChange("location", e.target.value)}
                          className={stopErrors.location ? "border-red-500" : ""}
                        />
                        {stopErrors.location && <p className="text-red-500 text-sm">{stopErrors.location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="timestamp">Date & Time</Label>
                        <div className="relative">
                          <Input
                            id="timestamp"
                            type="datetime-local"
                            value={newStop.timestamp}
                            onChange={(e) => handleStopInputChange("timestamp", e.target.value)}
                            className={stopErrors.timestamp ? "border-red-500" : ""}
                          />
                          <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                        {stopErrors.timestamp && <p className="text-red-500 text-sm">{stopErrors.timestamp}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Input
                          id="notes"
                          placeholder="Additional information"
                          value={newStop.notes}
                          onChange={(e) => handleStopInputChange("notes", e.target.value)}
                        />
                      </div>
                    </div>

                    <Button onClick={addTrackingStop} className="bg-[#273272] hover:bg-[#1e2759]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stop
                    </Button>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium text-lg mb-3">Tracking History</h3>
                    {trackingStops.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-md border">
                        <p className="text-gray-500">No tracking stops added yet</p>
                        <p className="text-sm text-gray-400 mt-1">Add stops to create the package's tracking history</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {trackingStops.map((stop, index) => (
                          <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-md border">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium">{stop.status}</p>
                                  <p className="text-sm text-gray-500">{stop.location}</p>
                                  <p className="text-sm text-gray-500">{formatDate(stop.timestamp)}</p>
                                  {stop.notes && <p className="text-sm text-gray-400 mt-1">{stop.notes}</p>}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTrackingStop(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setNewPackage({
                      trackingNumber: "",
                      dispatchNumber: "",
                      type: "",
                      weight: "",
                      shippedDate: "",
                      estimatedDelivery: "",
                      currentLocation: "",
                      nextStop: "",
                      nextStopETA: "",
                      finalDestination: "",
                      shippingAddress: {
                        recipientName: "",
                        streetAddress: "",
                        city: "",
                        state: "",
                        postalCode: "",
                        country: "",
                      },
                    })
                    setTrackingStops([])
                    setFormErrors({})
                    setStopErrors({})
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddPackage} className="bg-[#273272]">
                  Add Package
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <footer className="bg-[#1a1a1a] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              Copyright © {new Date().getFullYear()} Texmon Logistics Limited - Admin Portal
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
