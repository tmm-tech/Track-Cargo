export interface ShippingAddress {
  recipientName: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  notes?: string
}

export interface Package {
  id: string
  trackingNumber: string
  dispatchNumber: string
  type: string
  weight: string
  shippedDate: string
  estimatedDelivery: string
  currentLocation: string
  nextStop: string
  nextStopETA: string
  finalDestination: string
  lastUpdated: string
  shippingAddress: ShippingAddress
  trackingHistory: TrackingEvent[]
}

export interface LocationRoute {
  location: string
  nextStop: string
  estimatedDays: number
}
