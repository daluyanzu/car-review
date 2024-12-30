<template>
    <div style="width: 100%;display: flex;justify-content: space-around;">
        <div class="app-header-container">
        <div class="head-picture">
            <v-avatar @click="login">
                <v-img alt="John" src="../assets/icon1.png"></v-img>
            </v-avatar>
        </div>
        <div class="head-title">
            <!-- <img src="../assets/icon1.png" height="20" width="20" alt=""> -->
            Caravan Review
        </div>
        <div class="head-list" @click="login"  style="color: #7c2af1;">
            <span v-if="!isLoggedIn">SIGN IN</span>
            
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
    height: 50px;

    width: 96%;
    display: flex;
    margin-bottom: 4px;
    justify-content: center;
    align-items: center;
  
}

.head-picture {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

}
/* @font-face {
  font-family: 'Pacifico-1';
  src: url('@/assets/fonts/Pacifico-1.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
} */
.head-title {
    width: calc(100% - 120px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Pacifico-1' !important;
}

.head-list {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
