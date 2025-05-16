<template>
  <p :class="['text-sm text-muted-foreground', className]">
    <slot></slot>
  </p>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: ''
  }
});
</script>
