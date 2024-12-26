<template>
    <div class="app-header-container">
        <div class="head-picture">
            <v-avatar @click="login">
                <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
            </v-avatar>
        </div>
        <div class="head-title">
 RV CLUB
        </div>
        <div class="head-list">
            <v-icon
            color="white"
            icon="mdi-email"
            size="large"
            ></v-icon>
        </div>
        
    </div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
// const route = useRoute()
 
const login = () => {
    router.push({
    path: '/login',
  })
}
  

//
</script>

<style scoped>
.app-header-container {
    height: 50px;
    width: 100%;
    display: flex;
    margin-bottom: 4px;
}

.head-picture {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

}

.head-title {
    width: calc(100% - 120px);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.head-list {
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
