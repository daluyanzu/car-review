<template>
    <div class="pa-4 text-center" >
     
          <v-dialog activator="parent" max-width="500"  v-model="props.aiDialog">
            <template v-slot:default="{  }">
              <v-card rounded="lg">
                <v-card-title class="d-flex justify-space-between align-center">
                  <div class="text-h5 text-medium-emphasis ps-2">
                    GOA
                  </div>
  
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    @click="closeDialog"
                  ></v-btn>
                </v-card-title>
  
                <v-divider class="mb-4"></v-divider>
  
                <v-card-text>
                  <div class="text-medium-emphasis mb-4">
                    You can ask our AI travel-related questions.
                  </div>
  
                  <div class="mb-2">Questions</div>
  
                  <v-textarea
                    :counter="300"
                    class="mb-2"
                    rows="2"
                    variant="outlined"
                    persistent-counter
                    v-model="question"
                  ></v-textarea>
  
                  <div class="text-overline mb-2">💎 Answer</div>
                  <v-progress-circular
                  v-if="answer === ''"
                    color="primary"
                    indeterminate
                    class="mx-auto"
                  ></v-progress-circular>
                  <div  v-if="answer !== ''" class="text-medium-emphasis mb-1">
                    {{  answer }}
                  </div>
                </v-card-text>
  
                <v-divider class="mt-2"></v-divider>
  
                <v-card-actions class="my-2 d-flex justify-end">
                  <v-btn
                    class="text-none"
                    rounded="xl"
                    text="Back"
                    @click="closeDialog"
                  ></v-btn>
                  <v-btn
                    class="text-none"
                    rounded="xl"
                    text="Send"
                    @click="sendQuestion"
                  ></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
    </div>
    <v-snackbar
      v-model="errorMsgFlag"
      timeout="1500"
      color="red"
    >
    Please ask questions first
    </v-snackbar>
  </template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import { ref } from 'vue';
import { getAnswer } from '../api/mapApi.js';
const answer = ref('Waiting for your question');
const question = ref('')
const sendQuestion = async () => {
    if(question.value) {
        answer.value = '';
        const res = await getAnswer({
            question: question.value,
        });

        if (res.code == 200) {
            answer.value = res.data.answer;
        } else {
            answer.value = res.msg;
        }
    }else {
        errorMsgFlag.value = true
    }
  
    
}
const errorMsgFlag = ref(false)
const props = defineProps({
    aiDialog: Object,
})

const emit = defineEmits(['onUpdate']);
const closeDialog = () => {
    emit('onUpdate', false);
}



</script>