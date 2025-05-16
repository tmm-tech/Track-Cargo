<template>
  <label :class="['text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className]">
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script>
