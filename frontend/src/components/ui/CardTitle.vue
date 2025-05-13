<template>
  <h3 :class="['text-2xl font-semibold leading-none tracking-tight', className]">
    <slot></slot>
  </h3>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script>
