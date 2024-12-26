<script  setup>
 
import {onMounted, ref, getCurrentInstance} from 'vue';
 
import {createToast} from "mosha-vue-toastify";
 
 
 
const username = ref('')
 
const password = ref('')
 
const handleLogin = async () => {
 
  if (username.value == '' || password.value == '') {
 
    createToast('用户名或密码不能为空！', {position: 'top-center', showIcon: true})
 
  } else {
 
    try {
 
      const res = await login({username: username.value, password: password.value})
 
      createToast(res.data.msg, {position: 'top-center', showIcon: true})
 
    } catch (e) {
 
      alert(e)
 
    }
 
  }
 
}
 
let instance = null;
 
onMounted(() => {
 
  instance = getCurrentInstance()
 
})
 
const reset = () => {
 
  instance.ctx.$refs.form.reset()
 
}
 
</script>
 
<template>
  <v-container class="h-100  d-flex align-center justify-center">
 
    <v-card width="500">
 
      <v-card-title>用户登录</v-card-title>
 
      <v-card-text class="pa-8">
 
        <v-form ref="form">
 
          <v-text-field variant="underlined" v-model="username" required
 
                        :counter="20"
 
                        label="账号"
 
                        prepend-icon="mdi-account"
 
          ></v-text-field>
 
          <v-text-field variant="underlined" v-model="password" required
 
                        :counter="20"
 
                        label="密码"
 
                        prepend-icon="mdi-lock"
 
                        type="password"
 
          ></v-text-field>
 
          <v-row class="mt-5">
 
            <v-btn class="ml-5" @click="handleLogin">提交</v-btn>
 
            <v-btn class="ml-5" @click="reset">复位</v-btn>
 
          </v-row>
 
        </v-form>
 
      </v-card-text>
 
    </v-card>
 
  </v-container>
 
</template>
 
<style scoped>
 
</style>