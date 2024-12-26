<template>
    <div class="find-us-container" @click="goFindUs">
        <img style="height:70%;width:70%;" src="data:image/svg+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyBjbGFzcz0iaWNvbiIgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMC4wMHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzUxNTE1MSIgZD0iTTgwMy45ODUgNDA1LjA3NmMtMC41MjcgOC4zNDItMS40NTYgMTcuMDM2LTIuNzM1IDI2LjE2OS0yMS43MjkgMTUwLjM4LTE0MC44NzcgMjU5LjQ4OS0yODMuNDYgMjU5LjQ4OWgtNDYuMzcxbC04LjUzMSA4Ljc2N2MzMi4wMTYgNTkuNTE2IDkxLjUzNCA5Ny45NjggMTU4LjQwNCA5Ny45NjhoNDYuMDhsOTEuMzQ4IDk1LjY3YzUuODk2IDUuODk1IDEzLjg3NSA5LjEyIDIyLjA4IDkuMTIgMy43ODkgMCA3LjY3Ny0wLjQyNyAxMS4zOTEtMi4wMDggMTEuNTA1LTQuNzQxIDE5LjEwOC0xNS44ODIgMTkuMTA4LTI4LjYwM3YtNzcuNzY3Yzg1LjAyMy0xNy40MDIgMTQ3Ljg3OC05Ny41NTQgMTQ3Ljg3OC0xOTQuMDAzIDAtOTguNDA0LTY3LjQyMS0xODAuMTM2LTE1NS4xOTItMTk0LjgwMnpNNTE3Ljc5IDEyMS43NEgzMDcuODg1QzE3My44MiAxMjEuNzQgNjQuODIgMjM5LjYxNSA2NC44MiAzODQuNDUyYzAgMTI5Ljc0NCA4NS44MDIgMjM2Ljg0MyAyMDAuODk2IDI1OC4yNzF2MTEwLjdjMCAxNC4yOSA4LjgyIDI3LjM3NSAyMi4yNyAzMi45N2EzOC4xMzggMzguMTM4IDAgMCAwIDEzLjI2IDIuMzg0YzkuNTEgMCAxOC44NjktMy41ODggMjUuNjk0LTEwLjcxNWwxMjUuNzM0LTEzMS4zMzhoNjUuMTE0YzEyMC40OSAwIDIyMS4zOTYtOTMuMjc0IDIzOS45NTEtMjIxLjgwMSAyLjEzMy0xNC43MjkgMy4xMTItMjguMTc3IDMuMTEyLTQwLjQ3MSAwLjAwMS0xNDQuODM3LTEwOC45OTgtMjYyLjcxMi0yNDMuMDYyLTI2Mi43MTJ6TTI0Mi4wMDYgNDEzLjc5NGMtMTkuNjcyIDAtMzUuNjE3LTE1Ljk0NS0zNS42MTctMzUuNjAzIDAtMTkuNjcgMTUuOTQ1LTM1LjYxNiAzNS42MTctMzUuNjE2czM1LjYwNiAxNS45NDYgMzUuNjA2IDM1LjYxNmMwIDE5LjY2LTE1LjkzNCAzNS42MDMtMzUuNjA2IDM1LjYwM3ogbTE4NC40NzQgMGMtMTkuNjczIDAtMzUuNjA1LTE1Ljk0NS0zNS42MDUtMzUuNjAzIDAtMTkuNjcgMTUuOTMyLTM1LjYxNiAzNS42MDUtMzUuNjE2IDE5LjY3MiAwIDM1LjYwNSAxNS45NDYgMzUuNjA1IDM1LjYxNiAwIDE5LjY2LTE1LjkzMyAzNS42MDMtMzUuNjA1IDM1LjYwM3ogbTE4NC40NzQgMGMtMTkuNjYgMC0zNS42MDQtMTUuOTQ1LTM1LjYwNC0zNS42MDMgMC0xOS42NyAxNS45NDUtMzUuNjE2IDM1LjYwNC0zNS42MTYgMTkuNjczIDAgMzUuNjE5IDE1Ljk0NiAzNS42MTkgMzUuNjE2IDAgMTkuNjYtMTUuOTQ2IDM1LjYwMy0zNS42MTkgMzUuNjAzeiIgLz48L3N2Zz4=" />
    </div>
    <v-expand-transition>
    <v-card
    class="mx-auto chat-container"
    elevation="1"
    width="90vw"
    theme="light"
    v-if="findInfo"
  >
    <v-card-title class="py-5 font-weight-black"></v-card-title>

    <v-card-text style="fontSize:20px">
        Welcome to consult about RV matters, we are at your service
    </v-card-text>
    
    <v-card-text>
      <div class="text-subtitle-2 font-weight-black mb-1">Is this your first time buying an RV?</div>

      <div>
        <v-radio-group
      v-model="isFirst"
      inline
    >
      <v-radio
        label="YES"
        value="true"
      ></v-radio>
      <v-radio
        label="NO"
        value="false"
      ></v-radio>
    </v-radio-group>
      </div>
      <div class="text-subtitle-2 font-weight-black mb-1">Please leave your name</div>

