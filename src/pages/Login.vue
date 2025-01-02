<script setup>

import { onMounted, ref, getCurrentInstance } from 'vue';

import { createToast } from "mosha-vue-toastify";
import { goLogin } from '@/api/mapApi.js'
import { useRouter } from 'vue-router';
import { setToken } from '@/utils/auth'
const router = useRouter()

const username = ref('')

const password = ref('')

const handleLogin = async () => {

  if (username.value == '' || password.value == '') {

    createToast('用户名或密码不能为空！', { position: 'top-center', showIcon: true })

  } else {

    try {

      const res = await goLogin({ username: username.value, password: password.value })

      if (res.code !== 200) {

        createToast(res.msg, { position: 'top-center', showIcon: true, timeout: 2000 })

      } else {
        createToast(res.msg, { position: 'top-center', showIcon: true, timeout: 2000 })
        const token = res.data.token
        setToken(token)
        router.push({
          path: '/',
        })
      }

    } catch (e) {

      createToast('An error occurred. Please try again or contact the administrator.', { position: 'top-center', showIcon: true, timeout: 2000 })

    }

  }

}

let instance = null;

onMounted(() => {

  instance = getCurrentInstance()

})

const register = () => {
  router.push({
    path: '/register',
  })
}

const reset = () => {
  instance.ctx.$refs.form.reset()
}

const goBack = () => {
  router.push({
    path: '/',
  })
}

</script>

<template>
   <v-app-bar app>
      <v-btn @click="goBack">Back to Home</v-btn>
    </v-app-bar>
  <v-container class="h-100 d-flex align-center justify-center" style="margin-top: -50px;">
   

    <v-card width="500">
      <!-- <v-card-title >Login</v-card-title> -->

      <v-card-text class="pa-8">
        <v-form ref="form">
          <v-text-field variant="underlined" v-model="username" required :counter="20" label="Username"
            prepend-icon="mdi-account"></v-text-field>

          <v-text-field variant="underlined" v-model="password" required :counter="20" label="Password"
            prepend-icon="mdi-lock" type="password"></v-text-field>

          <v-row class="mt-5">
            <v-btn class="ml-5" @click="handleLogin">login</v-btn>

            <v-btn class="ml-5" @click="register">Go register</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
  <LoadingCom />
</template>

<style scoped></style>