<template>
    <div style="position: sticky;top: 0; width: 100%;display: flex;justify-content: space-around;border-bottom: 1px solid  #d3d3d3;">
        <div class="app-header-container">
        <div class="head-picture">
          <v-img class="icon-img" src="../assets/icon1.png"></v-img>
        </div>
        <div class="head-title">
            <!-- <img src="../assets/icon1.png" height="20" width="20" alt=""> -->
            <div style="color:#7b38f2">AI Caravan</div> 
            <!-- <div class="slogan">Discover the Best for Your Trip</div>  -->
        </div>
        <div class="head-list" @click="login" >
            <v-btn class="header-login" v-if="!isLoggedIn" color="#3F51B5">
  Log in
</v-btn>
            <!-- <v-icon
            color="white"
            icon="mdi-email"
            size="large"
            ></v-icon> -->
        </div>
        
    </div>
    </div>
    

</template>

<script setup>
import { useRouter, } from 'vue-router';
import { onMounted, ref } from "vue";
const router = useRouter()
// const route = useRoute()
 
const isLoggedIn = ref(false);

const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

const login = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
  }
};

onMounted(() => {
  checkLoginStatus();
});
  

//
</script>

<style scoped>
.app-header-container {
    height: 6vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fffefb;
  
}

.head-picture {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

}
.icon-img {
  height: 30px;
  width: 30px;
}
/* @font-face {
  font-family: 'Pacifico-1';
  src: url('@/assets/fonts/Pacifico-1.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
} */
 .slogan {
  font-size: 12px;
  color: #5c5c5c;
 }
.head-title {
    width: calc(100% - 120px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Pacifico-1' !important;
    color: #333333;
}

.head-list {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.header-login {
  height: 34px;
}
</style>
