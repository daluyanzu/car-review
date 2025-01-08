<template>
    <v-sheet class="mx-auto" style="padding: 20px 10px;" width="100%">

        <v-form ref="form">
            <div class="select-container">
                <div class="select-title">Type Selection</div>
                <v-select v-model="typeItem" :items="typeItems" :rules="[v => !!v]" label="Type"
                    required variant="outlined" style="height: 50px;"></v-select>
            </div>

            <div class="select-container">
                <div class="select-title">Brand Selection</div>
                <v-text-field label="Brand" v-model="brandItem"  variant="outlined"></v-text-field>
                <!-- <v-select v-model="brandItem" :items="brandItems" :rules="[v => !!v ]" label="Brand"
                    required variant="outlined"></v-select> -->
            </div>

            <div class="select-container price-container">
                <v-text-field label="Min Price" v-model="minP" variant="outlined"></v-text-field>
                <div class="divider"><div>-</div></div>
                <v-text-field label="Max Price" v-model="maxP"  variant="outlined"></v-text-field>

            </div>



            <v-divider></v-divider>
            <v-btn class="mt-4" color="error" block @click="search">
                    Search
                </v-btn>

            <!-- <div class="d-flex flex-column">
            

                
            </div> -->
        </v-form>
    </v-sheet>
</template>
<script>
import { searchCar} from '../api/mapApi.js';
export default {
    data: () => ({
        name: '',
  
        typeItem: null,
        brandItem: null,

        typeItems: [
            'Camper trailer',
            'hybird',
            'hard top',

        ],
        brandItems: [
           'Camper trailer',
            'hybird',
            'hard top', 
        ],
        minP:null,
        maxP:null
    }),

    methods: {
        async validate() {
            const { valid } = await this.$refs.form.validate()

            if (valid) alert('Form is valid')
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
        async search() {
            const data = {
                brand:this.brandItem,
                type:this.typeItem,
                priceMin:this.minP,
                priceMax:this.maxP
            }
     
            const res = await searchCar(data);

            this.$emit('searchCarEvent', res);
        }
    },
}
</script>

<style scoped>
.select-title {
    color: #8f9095;
    margin-bottom: 6px;
}

.select-container {
    margin-bottom: 10px;
}

.price-container {
    display: flex;
    justify-content: space-between;
}

.divider {
  width: 20px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>