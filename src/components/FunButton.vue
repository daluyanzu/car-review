<template>
  <div class="text-center">
    <div style="height: 40px;width: 40px;"  @click="clickFun">
        <img style="height: 100%;width: 100%;" :src="props.buttonKey.icon" alt="">
    </div>
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