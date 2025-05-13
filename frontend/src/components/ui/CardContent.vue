<template>
  <div :class="['p-6 pt-0', className]">
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
