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
            <p class="font-medium">{{ currentLocation }}</p>
          </div>
          <Badge class="ml-auto bg-[#273272]">Current</Badge>
        </div>

        <!-- Next Stop -->
        <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
          <div class="bg-gray-200 p-2 rounded-full">
            <Clock class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Next Stop</p>
            <p class="font-medium">{{ nextStop }}</p>
            <p class="text-xs text-gray-500">ETA: {{ nextStopETA }}</p>
          </div>
          <Badge class="ml-auto bg-gray-500">Pending</Badge>
        </div>

        <!-- Final Destination -->
        <div class="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
          <div class="bg-gray-200 p-2 rounded-full">
            <CheckCircle class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="text-sm text-gray-500">Final Destination</p>
            <p class="font-medium">{{ finalDestination }}</p>
            <p class="text-xs text-gray-500">ETA: {{ estimatedDelivery }}</p>
          </div>
          <Badge class="ml-auto bg-gray-500">Pending</Badge>
        </div>

        <!-- Tracking History Timeline -->
        <div class="mt-8">
          <h3 class="font-medium text-lg mb-4">Tracking History</h3>
          <div class="space-y-6">
            <div v-for="(event, index) in trackingHistory" :key="index" class="flex gap-4">
              <div class="relative flex flex-col items-center">
                <div :class="`w-4 h-4 rounded-full ${index === 0 ? 'bg-[#ffb600]' : 'bg-gray-300'}`"></div>
                <div v-if="index < trackingHistory.length - 1" class="w-0.5 h-full bg-gray-200 absolute top-4"></div>
              </div>
              <div class="flex-1 pb-6">
                <p class="font-medium text-[#273272]">{{ event.status }}</p>
                <p class="text-sm text-gray-500">{{ event.location }}</p>
                <p class="text-sm text-gray-500">{{ event.timestamp }}</p>
                <p v-if="event.notes" class="text-sm text-gray-400 mt-1">{{ event.notes }}</p>
              </div>
            </div>
          </div>
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

defineProps({
  trackingHistory: {
    type: Array as () => TrackingEvent[],
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  },
  nextStop: {
    type: String,
    required: true
  },
  nextStopETA: {
    type: String,
    required: true
  },
  finalDestination: {
    type: String,
    required: true
  },
  estimatedDelivery: {
    type: String,
    required: true
  }
});
</script>
