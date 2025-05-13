<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App component is just a wrapper for router views
</script>


<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}
</style>