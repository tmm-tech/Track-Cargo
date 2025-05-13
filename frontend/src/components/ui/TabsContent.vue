<template>
  <div v-if="isActive" class="mt-2">
    <slot></slot>
  </div>
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

const isActive = computed(() => activeTab.value === props.value);
</script>
