
export interface Clearance {
  fileReference: string
  cargoDescription: string
  eta: Date
  grossWeight: number
  netWeight: number
  vesselName: string
}

export interface ShippingAddress {
  recipientName: string
  streetAddress: string
  city: string
  state: string
  country: string
  phone: string
  email: string
  specialInstruction: string
}

export interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  comment?: {
    text?: string
    message?: string
    user_fullname?: string
  }
}

export interface Package {
  id: string
  truck_number: string
  container_number: string
  bl_number: string
  type: string
  weight: string
  shipped_date: string
  estimated_delivery: string
  current_location: string
  next_stop: string
  next_stop_eta: string
  final_destination: string
  lastUpdated: string
  shipping_address: ShippingAddress
  tracking_history: TrackingEvent[]
}

