<template>
  <div :class="['flex flex-col space-y-1.5 p-6', className]">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script>
