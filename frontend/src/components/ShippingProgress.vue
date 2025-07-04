<template>
  <Card>
    <CardHeader class="bg-[#273272] text-white rounded-t-lg">
      <CardTitle>Shipping Progress</CardTitle>
    </CardHeader>
    <CardContent class="pt-6">
      <div class="space-y-6">
        <!-- Current Status -->
        <div class="flex items-center gap-4 p-3 bg-[#273272]/5 rounded-md">
          <div class="bg-[#273272] p-2 rounded-full">
            <MapPin class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Current Location</p>
            <p class="font-medium">{{ current_location }}</p>
          </div>
          <Badge class="ml-auto bg-[#273272] text-white">Current</Badge>
        </div>

        <!-- Next Stop -->
        <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
          <div class="bg-gray-200 p-2 rounded-full">
            <Clock class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Next Stop</p>
            <p class="font-medium">{{ next_stop }}</p>
            <p class="text-xs text-gray-500">ETA: {{ formatDate(next_stop_eta) }}</p>
          </div>
          <Badge class="ml-auto bg-yellow-100 text-yellow-700 border border-yellow-300">Pending</Badge>
        </div>

        <!-- Final Destination -->
        <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
          <div class="bg-gray-200 p-2 rounded-full">
            <CheckCircle class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Final Destination</p>
            <p class="font-medium">{{ final_destination }}</p>
            <p class="text-xs text-gray-500">ETA: {{ formatDate(estimated_delivery) }}</p>
          </div>
          <Badge class="ml-auto bg-yellow-100 text-yellow-700 border border-yellow-300">Pending</Badge>
        </div>

        <!-- Tracking History Timeline -->
 <div class="mt-8">
    <h3 class="font-semibold text-lg text-[#273272] mb-4">Tracking History</h3>

    <div v-if="tracking_history.length > 0" class="space-y-6">
      <div
        v-for="(event, index) in tracking_history as TrackingEvent[]"
        :key="index"
        class="flex gap-4"
      >
        <!-- Timeline Dot and Line -->
        <div class="relative flex flex-col items-center">
          <div :class="`w-4 h-4 rounded-full ${index === 0 ? 'bg-[#ffb600]' : 'bg-gray-300'}`"></div>
          <div
            v-if="index < tracking_history.length - 1"
            class="w-0.5 h-full bg-gray-200 absolute top-4"
          ></div>
        </div>

        <!-- Tracking Info -->
        <div class="flex-1 pb-6">
          <p class="font-medium text-[#273272]">{{ event.status }}</p>
          <p class="text-sm text-gray-500">{{ event.location }}</p>
          <p class="text-sm text-gray-500">{{ formatDate(event.timestamp) }}</p>
          <p v-if="event.comment?.text" class="text-sm text-gray-400 mt-1">
            {{ event.comment.text }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500">No tracking events available.</div>
  </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { MapPin, Clock, CheckCircle } from 'lucide-vue-next';
import Card from './ui/Card.vue';
import CardHeader from './ui/CardHeader.vue';
import CardTitle from './ui/CardTitle.vue';
import CardContent from './ui/CardContent.vue';
import Badge from './ui/Badge.vue';
import type { TrackingEvent } from '../types';



const props = defineProps({
  tracking_history: {
    type: Array,
    default: () => []
  },
  current_location: {
    type: String,
    required: true
  },
  next_stop: {
    type: String,
    required: true
  },
  next_stop_eta: {
    type: String,
    required: true
  },
  final_destination: {
    type: String,
    required: true
  },
  estimated_delivery: {
    type: String,
    required: true
  }
});

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
</script>
