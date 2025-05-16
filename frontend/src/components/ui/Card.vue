<template>
  <div :class="['rounded-lg border bg-card text-card-foreground shadow-sm', className]">
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
