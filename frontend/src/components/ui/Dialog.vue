<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="closeOnBackdrop">
        <Transition name="scale">
          <div
            v-if="modelValue"
            class="relative bg-background rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-auto"
            @click.stop
          >
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const closeOnBackdrop = (event: MouseEvent) => {
  if (props.closeOnOutsideClick) {
    emit('update:modelValue', false);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
}
</style>
