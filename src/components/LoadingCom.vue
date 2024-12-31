<template>
     <v-overlay v-model="isLoading"></v-overlay>
    <v-progress-circular
    v-if="isLoading"
        color="primary"
        indeterminate
        :width="10"
        size="50"
        class="mx-auto container"
      ></v-progress-circular>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const isLoading = ref(false);
  
  const setLoading = (status) => {
    isLoading.value = status;
  };
  
  onMounted(() => {
    window.addEventListener('loading', (event) => setLoading(event.detail));
  });
  
  onUnmounted(() => {
    window.removeEventListener('loading', (event) => setLoading(event.detail));
  });
  </script>
  
  <style scoped>
  .container {
    width: 100px;
    height: 100px;
    z-index: 99;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  </style>