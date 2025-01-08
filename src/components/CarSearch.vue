<template>
    <v-sheet class="mx-auto" style="padding: 20px 10px;" width="100%">

        <v-form ref="form">
            <div class="select-container">
                <div class="select-title">Type Selection</div>
                <v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item"
                    required variant="outlined" style="height: 50px;"></v-select>
            </div>

            <div class="select-container">
                <div class="select-title">Brand Selection</div>
                <v-select v-model="select" :items="items" :rules="[v => !!v || 'Item is required']" label="Item"
                    required variant="outlined"></v-select>
            </div>

            <div class="select-container price-container">
                <v-text-field label="Min Price"  variant="outlined"></v-text-field>
                <div class="divider"><div>-</div></div>
                <v-text-field label="Max Price"  variant="outlined"></v-text-field>

            </div>



            <v-divider></v-divider>
            <v-btn class="mt-4" color="error" block @click="reset">
                    Reset Form
                </v-btn>

            <!-- <div class="d-flex flex-column">
            

                
            </div> -->
        </v-form>
    </v-sheet>
</template>
<script>
export default {
    data: () => ({
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be 10 characters or less',
        ],
        select: null,
        items: [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4',
        ],
        checkbox: false,
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