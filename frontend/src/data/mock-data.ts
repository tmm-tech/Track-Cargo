export const mockPackages = [
  {
    id: "pkg1",
    containerNumber: "MSCU7654321", // Container No
    truckNumber: "BKG98765432", // Truck No
    blNumber: "MBLNO123456789", // B/L
    type: "Standard Package",
    weight: "5.2",
    shippedDate: "2025-04-22",
    estimatedDelivery: "2025-05-22",
    currentLocation: "Nairobi Distribution Center",
    nextStop: "Mombasa Hub",
    nextStopETA: "2025-05-21",
    finalDestination: "Mombasa",
    lastUpdated: "2025-05-18 08:30 AM",
    shippingAddress: {
      recipientName: "John Doe",
      streetAddress: "123 Ocean View Road",
      city: "Mombasa",
      state: "Coast",
      postalCode: "80100",
      country: "Kenya",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Nairobi Warehouse",
        timestamp: "2025-04-22 09:15 AM",
        comment:
          "Package received in good condition. All documentation complete. Customer requested priority handling.",
      },
      {
        status: "Processing",
        location: "Nairobi Warehouse",
        timestamp: "2025-04-23 11:30 AM",
        comment: "Package processed and prepared for dispatch. Contents verified against manifest.",
      },
      {
        status: "In transit",
        location: "Nairobi Sorting Facility",
        timestamp: "2025-04-25 02:45 PM",
        comment: "Package sorted and prepared for distribution. Priority shipping applied as requested.",
      },
      {
        status: "Delayed",
        location: "Nairobi Sorting Facility",
        timestamp: "2025-04-27 10:15 AM",
        comment: "Temporary delay due to vehicle maintenance. Expected to resume transit within 24 hours.",
      },
      {
        status: "In transit",
        location: "Nairobi-Mombasa Highway",
        timestamp: "2025-04-28 07:30 AM",
        comment: "Package en route to Mombasa. Estimated travel time: 8 hours.",
      },
      {
        status: "Checkpoint passed",
        location: "Mtito Andei Checkpoint",
        timestamp: "2025-04-28 11:45 AM",
        comment: "Package passed through checkpoint inspection. All documentation verified.",
      },
      {
        status: "In transit",
        location: "Nairobi-Mombasa Highway",
        timestamp: "2025-04-28 12:15 PM",
        comment: "Continuing journey to Mombasa. No issues reported.",
      },
      {
        status: "Weather delay",
        location: "Voi",
        timestamp: "2025-04-28 03:30 PM",
        comment: "Temporary delay due to heavy rainfall. Safety protocols in effect.",
      },
      {
        status: "In transit",
        location: "Nairobi-Mombasa Highway",
        timestamp: "2025-04-29 08:45 AM",
        comment: "Journey resumed after weather delay. Revised ETA calculated.",
      },
      {
        status: "Arrived at facility",
        location: "Mombasa Receiving Center",
        timestamp: "2025-04-29 02:30 PM",
        comment: "Package arrived at Mombasa facility. Awaiting processing.",
      },
      {
        status: "Processing",
        location: "Mombasa Sorting Facility",
        timestamp: "2025-04-30 09:20 AM",
        comment: "Package being processed for local delivery. Address verification complete.",
      },
      {
        status: "Sorted",
        location: "Mombasa Sorting Facility",
        timestamp: "2025-05-01 11:10 AM",
        comment: "Package sorted for delivery route. Assigned to local delivery team.",
      },
      {
        status: "Out for delivery",
        location: "Mombasa Local Delivery",
        timestamp: "2025-05-02 08:45 AM",
        comment: "Package out for delivery. Attempted delivery but recipient not available.",
      },
      {
        status: "Delivery attempt failed",
        location: "Mombasa Local Delivery",
        timestamp: "2025-05-02 02:15 PM",
        comment: "Recipient not available. Notice left. Package returned to facility.",
      },
      {
        status: "Awaiting pickup",
        location: "Mombasa Distribution Center",
        timestamp: "2025-05-03 09:30 AM",
        comment: "Package available for pickup. Recipient notified via SMS.",
      },
      {
        status: "Recipient contacted",
        location: "Mombasa Distribution Center",
        timestamp: "2025-05-10 10:45 AM",
        comment: "Recipient contacted and requested redelivery for May 20.",
      },
      {
        status: "Scheduled for redelivery",
        location: "Mombasa Distribution Center",
        timestamp: "2025-05-15 01:30 PM",
        comment: "Package scheduled for redelivery on May 20 between 9 AM and 12 PM.",
      },
      {
        status: "Arrived at facility",
        location: "Nairobi Distribution Center",
        timestamp: "2025-05-18 08:30 AM",
        comment: "Package arrived at distribution center. Ready for transport to Mombasa Hub for final delivery.",
      },
    ],
    comments: [],
  },
  {
    id: "pkg2",
    containerNumber: "CMAU2345678", // Container No
    truckNumber: "BOK87654321", // Truck No
    blNumber: "HBLNO987654321", // B/L
    type: "Express Package",
    weight: "2.8",
    shippedDate: "2025-05-01",
    estimatedDelivery: "2025-05-20",
    currentLocation: "Kampala Hub",
    nextStop: "Entebbe Distribution Center",
    nextStopETA: "2025-05-20",
    finalDestination: "Entebbe",
    lastUpdated: "2025-05-17 09:45 AM",
    shippingAddress: {
      recipientName: "Jane Smith",
      streetAddress: "456 Airport Road",
      city: "Entebbe",
      state: "Central Region",
      postalCode: "00256",
      country: "Uganda",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Kampala Warehouse",
        timestamp: "2025-05-01 10:30 AM",
        comment: "Express package received. Fragile items noted. Special handling required.",
      },
      {
        status: "Processing",
        location: "Kampala Warehouse",
        timestamp: "2025-05-01 02:15 PM",
        comment: "Package processed with priority handling. Contents verified and secured.",
      },
      {
        status: "Customs documentation",
        location: "Kampala Customs Office",
        timestamp: "2025-05-02 11:20 AM",
        comment: "Customs documentation prepared and submitted. Awaiting clearance.",
      },
      {
        status: "Customs cleared",
        location: "Kampala Customs Office",
        timestamp: "2025-05-05 09:45 AM",
        comment: "Customs clearance complete. All duties and taxes paid.",
      },
      {
        status: "In transit",
        location: "Kampala Hub",
        timestamp: "2025-05-06 08:30 AM",
        comment: "Package in transit to sorting facility. Express handling confirmed.",
      },
      {
        status: "Sorted",
        location: "Kampala Hub",
        timestamp: "2025-05-06 11:15 AM",
        comment: "Package sorted for Entebbe route. Priority handling maintained.",
      },
      {
        status: "Delivery scheduled",
        location: "Kampala Hub",
        timestamp: "2025-05-07 02:30 PM",
        comment: "Delivery scheduled for May 20. Recipient notified via email.",
      },
      {
        status: "Awaiting transport",
        location: "Kampala Hub",
        timestamp: "2025-05-10 10:15 AM",
        comment: "Package awaiting next available transport to Entebbe.",
      },
      {
        status: "Transport delay",
        location: "Kampala Hub",
        timestamp: "2025-05-12 03:45 PM",
        comment: "Transport delayed due to vehicle maintenance. New schedule confirmed.",
      },
      {
        status: "In transit",
        location: "Kampala Hub",
        timestamp: "2025-05-17 09:45 AM",
        comment: "Package in transit to Entebbe. Express delivery maintained.",
      },
    ],
    comments: [],
  },
  {
    id: "pkg3",
    containerNumber: "MAEU3456789", // Container No
    truckNumber: "RES76543210", // Truck No
    blNumber: "BLNO876543210", // B/L
    type: "Heavy Freight",
    weight: "120.5",
    shippedDate: "2025-04-19",
    estimatedDelivery: "2025-05-25",
    currentLocation: "Mombasa Port",
    nextStop: "Nairobi Distribution",
    nextStopETA: "2025-05-22",
    finalDestination: "Nairobi",
    lastUpdated: "2025-05-16 11:20 AM",
    shippingAddress: {
      recipientName: "Acme Corporation",
      streetAddress: "789 Industrial Avenue",
      city: "Nairobi",
      state: "Nairobi County",
      postalCode: "00100",
      country: "Kenya",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Mombasa Port",
        timestamp: "2025-04-19 08:00 AM",
        comment: "Heavy freight received at port. Special handling equipment required. Weight verified.",
      },
      {
        status: "Documentation processing",
        location: "Mombasa Port",
        timestamp: "2025-04-20 10:30 AM",
        comment: "Freight documentation being processed. Import permits verified.",
      },
      {
        status: "Inspection scheduled",
        location: "Mombasa Port",
        timestamp: "2025-04-22 02:15 PM",
        comment: "Customs inspection scheduled for April 25. All documentation submitted.",
      },
      {
        status: "Inspection delayed",
        location: "Mombasa Port",
        timestamp: "2025-04-25 09:45 AM",
        comment: "Customs inspection delayed due to high volume. Rescheduled for April 28.",
      },
      {
        status: "Customs inspection",
        location: "Mombasa Customs",
        timestamp: "2025-04-28 11:30 AM",
        comment: "Customs inspection in progress. No issues identified so far.",
      },
      {
        status: "Customs clearance",
        location: "Mombasa Customs",
        timestamp: "2025-04-28 03:15 PM",
        comment: "Customs clearance complete. All duties and taxes paid. Ready for inland transport.",
      },
      {
        status: "Awaiting transport",
        location: "Mombasa Port",
        timestamp: "2025-04-29 08:45 AM",
        comment: "Freight awaiting specialized transport vehicle for inland journey.",
      },
      {
        status: "Transport scheduled",
        location: "Mombasa Port",
        timestamp: "2025-04-30 02:30 PM",
        comment: "Transport scheduled for May 5. Special permits for oversized load obtained.",
      },
      {
        status: "Loading",
        location: "Mombasa Port",
        timestamp: "2025-05-05 07:30 AM",
        comment: "Freight being loaded onto specialized transport vehicle. Safety protocols in effect.",
      },
      {
        status: "In transit",
        location: "Mombasa Port",
        timestamp: "2025-05-05 11:20 AM",
        comment: "Freight in transit to Nairobi. Escort vehicles in place. Estimated travel time: 3 days.",
      },
      {
        status: "Checkpoint passed",
        location: "Mtito Andei Checkpoint",
        timestamp: "2025-05-06 02:45 PM",
        comment: "Freight passed through checkpoint. All documentation verified.",
      },
      {
        status: "Overnight stop",
        location: "Voi Rest Station",
        timestamp: "2025-05-06 07:30 PM",
        comment: "Scheduled overnight stop. Security measures in place. Journey to resume at 6 AM.",
      },
      {
        status: "In transit",
        location: "Nairobi-Mombasa Highway",
        timestamp: "2025-05-07 06:15 AM",
        comment: "Journey resumed. Road conditions good. On schedule for arrival.",
      },
      {
        status: "Mechanical issue",
        location: "Athi River",
        timestamp: "2025-05-07 02:30 PM",
        comment: "Minor mechanical issue with transport vehicle. Technician dispatched.",
      },
      {
        status: "Repair completed",
        location: "Athi River",
        timestamp: "2025-05-08 09:45 AM",
        comment: "Repairs completed. Transport resuming journey to Nairobi.",
      },
      {
        status: "In transit",
        location: "Mombasa Port",
        timestamp: "2025-05-16 11:20 AM",
        comment: "Final leg of journey to Nairobi. ETA at destination: May 22.",
      },
    ],
    comments: [],
  },
  {
    id: "pkg4",
    containerNumber: "ZIMU8901234", // Container No
    truckNumber: "BKG12340987", // Truck No
    blNumber: "MBLNO765432109", // B/L
    type: "Fragile Package",
    weight: "1.3",
    shippedDate: "2025-05-10",
    estimatedDelivery: "2025-05-24",
    currentLocation: "Dar es Salaam Sorting Facility",
    nextStop: "Arusha Distribution",
    nextStopETA: "2025-05-21",
    finalDestination: "Arusha",
    lastUpdated: "2025-05-19 10:15 AM",
    shippingAddress: {
      recipientName: "Robert Johnson",
      streetAddress: "321 Safari Road",
      city: "Arusha",
      state: "Arusha Region",
      postalCode: "23000",
      country: "Tanzania",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Dar es Salaam Receiving Center",
        timestamp: "2025-05-10 09:30 AM",
        comment: "Fragile package received. Special handling instructions noted. Contents verified.",
      },
      {
        status: "Processing",
        location: "Dar es Salaam Processing Center",
        timestamp: "2025-05-10 02:45 PM",
        comment: "Package processed with fragile handling protocols. Additional padding added.",
      },
      {
        status: "Quality check",
        location: "Dar es Salaam Quality Control",
        timestamp: "2025-05-11 11:20 AM",
        comment: "Package passed quality check. Packaging reinforced for safe transport.",
      },
      {
        status: "In transit",
        location: "Dar es Salaam Dispatch",
        timestamp: "2025-05-12 08:45 AM",
        comment: "Package dispatched to sorting facility. Fragile handling maintained.",
      },
      {
        status: "Arrived at facility",
        location: "Dar es Salaam Sorting Facility",
        timestamp: "2025-05-12 10:30 AM",
        comment: "Package arrived at sorting facility. Awaiting sorting for Arusha route.",
      },
      {
        status: "Sorted",
        location: "Dar es Salaam Sorting Facility",
        timestamp: "2025-05-13 09:15 AM",
        comment: "Package sorted for Arusha route. Fragile handling maintained.",
      },
      {
        status: "Awaiting transport",
        location: "Dar es Salaam Sorting Facility",
        timestamp: "2025-05-14 02:30 PM",
        comment: "Package awaiting next available transport to Arusha.",
      },
      {
        status: "Transport scheduled",
        location: "Dar es Salaam Sorting Facility",
        timestamp: "2025-05-16 11:45 AM",
        comment: "Transport scheduled for May 20. Special handling instructions noted.",
      },
      {
        status: "Final processing",
        location: "Dar es Salaam Sorting Facility",
        timestamp: "2025-05-19 10:15 AM",
        comment: "Final processing before transport. Package integrity verified. Ready for dispatch.",
      },
    ],
    comments: [],
  },
  {
    id: "pkg5",
    containerNumber: "NYKU5678901", // Container No
    truckNumber: "TXM89012345", // Truck No
    blNumber: "TXM789012345", // B/L
    type: "Refrigerated Goods",
    weight: "15.7",
    shippedDate: "2025-04-25",
    estimatedDelivery: "2025-05-23",
    currentLocation: "Kigali Cold Storage",
    nextStop: "Gisenyi Distribution",
    nextStopETA: "2025-05-21",
    finalDestination: "Gisenyi",
    lastUpdated: "2025-05-18 04:45 PM",
    shippingAddress: {
      recipientName: "Fresh Foods Ltd",
      streetAddress: "567 Lakeside Drive",
      city: "Gisenyi",
      state: "Western Province",
      postalCode: "00250",
      country: "Rwanda",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Kigali Receiving Center",
        timestamp: "2025-04-25 08:30 AM",
        comment: "Refrigerated goods received. Temperature verified at 2°C. Contents sealed and intact.",
      },
      {
        status: "Temperature check",
        location: "Kigali Quality Control",
        timestamp: "2025-04-25 10:15 AM",
        comment: "Temperature check performed. Maintaining required 2-4°C range. Packaging intact.",
      },
      {
        status: "Processing",
        location: "Kigali Processing Center",
        timestamp: "2025-04-25 01:30 PM",
        comment: "Package processed with temperature-controlled handling. Priority routing applied.",
      },
      {
        status: "Transferred to cold storage",
        location: "Kigali Cold Storage",
        timestamp: "2025-04-25 03:45 PM",
        comment: "Package transferred to cold storage facility. Temperature maintained at 3°C.",
      },
      {
        status: "Customs documentation",
        location: "Kigali Cold Storage",
        timestamp: "2025-04-26 09:20 AM",
        comment: "Customs documentation prepared. Health certificates verified and attached.",
      },
      {
        status: "Customs inspection",
        location: "Kigali Customs",
        timestamp: "2025-04-28 11:30 AM",
        comment: "Customs inspection completed. Temperature integrity maintained during inspection.",
      },
      {
        status: "Returned to cold storage",
        location: "Kigali Cold Storage",
        timestamp: "2025-04-28 02:15 PM",
        comment: "Package returned to cold storage after customs clearance. Temperature verified.",
      },
      {
        status: "Transport scheduling",
        location: "Kigali Cold Storage",
        timestamp: "2025-04-30 10:45 AM",
        comment: "Refrigerated transport being scheduled. Temperature requirements communicated.",
      },
      {
        status: "Quality check",
        location: "Kigali Cold Storage",
        timestamp: "2025-05-02 09:30 AM",
        comment: "Regular quality check performed. Temperature stable at 2.5°C. No issues detected.",
      },
      {
        status: "Transport delay",
        location: "Kigali Cold Storage",
        timestamp: "2025-05-05 03:15 PM",
        comment: "Refrigerated transport delayed due to vehicle maintenance. New schedule pending.",
      },
      {
        status: "Transport rescheduled",
        location: "Kigali Cold Storage",
        timestamp: "2025-05-08 11:20 AM",
        comment: "Transport rescheduled for May 20. Temperature monitoring continuous.",
      },
      {
        status: "Quality check",
        location: "Kigali Cold Storage",
        timestamp: "2025-05-12 10:30 AM",
        comment: "Weekly quality check performed. Temperature stable at 3°C. Packaging intact.",
      },
      {
        status: "Pre-transport preparation",
        location: "Kigali Cold Storage",
        timestamp: "2025-05-15 02:45 PM",
        comment: "Package being prepared for transport. Additional cooling packs added.",
      },
      {
        status: "Final quality check",
        location: "Kigali Cold Storage",
        timestamp: "2025-05-18 04:45 PM",
        comment: "Final quality check before transport. Temperature at 2.8°C. Ready for dispatch to Gisenyi.",
      },
    ],
    comments: [],
  },
  {
    id: "pkg6",
    containerNumber: "EMSU6789012", // Container No
    truckNumber: "BOK65432109", // Truck No
    blNumber: "HBLNO654321098", // B/L
    type: "Medical Supplies",
    weight: "8.4",
    shippedDate: "2025-05-05",
    estimatedDelivery: "2025-05-21",
    currentLocation: "Nairobi Medical Logistics Center",
    nextStop: "Kisumu Hospital Hub",
    nextStopETA: "2025-05-20",
    finalDestination: "Kisumu",
    lastUpdated: "2025-05-19 08:15 AM",
    shippingAddress: {
      recipientName: "Kisumu General Hospital",
      streetAddress: "789 Lakeview Avenue",
      city: "Kisumu",
      state: "Nyanza",
      postalCode: "40100",
      country: "Kenya",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Nairobi Medical Warehouse",
        timestamp: "2025-05-05 08:45 AM",
        comment: "Medical supplies received. Priority handling applied. Temperature-sensitive items noted.",
      },
      {
        status: "Verification",
        location: "Nairobi Medical Warehouse",
        timestamp: "2025-05-05 11:30 AM",
        comment: "Contents verified against medical supply manifest. All items present and intact.",
      },
      {
        status: "Special handling",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-05 02:15 PM",
        comment: "Package transferred to medical logistics center. Special handling protocols applied.",
      },
      {
        status: "Quality control",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-06 09:20 AM",
        comment: "Medical supply quality control check completed. All items passed inspection.",
      },
      {
        status: "Documentation processing",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-06 01:45 PM",
        comment: "Medical supply documentation processed. Regulatory compliance verified.",
      },
      {
        status: "Awaiting clearance",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-07 10:30 AM",
        comment: "Package awaiting medical supply clearance from regulatory authority.",
      },
      {
        status: "Clearance received",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-09 03:15 PM",
        comment: "Medical supply clearance received. Package approved for transport to Kisumu.",
      },
      {
        status: "Transport scheduling",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-10 11:45 AM",
        comment: "Transport being scheduled. Priority routing for medical supplies.",
      },
      {
        status: "Packaging reinforced",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-12 09:30 AM",
        comment: "Package reinforced for transport. Additional protection for fragile medical items.",
      },
      {
        status: "Transport scheduled",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-14 02:20 PM",
        comment: "Transport scheduled for May 19. Hospital notified of incoming delivery.",
      },
      {
        status: "Final verification",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-18 10:15 AM",
        comment: "Final verification of medical supplies before transport. All items secure.",
      },
      {
        status: "Prepared for dispatch",
        location: "Nairobi Medical Logistics Center",
        timestamp: "2025-05-19 08:15 AM",
        comment: "Package prepared for dispatch to Kisumu. Priority medical shipment labeled.",
      },
    ],
    comments: [],
  },
  {
    id: "pkg7",
    containerNumber: "OOLU9012345", // Container No
    truckNumber: "RES54321098", // Truck No
    blNumber: "BLNO543210987", // B/L
    type: "Electronics",
    weight: "4.6",
    shippedDate: "2025-04-28",
    estimatedDelivery: "2025-05-23",
    currentLocation: "Addis Ababa Customs",
    nextStop: "Addis Ababa Distribution Center",
    nextStopETA: "2025-05-21",
    finalDestination: "Addis Ababa",
    lastUpdated: "2025-05-17 01:30 PM",
    shippingAddress: {
      recipientName: "Tech Solutions Ethiopia",
      streetAddress: "456 Bole Road",
      city: "Addis Ababa",
      state: "Addis Ababa",
      postalCode: "1000",
      country: "Ethiopia",
    },
    trackingHistory: [
      {
        status: "Package received",
        location: "Nairobi International Airport",
        timestamp: "2025-04-28 10:45 AM",
        comment: "Electronics package received for international shipping. Value declaration verified.",
      },
      {
        status: "Processing",
        location: "Nairobi International Airport",
        timestamp: "2025-04-28 02:30 PM",
        comment: "Package processed for international shipping. Export documentation prepared.",
      },
      {
        status: "Export customs",
        location: "Nairobi Customs",
        timestamp: "2025-04-29 09:15 AM",
        comment: "Export customs processing. Electronics declaration verified.",
      },
      {
        status: "Cleared for export",
        location: "Nairobi Customs",
        timestamp: "2025-04-29 03:45 PM",
        comment: "Package cleared for export. All documentation approved.",
      },
      {
        status: "Awaiting flight",
        location: "Nairobi International Airport",
        timestamp: "2025-04-30 11:20 AM",
        comment: "Package awaiting scheduled flight to Addis Ababa.",
      },
      {
        status: "Flight delayed",
        location: "Nairobi International Airport",
        timestamp: "2025-05-01 08:30 AM",
        comment: "Flight delayed due to weather conditions. New departure pending.",
      },
      {
        status: "Departed",
        location: "Nairobi International Airport",
        timestamp: "2025-05-02 10:15 AM",
        comment: "Package departed on flight ET507 to Addis Ababa.",
      },
      {
        status: "Arrived",
        location: "Addis Ababa Bole International Airport",
        timestamp: "2025-05-02 12:45 PM",
        comment: "Package arrived at Addis Ababa. Awaiting import processing.",
      },
      {
        status: "Import processing",
        location: "Addis Ababa Bole International Airport",
        timestamp: "2025-05-03 09:30 AM",
        comment: "Import processing initiated. Documentation submitted to customs.",
      },
      {
        status: "Customs hold",
        location: "Addis Ababa Customs",
        timestamp: "2025-05-05 02:15 PM",
        comment: "Package held for additional customs inspection of electronics.",
      },
      {
        status: "Documentation requested",
        location: "Addis Ababa Customs",
        timestamp: "2025-05-07 11:30 AM",
        comment: "Additional documentation requested for electronics import. Contacting sender.",
      },
      {
        status: "Documentation received",
        location: "Addis Ababa Customs",
        timestamp: "2025-05-10 09:45 AM",
        comment: "Additional documentation received. Customs review in progress.",
      },
      {
        status: "Inspection scheduled",
        location: "Addis Ababa Customs",
        timestamp: "2025-05-12 03:30 PM",
        comment: "Physical inspection of electronics scheduled for May 15.",
      },
      {
        status: "Inspection completed",
        location: "Addis Ababa Customs",
        timestamp: "2025-05-15 10:20 AM",
        comment: "Customs inspection completed. Electronics verified against declaration.",
      },
      {
        status: "Duties assessment",
        location: "Addis Ababa Customs",
        timestamp: "2025-05-17 01:30 PM",
        comment: "Import duties being assessed. Payment notification to be sent to recipient.",
      },
    ],
    comments: [],
  },
]