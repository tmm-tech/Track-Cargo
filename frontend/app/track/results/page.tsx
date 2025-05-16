"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, TruckIcon, CheckCircle } from "lucide-react"
import { mockPackages } from "@/lib/mock-data"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const trackingNumber = searchParams.get("number")

  const [packageData, setPackageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Simulate API call with a timeout
    const timer = setTimeout(() => {
      setLoading(false)

      const foundPackage = mockPackages.find(
        (pkg) => pkg.trackingNumber === trackingNumber || pkg.dispatchNumber === trackingNumber,
      )

      if (foundPackage) {
        setPackageData(foundPackage)
      } else {
        setError("No package found with the provided information")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [trackingNumber])

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

      <nav className="bg-[#273272] text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-col md:flex-row">
              <button className="md:hidden p-4 text-white focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden md:flex flex-col md:flex-row">
                <Link href="/" className="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                  Home
                </Link>
                <Link href="#" className="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                  About Us
                </Link>
                <Link href="#" className="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                  Services
                </Link>
                <Link href="#" className="px-4 py-3 hover:bg-[#ffb600] hover:text-[#273272]">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/track"
                className="px-6 py-3 bg-transparent text-white border border-white rounded-md hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors duration-300 inline-block"
              >
                Track Cargo
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 bg-[#ffb600] text-[#273272] rounded-md hover:bg-[#e6a500] transition-colors duration-300 inline-block"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-[#ffb600] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading tracking information...</p>
            </div>
          ) : error ? (
            <Card className="max-w-2xl mx-auto border-none shadow-lg">
              <CardHeader className="bg-[#273272] text-white rounded-t-lg">
                <CardTitle className="text-2xl">Package Not Found</CardTitle>
                <CardDescription className="text-gray-200">
                  We couldn't find any package with the provided information.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-6 text-gray-600">Please check your tracking or dispatch number and try again.</p>
                <Link href="/track">
                  <Button className="bg-[#ffb600] hover:bg-[#e6a500] text-[#273272] font-bold">Try Again</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            packageData && (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#273272] mb-6">Tracking Information</h1>

                <Card className="mb-8 border-none shadow-lg">
                  <CardHeader className="bg-[#273272] text-white rounded-t-lg">
                    <CardTitle>Package Details</CardTitle>
                    <CardDescription className="text-gray-200">Number: {trackingNumber}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium text-gray-500">Package Type</h3>
                        <p className="text-lg">{packageData.type}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Weight</h3>
                        <p className="text-lg">{packageData.weight} kg</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Shipped Date</h3>
                        <p className="text-lg">{packageData.shippedDate}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Estimated Delivery</h3>
                        <p className="text-lg">{packageData.estimatedDelivery}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-8 border-none shadow-lg">
                  <CardHeader className="bg-[#273272] text-white rounded-t-lg">
                    <CardTitle>Current Status</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="bg-[#273272]/10 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-[#273272]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 text-lg">Current Location</h3>
                        <p className="text-xl font-bold text-[#273272]">{packageData.currentLocation}</p>
                        <p className="text-gray-500">Updated: {packageData.lastUpdated}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 mb-8">
                      <div className="bg-[#273272]/10 p-3 rounded-full">
                        <TruckIcon className="h-6 w-6 text-[#273272]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 text-lg">Next Stop</h3>
                        <p className="text-xl font-bold text-[#273272]">{packageData.nextStop}</p>
                        <p className="text-gray-500">Estimated arrival: {packageData.nextStopETA}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-[#273272]/10 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-[#273272]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500 text-lg">Final Destination</h3>
                        <p className="text-xl font-bold text-[#273272]">{packageData.finalDestination}</p>
                        <p className="text-gray-500">Estimated delivery: {packageData.estimatedDelivery}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-[#273272] text-white rounded-t-lg">
                    <CardTitle>Shipping Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {packageData.trackingHistory.map((event: any, index: number) => (
                        <div key={index} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${index === 0 ? "bg-[#ffb600]" : "bg-gray-300"}`}
                            ></div>
                            {index < packageData.trackingHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 absolute top-4"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <p className="font-medium text-[#273272]">{event.status}</p>
                            <p className="text-sm text-gray-500">{event.location}</p>
                            <p className="text-sm text-gray-500">{event.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </div>
      </main>

      <footer className="bg-[#1a1a1a] text-white pt-12 pb-4">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400 mb-4">
                Texmon Logistics Limited, established in 2019, has swiftly evolved into a leading integrated logistics
                solutions provider across East Africa.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Working Hours</h3>
              <ul className="text-gray-400">
                <li className="flex justify-between mb-2">
                  <span>Monday - Friday:</span>
                  <span>08:00 - 17:00</span>
                </li>
                <li className="flex justify-between mb-2">
                  <span>Saturday:</span>
                  <span>Open</span>
                </li>
                <li className="flex justify-between mb-2">
                  <span>Sunday and holidays:</span>
                  <span>Open</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Services</h3>
              <ul className="text-gray-400 space-y-2">
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Land Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Sea Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Air Freight
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Customs Clearance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Cross Border Clearance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Project Cargo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#ffb600]">
                    Reverse Logistics
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">Copyright © {new Date().getFullYear()} Texmon Logistics Limited</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  About Us
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  Services
                </a>
                <a href="#" className="text-gray-400 hover:text-[#ffb600]">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
