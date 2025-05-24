<template>
  <div :style="bodyStyle">
    <!-- Header -->
    <div :style="headerStyle">
      <div :style="logoContainerStyle">
        <img src="https://www.texmonlogistics.co.ke/assets/images/texmon-logo.png" alt="Texmon Logistics Logo"
          :style="logoImageStyle" />
        <div :style="{ fontSize: '20px', fontWeight: 'bold' }">Texmon Logistics</div>
      </div>
      <div :style="{ fontSize: '18px' }">Package Tracking Details</div>
    </div>

    <!-- Package Information Section -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">📦</span>
        Package Information
      </div>
      <div :style="sectionContentStyle">
        <div :style="gridStyle">
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Container Number</div>
            <div :style="fieldValueStyle">
              {{ pkg.containerNumber }}
              <span :style="badgeStyle">Active</span>
            </div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Truck Number</div>
            <div :style="fieldValueStyle">{{ pkg.truckNumber }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">BL Number</div>
            <div :style="fieldValueStyle">{{ pkg.blNumber }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Package Type</div>
            <div :style="fieldValueStyle">{{ pkg.type }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Weight</div>
            <div :style="fieldValueStyle">{{ pkg.weight }} kg</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Shipped Date</div>
            <div :style="fieldValueStyle">{{ pkg.shippedDate }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Estimated Delivery</div>
            <div :style="fieldValueStyle">{{ pkg.estimatedDelivery }}</div>
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
            <div :style="fieldValueStyle">{{ pkg.currentLocation }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Next Stop</div>
            <div :style="fieldValueStyle">{{ pkg.nextStop }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Next Stop ETA</div>
            <div :style="fieldValueStyle">{{ pkg.nextStopETA }}</div>
          </div>
          <div :style="fieldStyle">
            <div :style="fieldLabelStyle">Final Destination</div>
            <div :style="fieldValueStyle">{{ pkg.finalDestination }}</div>
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

    <!-- Shipping Address Section -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">📍</span>
        Shipping Address
      </div>
      <div :style="sectionContentStyle">
        <div v-if="pkg.shippingAddress" :style="shippingAddressStyle">
          <div :style="{ fontWeight: 'bold' }">{{ pkg.shippingAddress.recipientName }}</div>
          <div>{{ pkg.shippingAddress.streetAddress }}</div>
          <div>
            {{ pkg.shippingAddress.city }}, {{ pkg.shippingAddress.state }} {{ pkg.shippingAddress.postalCode }}
          </div>
          <div>{{ pkg.shippingAddress.country }}</div>
        </div>
        <div v-else>No shipping address information available</div>
      </div>
    </div>

    <!-- Tracking History Section -->
    <div :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">🔄</span>
        Tracking History
      </div>
      <div :style="sectionContentStyle">
        <div :style="trackingTimelineStyle">
          <div v-for="(event, index) in pkg.trackingHistory" :key="index" :style="trackingItemStyle">
            <div :style="trackingStatusStyle">{{ event.status }}</div>
            <div :style="trackingLocationStyle">
              <span :style="{ marginRight: '5px' }">📍</span>
              {{ event.location }}
            </div>
            <div :style="trackingTimeStyle">
              <span :style="{ marginRight: '5px' }">🕒</span>
              {{ event.timestamp }}
            </div>
            <div v-if="event.comment" :style="trackingCommentStyle">
              <strong>Comment:</strong> {{ event.comment }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div v-if="pkg.comment && pkg.comment.length > 0" :style="sectionStyle">
      <div :style="sectionHeaderStyle">
        <span :style="{ marginRight: '10px', fontSize: '20px' }">💬</span>
        Comments
      </div>
      <div :style="sectionContentStyle">
        <div v-for="(comment, index) in pkg.comment" :key="index" :style="commentStyle">
          <div :style="commentAuthorStyle">{{ comment.author }}</div>
          <div :style="commentTimeStyle">{{ comment.timestamp }}</div>
          <div :style="commentTextStyle">{{ comment.text }}</div>
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
import { ja } from 'date-fns/locale'
import { AlignCenter } from 'lucide-vue-next'
import { ref, computed, onMounted, watch } from 'vue'

// TypeScript interfaces
interface TrackingEvent {
  status: string
  location: string
  timestamp: string
  comment?: string
}

interface ShippingAddress {
  recipientName: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Comment {
  author: string
  timestamp: string
  text: string
}

interface Package {
  containerNumber: string
  truckNumber: string
  blNumber: string
  type: string
  weight: string
  shippedDate: string
  estimatedDelivery: string
  currentLocation: string
  nextStop: string
  nextStopETA: string
  finalDestination: string
  shippingAddress?: ShippingAddress
  trackingHistory: TrackingEvent[]
  comment?: Comment[]
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
  const currentIndex = props.pkg.trackingHistory.length > 0
    ? Math.min(props.pkg.trackingHistory.length - 1, statuses.length - 1)
    : 0
  return (currentIndex / (statuses.length - 1)) * 100
})

const isCompleted = (status: string): boolean => {
  const statuses = ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered']
  const statusIndex = statuses.indexOf(status)
  const currentIndex = props.pkg.trackingHistory.length > 0
    ? Math.min(props.pkg.trackingHistory.length - 1, statuses.length - 1)
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

// Lifecycle hooks
onMounted(async () => {
  const trackingUrl = `https://texmonlogistics.co.ke/track/${props.pkg.containerNumber}`
  qrCodeUrl.value = await generateQRCode(trackingUrl)
})

// Watch for package changes
watch(() => props.pkg.containerNumber, async (newContainerNumber) => {
  const trackingUrl = `https://texmonlogistics.co.ke/track/${newContainerNumber}`
  qrCodeUrl.value = await generateQRCode(trackingUrl)
})
</script>

<style scoped>
/* Additional styles if needed */
</style>