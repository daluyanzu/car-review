<script setup>

import { onMounted, ref, getCurrentInstance } from 'vue';

import { createToast } from "mosha-vue-toastify";

import { goRegister } from '@/api/mapApi.js'
import { removeToken } from '@/utils/auth'

import { useRouter } from 'vue-router';
const router = useRouter()
const username = ref('')
const password = ref('')
const phoneNumber = ref('')
const otp = ref('')
const showOtpInput = ref(false)

const goLogin = async () => {
    router.push({
        path: '/login',
    })
}

let instance = null;

onMounted(() => {
    instance = getCurrentInstance()
})

const validatePhoneNumber = () => {
    const phoneRegex = /^\d{10}$/;
    if (phoneRegex.test(phoneNumber.value)) {
        showOtpInput.value = true;
        createToast('验证码已发送', { position: 'top-center', showIcon: true, timeout: 2000 })
    } else {
        createToast('请输入有效的10位手机号', { position: 'top-center', showIcon: true, timeout: 2000 })
        showOtpInput.value = false;
    }
}

const register = async () => {
    if (username.value == '' || password.value == '' || phoneNumber.value == '') {
        createToast('用户名、密码或手机号不能为空！', { position: 'top-center', showIcon: true, timeout: 2000 })
    } else {
        try {
            const res = await goRegister({ username: username.value, password: password.value, phone: phoneNumber.value })
            createToast(res.msg, { position: 'top-center', showIcon: true, timeout: 2000 })
            removeToken()
            goLogin()
        } catch (e) {
            createToast('An error occurred. Please try again or contact the administrator.', { position: 'top-center', showIcon: true, timeout: 2000 })
        }
    }
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
                    <v-row>
                        <v-text-field variant="underlined" v-model="phoneNumber" required :counter="10" label="Phone Number"
                            prepend-icon="mdi-phone" type="tel"></v-text-field>
                        <v-btn class="ml-2" @click="validatePhoneNumber">获取验证码</v-btn>
                    </v-row>
                    <v-row v-if="showOtpInput" class="mt-3">
                        <v-otp-input v-model="otp" length="6" placeholder="0" variant="underlined"></v-otp-input>
                    </v-row>
                    <v-row class="mt-5">
                        <v-btn class="ml-5" @click="goLogin" :disabled="otp.length !== 6">Go login</v-btn>
                        <v-btn class="ml-5" @click="register" :disabled="otp.length !== 6">register</v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style scoped></style>