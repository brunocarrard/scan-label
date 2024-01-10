<template>
    <div class="w-1/2 h-96 bg-black md:mt-22 lg:mt-44 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div>
                <h1 class="text-white">Scan Sales Order:</h1>
                <input class="w-full border rounded h-8" placeholder="Click here" v-model="ordNr" :disabled="loading">
            </div>
        </div>
        <button @click="requestSalesOrder" :disabled="loading"
            class="bg-white rounded w-48 text-grey font-bold h-8">
            <label v-if="!loading" class="cursor-pointer">Confirm</label>
            <label v-if="loading" class="animate-pulse">Searching...</label>
        </button>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        data() {
            return {
                ordNr: '',
                loading: false
            }
        },
        methods: {
            async requestSalesOrder() {
                if ( this.ordNr === '') alert('Must scan Order Nr.')
                else {
                    this.loading = true;
                    try {
                        const response = await axios.get('http://localhost:5000/', {
                        params: {
                            value: this.ordNr,
                        }
                        });
                        console.log(response)
                        this.$emit('confirmed', response.data)
                    } catch (error) {
                        console.error(error)
                        alert(error.response.data.error);
                    } finally {
                        this.loading = false;
                    }
                }
            }
        }
    }
</script>

<style>
</style>

