<template>
  <button
    :class="[
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50'
    ]"
    @click="setActiveTab(value)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  }
});

const activeTab = inject('activeTab', ref(''));
const setActiveTab = inject('setActiveTab', (value: string) => {});

const isActive = computed(() => activeTab.value === props.value);
</script>
