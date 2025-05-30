<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-4 right-4 z-50 flex items-start space-x-4 p-4 rounded-lg shadow-lg transition-all duration-300',
      type === 'success'
        ? 'bg-green-100 border border-green-300 text-green-800'
        : 'bg-red-100 border border-red-300 text-red-800'
    ]"
  >
    <component :is="icon" class="w-5 h-5 mt-1" />
    <div class="flex-1 text-sm font-medium">
      {{ message }}
    </div>
    <button @click="hideAlert" class="ml-4 text-sm hover:underline">
      Close
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { CheckCircle, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success', // 'success' or 'error'
  },
  duration: {
    type: Number,
    default: 3000,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const visible = ref(false);
const icon = computed(() => (props.type === 'success' ? CheckCircle : AlertTriangle));

watch(
  () => props.show,
  (val) => {
    if (val) {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  },
);

function hideAlert() {
  visible.value = false;
}
</script>