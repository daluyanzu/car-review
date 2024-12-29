<template>
    <div class="head-title">
      Consult Us
        </div>
  <div class="container">
    <form class="container-from">

      <v-text-field
        v-model="state.name"
        :counter="10"
        :error-messages="v$.name.$errors.map(e => e.$message)"
        label="Please leave your name"
        required
        @blur="v$.name.$touch"
        @input="v$.name.$touch"
      ></v-text-field>

      <v-select
        v-model="state.select"
        :error-messages="v$.select.$errors.map(e => e.$message)"
        :items="items"
        label="How you would like us to contact you"
        required
        @blur="v$.select.$touch"
        @change="v$.select.$touch"
      ></v-select>

      <v-text-field
        v-if="state.select === 'Phone'"
        v-model="state.phone"
        :error-messages="v$.phone.$errors.map(e => e.$message)"
        label="Phone"
        required
        @blur="v$.phone.$touch"
        @input="v$.phone.$touch"
      ></v-text-field>

      <v-text-field
        v-if="state.select === 'Email'"
        v-model="state.email"
        :error-messages="v$.email.$errors.map(e => e.$message)"
        label="E-mail"
        required
        @blur="v$.email.$touch"
        @input="v$.email.$touch"
      ></v-text-field>
      <div>Is this your first time buying an RV?</div>
      <!-- <v-checkbox
        v-model="state.checkbox"
        :error-messages="v$.checkbox.$errors.map(e => e.$message)"
        label="Y"
        required
        @blur="v$.checkbox.$touch"
        @change="v$.checkbox.$touch"
      ></v-checkbox>
      -->
    <v-radio-group v-model="state.radios" inline>
     
      <v-radio value="Google">
        <template v-slot:label>
          <strong >Y</strong>
        </template>
      </v-radio>
      <v-radio value="Duckduckgo">
        <template v-slot:label>
          <strong >N</strong>
        </template>
      </v-radio>
    </v-radio-group>
  
      <v-btn :disabled="loading"
      :loading="loading" class="me-4" @click="submit">
        submit
      </v-btn>
      <v-btn @click="back">
        back
      </v-btn>
    </form>

  </div>
  <v-snackbar
      v-model="snackbar"
      timeout="1500"
      color="deep-purple-accent-4"
    >
    SUCCESS!
    </v-snackbar>
    <v-snackbar
      v-model="errorMsgFlag"
      timeout="1500"
      color="red"
    >
    ERROR!-{{errorMsg}}

    
    </v-snackbar>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { email, required, helpers } from '@vuelidate/validators';
import { findUs } from '../api/mapApi.js'
import { useRouter } from 'vue-router';
const router = useRouter()

const atLeastOneContact = helpers.withMessage(
  'Either phone or email must be provided',
  (value, vm) => !!vm.phone || !!vm.email
);
const initialState = {
  name: '',
  email: '',
  phone: '',
  select: null,
  radios: null,
};

const state = reactive({
  ...initialState,
});

const items = ['Phone', 'Email'];

const rules = {
  name: { required },
  email: {  email, atLeastOneContact },
  phone: { atLeastOneContact },
  select: { required },
  radios: { required }
};

const v$ = useVuelidate(rules, state);

const loading = ref(false);
const submit = async () => {
  v$.value.$touch();
  const valid = await v$.value.$validate();
  if (!valid) {
    errorMsgFlag.value = true
    errorMsg.value = 'Form is invalid'
    return;
  }

  const data = {
    name: state.name,
    contactType: state.select,
    contactNumber: state.select === 'Phone' ? state.phone : state.email,
    firstPurchase: state.radios === 'Yes' ? 'Y' : 'N',
    content: state.select === 'Phone' ? state.phone : state.email,
  };

  const response = await findUs(data);
  if(response.code == 200) {
    snackbar.value = true;
    router.push({
          path: '/'
      })
  } else {
    errorMsg.value = response.msg
  }
  

};
const snackbar = ref(false)
const errorMsgFlag = ref(false)
const errorMsg = ref('error')
const back = () => {
  router.push({
          path: '/'
      })
}
function clear() {
  v$.value.$reset();

  for (const [key, value] of Object.entries(initialState)) {
    state[key] = value;
  }
}
</script>

<style scoped>
.container {
  padding: 10px;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -70px;
}
.container-from {
  width: 90vw;
}
.head-title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
}

</style>