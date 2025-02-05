<template>
    <div  :class="{'pc-container': isPc, 'app-container': !isPc}">
        <AppHeader />
        <app-container></app-container>
        <app-footer></app-footer>
        <FindUs />
        <LoadingCom />
    </div>
  

</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import { ref, onMounted } from 'vue';
const isPc = ref(false);
const checkIsPc = () => {
  const userAgent = navigator.userAgent;
  isPc.value = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

onMounted(() => {
  checkIsPc();
});
  //
</script>

<style scoped>
.app-container {
    height: 100%;
    width: 100vw;
}
.pc-container {
  max-width: 400px;
  margin: 0 auto;
  background-color: #f0f0f0;
  position: relative;
  height: 100%;
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
