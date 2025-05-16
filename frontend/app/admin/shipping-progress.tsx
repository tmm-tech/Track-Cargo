import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, MapPin } from "lucide-react"

type TrackingEvent = {
  status: string
  location: string
  timestamp: string
  notes?: string
}

type ShippingProgressProps = {
  trackingHistory: TrackingEvent[]
  currentLocation: string
  nextStop: string
  nextStopETA: string
  finalDestination: string
  estimatedDelivery: string
}

export function ShippingProgress({
  trackingHistory,
  currentLocation,
  nextStop,
  nextStopETA,
  finalDestination,
  estimatedDelivery,
}: ShippingProgressProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="bg-[#273272] text-white rounded-t-lg">
        <CardTitle>Shipping Progress</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center gap-4 p-3 bg-[#273272]/5 rounded-md">
            <div className="bg-[#273272] p-2 rounded-full">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Location</p>
              <p className="font-medium">{currentLocation}</p>
            </div>
            <Badge className="ml-auto bg-[#273272]">Current</Badge>
          </div>

          {/* Next Stop */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
            <div className="bg-gray-200 p-2 rounded-full">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Stop</p>
              <p className="font-medium">{nextStop}</p>
              <p className="text-xs text-gray-500">ETA: {nextStopETA}</p>
            </div>
            <Badge className="ml-auto bg-gray-500">Pending</Badge>
          </div>

          {/* Final Destination */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
            <div className="bg-gray-200 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Final Destination</p>
              <p className="font-medium">{finalDestination}</p>
              <p className="text-xs text-gray-500">ETA: {estimatedDelivery}</p>
            </div>
            <Badge className="ml-auto bg-gray-500">Pending</Badge>
          </div>

          {/* Tracking History Timeline */}
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">Tracking History</h3>
            <div className="space-y-6">
              {trackingHistory.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${index === 0 ? "bg-[#ffb600]" : "bg-gray-300"}`}></div>
                    {index < trackingHistory.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 absolute top-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-[#273272]">{event.status}</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.timestamp}</p>
                    {event.notes && <p className="text-sm text-gray-400 mt-1">{event.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
