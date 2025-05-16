<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';

const props = defineProps({
  defaultValue: {
    type: String,
    default: ''
  }
});

const activeTab = ref(props.defaultValue);

provide('activeTab', activeTab);
provide('setActiveTab', (value: string) => {
  activeTab.value = value;
});
</script>
