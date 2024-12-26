<template>
    <div class="app-container-container">
        <!-- <div>
            <v-carousel :height="200" hide-delimiters>
                <v-carousel-item src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover></v-carousel-item>
                <v-carousel-item src="../assets/11.jpeg" cover></v-carousel-item>
                <v-carousel-item src="../assets/22.jpg" cover></v-carousel-item>
            </v-carousel>
        </div> -->
        <!-- <google-map/> -->
        <VideoCom></VideoCom>

        <!-- <v-infinite-scroll height="calc(100% - 200px)" > -->
            <AppMap />
            <!-- <template v-for="(item, index) in items" :key="item">
                <div :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
                    comments#{{ item }}
                </div>
            </template> -->
        <!-- </v-infinite-scroll> -->
    </div>

</template>


<script setup>
import { ref } from 'vue'

const items = ref(Array.from({ length: 30 }, (k, v) => v + 1))

async function api() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Array.from({ length: 10 }, (k, v) => v + items.value.at(-1) + 1))
        }, 1000)
    })
}
async function load({ done }) {
    // Perform API call
    // const res = await api()

    // items.value.push(...res)

    done('ok')
}
</script>

<style scoped>
.app-container-container {
    height: calc(100% - 100px);
    width: 100%;
    padding: 6px;
}

.picture-container {
    height: 60px;
    width: 100%;
}
</style>
