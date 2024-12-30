<template>
    <div class="app-container">
        <AppHeader />
        <app-container></app-container>
        <app-footer></app-footer>
        <FindUs />
        <LoadingCom />
    </div>
  

</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';

  //
</script>

<style scoped>
.app-container {
    height: 100vh;
    width: 100vw;
}
@font-face {
  font-family: 'Pacifico-1';
  src: url('@/assets/fonts/Pacifico-1.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

/* body {
  font-family: 'MyCustomFont', sans-serif;
} */
</style>