<v-text-field
  label="Enter value here"
  variant="outlined"
  single-line
  v-model='name'
></v-text-field>
      
      <v-container style="width:100%">
    <v-row>
      

      <v-col
        class="py-2"
        cols="12"
        style="padding:0px"
      >
      <div class="text-subtitle-2 font-weight-black mb-1">Select how you would like us to
        contact you</div>

        <v-btn-toggle
          v-model="util"
          color="deep-purple-accent-3"
          rounded="0"
          group
        >
          <v-btn value="phone">
            <i class="material-icons">phone</i> 
          </v-btn>

          <v-btn value="email">
            <i class="material-icons">email</i> 
          </v-btn>

          <v-btn value="SMS">
            <i class="material-icons">message</i> 
          </v-btn>

          <v-btn value="Other">
            <i class="material-icons">more</i> 
          </v-btn>
        </v-btn-toggle>
      </v-col>
     
        
    </v-row>
  </v-container>
  <div class="text-subtitle-2 font-weight-black mb-1">Please leave contact information</div>

<v-text-field
  label="Enter value here"
  variant="outlined"
  single-line
  v-model='contactInformation'
></v-text-field>
      <div class="text-subtitle-2 font-weight-black mb-1">Please leave your message</div>

<v-text-field
  label="Enter value here"
  variant="outlined"
  single-line
  v-model='contactMessage'
></v-text-field>

      <v-btn
        :disabled="loading"
        :loading="loading"
        class="text-none mb-4"
        color="indigo-darken-3"
        size="x-large"
        variant="flat"
        block
        @click="submit"
      >
        Verify and continue
      </v-btn>

      <v-btn
        class="text-none"
        color="grey-lighten-3"
        size="x-large"
        variant="flat"
        block
        @click="close"
      >
        Cancel
      </v-btn>
    </v-card-text>
  </v-card>
</v-expand-transition>
  
<v-fade-transition hide-on-leave>
      <v-card
        v-if="dialog"
        append-icon="$close"
        class="mx-auto chat-container"
        elevation="16"
         width="90vw"
        title="Send a message"
      >
        <template v-slot:append>
          <v-btn icon="$close" variant="text" @click="dialog = false"></v-btn>
        </template>

        <v-divider></v-divider>

        <div class="py-12 text-center">
          <v-icon
            class="mb-6"
            color="success"
            icon="mdi-check-circle-outline"
            size="128"
          ></v-icon>

          <div class="text-h4 font-weight-bold">This message was sent</div>
        </div>

        <v-divider></v-divider>

        <div class="pa-4 text-end">
          <v-btn
            class="text-none"
            color="medium-emphasis"
            min-width="92"
            variant="outlined"
            rounded
            @click="dialog = false"
          >
            Close
          </v-btn>
        </div>
      </v-card>
    </v-fade-transition>
   
</template>

<script setup>
import { findUs } from '../api/mapApi.js'
import { ref } from 'vue';
    const findInfo = ref(false)
    const goFindUs = () => {
        findInfo.value = true
    }
    const close = () => {
        findInfo.value = false
    }

    const isFirst = ref('')
    const util = ref('')
    const contactMessage = ref('')
    const contactInformation = ref('')
    const name = ref('')


    const loading = ref(false)
    const submit = async () => {
        loading.value = true
        const data = {
            name:name.value,
            contactType:util.value,
            contactNumber:contactInformation.value,
            firstPurchase:isFirst? 'Y':'N',
            content:contactInformation.value
        }
        // loading.value = true;
        const aa = await findUs(data)
        loading.value = false
        close()
        dialog.value = true
    }

    const dialog = ref(false)
  //
</script>

<style scoped>

.find-us-container {
    position: fixed;
    bottom: 20vh;
    right:20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: white;
}

.chat-container {
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
}

</style>
