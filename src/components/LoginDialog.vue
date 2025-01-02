<template>
    <div class="pa-4 text-center" style="zIndex:999;">
        <v-dialog v-model="props.modelValue" width="auto" scrollable>
            <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-account">
                    <v-card-text class="px-4" >
                        Member Only!
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn text="Close" @click="closeDialog"></v-btn>

                        <v-spacer></v-spacer>

                        <v-btn color="surface-variant" text="Login/Signup" variant="flat" @click="GoLogin"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter()

const modelValue = true
const props = defineProps({
    modelValue: Object,
})

const emit = defineEmits(['onUpdate']);
const closeDialog = () => {
    emit('onUpdate', false);
}

const GoLogin = () => {
    closeDialog()
    router.push({
        path: '/login',
    })
}

</script>

<style scoped>
/* .text-center {
    position: fixed;
    left: 50%;
    bottom: 10vh;
    transform: translateX(-50%);
} */
</style>