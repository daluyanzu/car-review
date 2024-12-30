<template>
  <div class="text-center">
    <div style="height: 40px;width: 40px;"  @click="clickFun">
        <img style="height: 100%;width: 100%;" :src="props.buttonKey.icon" alt="">
        
    </div>
    <span style="height:10px;fontSize:12px">{{ props.buttonKey.title }}</span>
  </div>
</template>
<script setup>

import { ref, defineProps } from 'vue';

import { useStore } from "vuex";

const store = useStore()
const props = defineProps({
  buttonKey: Object,
  parentKey:String
})

const emit = defineEmits(['buttonEmit']);

const clickFun = async () => {
    emit('buttonEmit', props.buttonKey.value, props.parentKey)

}

</script>

<style scoped>
.text-center {

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}
</style>