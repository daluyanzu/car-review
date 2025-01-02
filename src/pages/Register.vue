<script setup>

import { onMounted, ref, getCurrentInstance } from 'vue';

import { createToast } from "mosha-vue-toastify";

import { goRegister, checkDuplicate, sendCode, getCaptcha } from '@/api/mapApi.js'
import { removeToken } from '@/utils/auth'

import { useRouter } from 'vue-router';
const router = useRouter()
const username = ref('')
const password = ref('')
const phoneNumber = ref('')
const otp = ref('')
const showOtpInput = ref(false)
const isOtpButtonDisabled = ref(false)

const goLogin = async () => {
    router.push({
        path: '/login',
    })
}

let instance = null;

onMounted(() => {
    instance = getCurrentInstance()
})

const captchaImageBase64 = ref('')
const captchaImage = ref(false)
const isSended = ref(true)
const getCaptchaFun = async () => {
    isOtpButtonDisabled.value = true;
    captchaImage.value = false
    const phoneRegex = /^\d{10}$/;
    isSended.value = false

    if (phoneRegex.test(phoneNumber.value)) {
        const temp = await checkDuplicate({
            field: 'phoneNumber',
            value: phoneNumber.value
        })
        if (temp.data.duplicate) {
            createToast('Phone number is already registered', { position: 'top-center', showIcon: true, timeout: 2000 })
            isOtpButtonDisabled.value = false;
            return;
        }
        const result = await getCaptcha({
            phoneNumber: phoneNumber.value
        })


        if (result.code !== 200) {
            createToast('An error occurred. Please try again or contact the administrator.', { position: 'top-center', showIcon: true, timeout: 2000 })
            isOtpButtonDisabled.value = false;
            return;
        } else {
            captchaImageBase64.value = result.data.image;
            captchaImage.value = true
            createToast('OTP sent', { position: 'top-center', showIcon: true, timeout: 2000 })
        }

    } else {
        createToast('Please enter a valid 10-digit phone number', { position: 'top-center', showIcon: true, timeout: 2000 })
        showOtpInput.value = false;
    }
    isOtpButtonDisabled.value = false;
}
const captcha = ref('')
const validatePhoneNumber = async () => {
    isOtpButtonDisabled.value = true;
    const phoneRegex = /^\d{10}$/;
    if (username.value) {
        const temp = await checkDuplicate({
            field: 'username',
            value: username.value
        })
        if (temp.data.duplicate) {
            createToast('Username is already registered', { position: 'top-center', showIcon: true, timeout: 2000 })
            isOtpButtonDisabled.value = false;
            return;
        }
    } else {
        createToast('Please enter a username first', { position: 'top-center', showIcon: true, timeout: 2000 })
        isOtpButtonDisabled.value = false;
        return;
    }


    if (phoneRegex.test(phoneNumber.value)) {
        const temp = await checkDuplicate({
            field: 'phoneNumber',
            value: phoneNumber.value
        })
        if (temp.data.duplicate) {
            createToast('Phone number is already registered', { position: 'top-center', showIcon: true, timeout: 2000 })
            isOtpButtonDisabled.value = false;
            return;
        }
        const result = await sendCode({
            phoneNumber: phoneNumber.value,
            code:captcha.value
        })

        if (result.code !== 200) {
            createToast(result.msg, { position: 'top-center', showIcon: true, timeout: 2000 })
            isOtpButtonDisabled.value = false;
            return;
        } else {
            showOtpInput.value = true;
            createToast('OTP sent', { position: 'top-center', showIcon: true, timeout: 2000 })
        }

    } else {
        createToast('Please enter a valid 10-digit phone number', { position: 'top-center', showIcon: true, timeout: 2000 })
        showOtpInput.value = false;
    }
    isOtpButtonDisabled.value = false;
}

const register = async () => {
    if (username.value == '' || password.value == '' || phoneNumber.value == '') {
        createToast('Username, password, or phone number cannot be empty!', { position: 'top-center', showIcon: true, timeout: 2000 })
    } else {
        try {
            const res = await goRegister({ username: username.value, password: password.value, phoneNumber: phoneNumber.value, code: otp.value })
            createToast(res.msg, { position: 'top-center', showIcon: true, timeout: 2000 })
            removeToken()
            if (res.code == 200) {
                goLogin()
            }

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
    <v-container class="h-100 d-flex align-center justify-center" style="margin-top: -120px;">
        <v-card width="500">
            <!-- <v-card-title >Login</v-card-title> -->
            <v-card-text class="pa-8">
                <v-form ref="form">
                    <v-text-field variant="underlined" v-model="username" required :counter="20" label="Username"
                        prepend-icon="mdi-account"></v-text-field>
                    <v-text-field variant="underlined" v-model="password" required :counter="20" label="Password"
                        prepend-icon="mdi-lock" type="password"></v-text-field>
                    <div> <v-text-field variant="underlined" v-model="phoneNumber" required :counter="10"
                            label="Phone Number" prepend-icon="mdi-phone" type="tel"></v-text-field>
                    </div>
                    <div style="display: flex; justify-content: flex-end;" v-if="isSended">
                        <div v-if="captchaImage">
                            <img :src="'data:image/png;base64,' + captchaImageBase64" alt="Captcha">

                        </div>
                        <v-btn class="ml-2" @click="getCaptchaFun" color="primary" >Get
                            Captcha</v-btn>
                    </div>
                    <div style="display: flex; justify-content: space-between;padding-left: 40px;" v-if="!isSended">
                        <div v-if="captchaImage">
                            <img :src="'data:image/png;base64,' + captchaImageBase64" alt="Captcha">

                        </div>
                        <v-btn class="ml-2" @click="getCaptchaFun" color="primary"
                            >AGAIN</v-btn>
                    </div>
                    <div v-if="captchaImage">

                        <v-text-field variant="underlined" v-model="captcha" required label="Enter Captcha"
                            prepend-icon="mdi-shield-check"></v-text-field>
                    </div>
                    <div v-if="captchaImage" style="display: flex; justify-content: flex-end;">
                        <v-btn class="ml-2" @click="validatePhoneNumber" color="primary"
                            >Get OPT</v-btn>
                    </div>
                    <div v-if="showOtpInput"><v-otp-input v-model="otp" length="6" placeholder="0"
                            variant="underlined"></v-otp-input></div>
                    <!-- <v-row v-if="showOtpInput" class="mt-3">
                        
                    </v-row> -->
                    <v-row class="mt-5">
                        <v-btn class="ml-5" @click="goLogin" color="primary">Go login</v-btn>
                        <v-btn class="ml-5" @click="register" color="primary"
                            :disabled="otp.length !== 6">Register</v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
    <LoadingCom />
</template>

<style scoped></style>