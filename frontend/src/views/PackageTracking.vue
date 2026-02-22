<template>
  <div id="tracking-content" :style="bodyStyle">
    <!-- Header -->
    <div :style="headerStyle">
      <div :style="logoContainerStyle">
        <img
          src="data:image/png;base64,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"
          alt="Texmon Logistics Logo" :style="logoImageStyle" />
        <div :style="{ fontSize: '20px', fontWeight: 'bold' }">Texmon Logistics</div>
      </div>
      <div :style="{ fontSize: '18px' }">Cargo Tracking Details</div>
    </div>
    <!-- Shipping Address Section -->
    <div :style="sectionStyle">
      <!-- Header -->
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">📍</span>
        Client Details
      </div>

      <!-- Content -->
      <div :style="sectionContentStyle">
        <div v-if="pkg.shipping_address" :style="shippingAddressStyle">
          <!-- Recipient Name -->
          <div :style="{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }">
            {{ pkg.shipping_address.recipientName || 'N/A' }}
          </div>

          <!-- Street Address -->
          <div :style="{ marginBottom: '2px' }">
            {{ pkg.shipping_address.streetAddress || 'N/A' }}
          </div>

          <!-- City, State, Country -->
          <div :style="{ marginBottom: '2px' }">
            {{ pkg.shipping_address.city || 'N/A' }}, {{ pkg.shipping_address.state || 'N/A' }}
          </div>
          <div :style="{ marginBottom: '2px' }">
            {{ pkg.shipping_address.country || 'N/A' }}
          </div>

          <!-- Contact Info -->
          <div :style="{ marginTop: '6px', fontSize: '14px' }">
            <div><strong>Phone:</strong> {{ pkg.shipping_address.phone || 'N/A' }}</div>
            <div><strong>Email:</strong> {{ pkg.shipping_address.email || 'N/A' }}</div>
          </div>

          <!-- Special Instructions -->
          <div v-if="pkg.shipping_address.specialInstructions"
            :style="{ marginTop: '6px', fontStyle: 'italic', color: '#555' }">
            <strong>Instructions:</strong> {{ pkg.shipping_address.specialInstructions }}
          </div>
        </div>

        <!-- Fallback -->
        <div v-else style="color: #888;">No shipping address information available</div>
      </div>
    </div>

    <!-- Cargo Information Section -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">📦</span>
        Cargo Details
      </div>
      <div :style="sectionContentStyle">
        <div :style="gridStyle">
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Container Number</div>
            <div :style="fieldValueStyle">
              {{ pkg.container_number }}
              <span :style="badgeStyle">Active</span>
            </div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Truck Number</div>
            <div :style="fieldValueStyle">{{ pkg.truck_number }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">BL Number</div>
            <div :style="fieldValueStyle">{{ pkg.bl_number }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Cargo Type</div>
            <div :style="fieldValueStyle" class="uppercase">{{ pkg.type }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Cargo Description</div>
            <div :style="fieldValueStyle">{{ pkg.description }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Weight</div>
            <div :style="fieldValueStyle">{{ pkg.weight }} kg</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Shipped Date</div>
            <div :style="fieldValueStyle">{{ formatDate(pkg.shipped_date) }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Estimated Delivery</div>
            <div :style="fieldValueStyle">{{ formatDate(pkg.estimated_delivery) }}</div>
          </div>
        </div>

        <!-- QR Code Section -->
        <div :style="qrCodeStyle">
          <div :style="{ fontWeight: 'bold', marginBottom: '5px' }">Scan to Track</div>
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" :style="qrImageStyle" />
          <div v-else :style="{ ...qrImageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }">
            Loading QR...
          </div>
        </div>
      </div>
    </div>
    <!-- Cargo Clearance Section -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">📦</span>
        Cargo Clearance
      </div>
      <div :style="sectionContentStyle">
        <div :style="gridStyle">
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">File Reference</div>
            <div :style="fieldValueStyle">
              {{ pkg.clearance.fileReference }}
            </div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Container Number</div>
            <div :style="fieldValueStyle">{{ pkg.container_number }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Bill of Lading</div>
            <div :style="fieldValueStyle">{{ pkg.bl_number }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">ETA</div>
            <div :style="fieldValueStyle" class="uppercase">{{ formatDate(pkg.clearance.eta) }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Cargo Description</div>
            <div :style="fieldValueStyle">{{ pkg.clearance.cargoDescription }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Client Details</div>
            <div :style="fieldValueStyle">{{ pkg.shipping_address?.recipientName }} | {{ pkg.shipping_address?.email }}
            </div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Net Weight</div>
            <div :style="fieldValueStyle">{{ pkg.clearance.netWeight }} kg</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Gross Weight</div>
            <div :style="fieldValueStyle">{{ pkg.clearance.grossWeight }} kg</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Current Status Section -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">🚚</span>
        Current Status
      </div>
      <div :style="sectionContentStyle">
        <div :style="gridStyle">
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Current Location</div>
            <div :style="fieldValueStyle">{{ pkg.current_location }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Next Stop</div>
            <div :style="fieldValueStyle">{{ formatDate(pkg.next_stop) }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Next Stop ETA</div>
            <div :style="fieldValueStyle">{{ formatDate(pkg.next_stop_eta) }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Final Destination</div>
            <div :style="fieldValueStyle">{{ pkg.final_destination }}</div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div :style="progressContainerStyle">
          <div :style="{ fontWeight: 'bold', color: '#273272', marginBottom: '10px' }">
            Delivery Progress
          </div>
          <div :style="progressBarContainerStyle">
            <div :style="progressBarBgStyle"></div>
            <div :style="progressBarFillStyle"></div>

            <div :style="progressStepStyle">
              <div :style="getProgressCircleStyle(isCompleted('Shipped'))"></div>
              <div :style="progressStepTextStyle">Shipped</div>
            </div>

            <div :style="progressStepStyle">
              <div :style="getProgressCircleStyle(isCompleted('In Transit'))"></div>
              <div :style="progressStepTextStyle">In Transit</div>
            </div>

            <div :style="progressStepStyle">
              <div :style="getProgressCircleStyle(isCompleted('Out for Delivery'))"></div>
              <div :style="progressStepTextStyle">Out for Delivery</div>
            </div>

            <div :style="progressStepStyle">
              <div :style="getProgressCircleStyle(isCompleted('Delivered'))"></div>
              <div :style="progressStepTextStyle">Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Clearance Report Section (only clearance) -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">✅</span>
        Clearance Report
      </div>
      <div :style="sectionContentStyle">
        <div :style="trackingTimelineStyle">
          <div v-for="(event, index) in pkg.tracking_history.filter(e => e.status?.toLowerCase().includes('clearance'))" :key="index"
            :style="trackingItemStyle">
            <div :style="trackingStatusStyle" class="capitalize">{{ event.status }}</div>
            <div :style="trackingLocationStyle">
              <span :style="{ marginRight: '5px' }">📍</span>
              {{ event.location }}
            </div>
            <div :style="trackingTimeStyle">
              <span :style="{ marginRight: '5px' }">🕒</span>
              {{ formatDate(event.timestamp) }}
            </div>
            <div v-if="event.comment" :style="trackingCommentStyle">
              <strong>Comment:</strong> {{ event.comment.text }}
            </div>
          </div>
          <div v-if="pkg.tracking_history.filter(e => e.status?.toLowerCase().includes('clearance')).length === 0">
            No clearance events found.
          </div>
        </div>
      </div>
    </div>

    <!-- Tracking History Section (excluding clearance) -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">🔄</span>
        Tracking History
      </div>
      <div :style="sectionContentStyle">
        <div :style="trackingTimelineStyle">
          <div v-for="(event, index) in pkg.tracking_history.filter(e => !e.status?.toLowerCase().includes('clearance'))" :key="index"
            :style="trackingItemStyle">
            <div :style="trackingStatusStyle" class="capitalize">{{ event.status }}</div>
            <div :style="trackingLocationStyle">
              <span :style="{ marginRight: '5px' }">📍</span>
              {{ event.location }}
            </div>
            <div :style="trackingTimeStyle">
              <span :style="{ marginRight: '5px' }">🕒</span>
              {{ formatDate(event.timestamp) }}
            </div>
            <div v-if="event.comment" :style="trackingCommentStyle">
              <strong>Comment:</strong> {{ event.comment.text }}
            </div>
          </div>
          <div v-if="pkg.tracking_history.filter(e => e.status !== 'CLEARED').length === 0">
            No tracking events found.
          </div>
        </div>
      </div>
    </div>


    <!-- Footer -->
    <div :style="footerStyle">
      <p>Generated on {{ new Date().toLocaleString() }}</p>
      <p>Texmon Logistics Limited, Kenya</p>
      <p>Contact: +254 700 000000 | info@texmonlogistics.com</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlignCenter } from 'lucide-vue-next'
import { ref, computed, onMounted, watch } from 'vue'
import { Clearance } from '../types'

// TypeScript interfaces
interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  comment?: {
    text?: string
  }
}


interface ShippingAddress {
  recipientName: string
  streetAddress: string
  city: string
  state: string
  country: string
  phone: string
  email: string,
  specialInstructions: string
}

interface Package {
  clearance: Clearance
  container_number: string
  truck_number: string
  bl_number: string
  type: string
  weight: string
  shipped_date: string
  estimated_delivery: string
  current_location: string
  next_stop: string
  next_stop_eta: string
  final_destination: string
  shipping_address?: ShippingAddress,
  description: string,
  tracking_history: TrackingEvent[]
  comment?: {
    text?: string
  }
}


// Props
const props = defineProps<{
  pkg: Package
}>()

// Reactive data
const qrCodeUrl = ref<string>('')

// QR Code generation function
const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`
    return qrUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    return ''
  }
}

// Computed properties
const calculateProgress = computed((): number => {
  const statuses = ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered']
  const currentIndex = props.pkg.tracking_history.length > 0
    ? Math.min(props.pkg.tracking_history.length - 1, statuses.length - 1)
    : 0
  return (currentIndex / (statuses.length - 1)) * 100
})

const isCompleted = (status: string): boolean => {
  const statuses = ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered']
  const statusIndex = statuses.indexOf(status)
  const currentIndex = props.pkg.tracking_history.length > 0
    ? Math.min(props.pkg.tracking_history.length - 1, statuses.length - 1)
    : 0
  return statusIndex <= currentIndex
}

// Styles as computed properties
const bodyStyle = computed(() => ({
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  lineHeight: 1.6,
  color: '#333',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
}))

const headerStyle = computed(() => ({
  backgroundColor: '#273272',
  color: '#ffffff',
  padding: '20px',
  textAlign: 'center' as const,
  marginBottom: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column' as const,
}))

const logoContainerStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
}))

const logoImageStyle = computed(() => ({
  backgroundColor: 'white',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  marginRight: '15px',
  display: 'flex',
  AlignItems: 'center',
  justifyContent: 'center',
  objectFit: 'contain' as const,
  padding: '5px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}))

const sectionStyle = computed(() => ({
  marginBottom: '30px',
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}))

const sectionHeaderStyle = computed(() => ({
  background: 'linear-gradient(to right, #273272, #3a4999)',
  color: 'white',
  padding: '12px 15px',
  fontSize: '18px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
}))

const sectionContentStyle = computed(() => ({
  padding: '20px',
}))

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
}))

const fieldStyle = computed(() => ({
  marginBottom: '15px',
}))

const fieldLabelStyle = computed(() => ({
  fontWeight: 'bold',
  color: '#273272',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}))

const fieldValueStyle = computed(() => ({
  fontSize: '16px',
  padding: '5px 0',
  borderBottom: '1px solid #eee',
}))

const badgeStyle = computed(() => ({
  display: 'inline-block',
  padding: '3px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#273272',
  marginLeft: '8px',
}))

const qrCodeStyle = computed(() => ({
  textAlign: 'center' as const,
  margin: '20px 0',
}))

const qrImageStyle = computed(() => ({
  width: '100px',
  height: '100px',
  border: '1px solid #ddd',
  padding: '5px',
  backgroundColor: 'white',
  margin: '0 auto',
  display: 'block',
}))

const progressContainerStyle = computed(() => ({
  marginTop: '20px',
  backgroundColor: '#f0f7ff',
  padding: '15px',
  borderRadius: '8px',
  textAlign: 'center' as const,
}))

const progressBarContainerStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative' as const,
  padding: '0 20px',
}))

const progressBarBgStyle = computed(() => ({
  position: 'absolute' as const,
  top: '10px',
  left: 0,
  right: 0,
  height: '4px',
  backgroundColor: '#ddd',
  zIndex: 1,
}))

const progressBarFillStyle = computed(() => ({
  position: 'absolute' as const,
  top: '10px',
  left: 0,
  width: `${calculateProgress.value}%`,
  height: '4px',
  backgroundColor: '#273272',
  zIndex: 2,
}))

const progressStepStyle = computed(() => ({
  position: 'relative' as const,
  zIndex: 3,
  textAlign: 'center' as const,
}))

const getProgressCircleStyle = (completed: boolean) => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: completed ? '#273272' : '#ddd',
  margin: '0 auto',
})

const progressStepTextStyle = computed(() => ({
  fontSize: '12px',
  marginTop: '5px',
}))

const shippingAddressStyle = computed(() => ({
  padding: '10px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #eee',
}))

const trackingTimelineStyle = computed(() => ({
  position: 'relative' as const,
  paddingLeft: '30px',
}))

const trackingItemStyle = computed(() => ({
  position: 'relative' as const,
  padding: '15px',
  marginBottom: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  borderLeft: '3px solid #273272',
}))

const trackingStatusStyle = computed(() => ({
  fontWeight: 'bold',
  marginBottom: '5px',
  color: '#273272',
}))

const trackingLocationStyle = computed(() => ({
  color: '#555',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
}))

const trackingTimeStyle = computed(() => ({
  color: '#777',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  marginTop: '3px',
}))

const trackingCommentStyle = computed(() => ({
  marginTop: '8px',
  padding: '8px 10px',
  backgroundColor: '#fff3cd',
  borderLeft: '3px solid #ffb600',
  borderRadius: '4px',
  fontSize: '13px',
}))

const commentStyle = computed(() => ({
  backgroundColor: '#f0f7ff',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '15px',
  borderLeft: '3px solid #273272',
}))

const commentAuthorStyle = computed(() => ({
  fontWeight: 'bold',
  color: '#273272',
}))

const commentTimeStyle = computed(() => ({
  color: '#666',
  fontSize: '12px',
}))

const commentTextStyle = computed(() => ({
  marginTop: '8px',
  lineHeight: 1.5,
}))

const footerStyle = computed(() => ({
  textAlign: 'center' as const,
  marginTop: '30px',
  paddingTop: '20px',
  borderTop: '1px solid #eee',
  fontSize: '12px',
  color: '#666',
}))

// Format date utility
const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return null; // Handle null, undefined, or empty string

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Never'; // Handle invalid date

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
// Lifecycle hooks
onMounted(async () => {
  const trackingUrl = `https://texmonlogistics.co.ke/track/${props.pkg.container_number}`
  qrCodeUrl.value = await generateQRCode(trackingUrl)
})

// Watch for package changes
watch(() => props.pkg.container_number, async (newContainerNumber) => {
  const trackingUrl = `https://texmonlogistics.co.ke/track/${newContainerNumber}`
  qrCodeUrl.value = await generateQRCode(trackingUrl)
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
