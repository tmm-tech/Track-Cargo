<template>
  <transition name="alert-fade">
    <div v-if="show" :class="['alert-container', type]" role="alert">
      <div class="alert-content">
        <div class="alert-icon">
          <CheckCircleIcon v-if="type === 'success'" class="h-5 w-5" />
          <ExclamationCircleIcon v-else-if="type === 'error'" class="h-5 w-5" />
          <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5" />
          <ExclamationTriangleIcon v-else-if="type === 'warning'" class="h-5 w-5" />
        </div>
        <div class="alert-message">{{ message }}</div>
        <button @click="handleClose" class="alert-close" aria-label="Close">
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000 // 3 seconds
  },
  show: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

let timer = null;

const handleClose = () => {
  emit('close');
};

watch(() => props.show, (newValue) => {
  if (newValue && props.autoClose) {
    startAutoCloseTimer();
  } else {
    clearTimeout(timer);
  }
});

const startAutoCloseTimer = () => {
  clearTimeout(timer);
  if (props.duration > 0) {
    timer = setTimeout(() => {
      handleClose();
    }, props.duration);
  }
};

onMounted(() => {
  if (props.show && props.autoClose) {
    startAutoCloseTimer();
  }
});
</script>

<style scoped>
.alert-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  min-width: 300px;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
}

.alert-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.alert-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-message {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.alert-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-left: 8px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert types */
.success {
  background-color: #ecfdf5;
  border-left: 4px solid #10b981;
  color: #065f46;
}

.success .alert-icon {
  color: #10b981;
}

.error {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.error .alert-icon {
  color: #ef4444;
}

.warning {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
  color: #92400e;
}

.warning .alert-icon {
  color: #f59e0b;
}

.info {
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  color: #1e40af;
}

.info .alert-icon {
  color: #3b82f6;
}

/* Animation */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 640px) {
  .alert-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>