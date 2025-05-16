// Define the location routes/paths
export type LocationRoute = {
  location: string
  nextStop: string
  estimatedDays: number // Days to next stop
}

// Define all possible locations and their next stops
export const locationRoutes: LocationRoute[] = [
  {
    location: "Nairobi Warehouse",
    nextStop: "Nairobi Sorting Facility",
    estimatedDays: 1,
  },
  {
    location: "Nairobi Sorting Facility",
    nextStop: "Nairobi Distribution Center",
    estimatedDays: 1,
  },
  {
    location: "Nairobi Distribution Center",
    nextStop: "Mombasa Hub",
    estimatedDays: 2,
  },
  {
    location: "Mombasa Hub",
    nextStop: "Mombasa Port",
    estimatedDays: 1,
  },
  {
    location: "Mombasa Port",
    nextStop: "Delivery",
    estimatedDays: 3,
  },
  {
    location: "Kampala Warehouse",
    nextStop: "Kampala Hub",
    estimatedDays: 1,
  },
  {
    location: "Kampala Hub",
    nextStop: "Entebbe Distribution Center",
    estimatedDays: 1,
  },
  {
    location: "Entebbe Distribution Center",
    nextStop: "Delivery",
    estimatedDays: 2,
  },
  {
    location: "Dar es Salaam Sorting Facility",
    nextStop: "Arusha Distribution",
    estimatedDays: 2,
  },
  {
    location: "Arusha Distribution",
    nextStop: "Delivery",
    estimatedDays: 1,
  },
  {
    location: "Kigali Cold Storage",
    nextStop: "Gisenyi Distribution",
    estimatedDays: 2,
  },
  {
    location: "Gisenyi Distribution",
    nextStop: "Delivery",
    estimatedDays: 1,
  },
]

// Get all unique locations
export const allLocations = Array.from(
  new Set([...locationRoutes.map((route) => route.location), ...locationRoutes.map((route) => route.nextStop)]),
).filter((location) => location !== "Delivery")

// Function to get the next stop based on current location
export const getNextStop = (currentLocation: string): string => {
  const route = locationRoutes.find((r) => r.location === currentLocation)
  return route ? route.nextStop : "Delivery"
}

// Function to calculate the estimated arrival date based on current location
export const calculateEstimatedArrival = (currentLocation: string): string => {
  const route = locationRoutes.find((r) => r.location === currentLocation)

  if (!route) return ""

  const today = new Date()
  const arrivalDate = new Date(today)
  arrivalDate.setDate(today.getDate() + route.estimatedDays)

  return arrivalDate.toISOString().split("T")[0] // Format as YYYY-MM-DD
}
