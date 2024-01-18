<template>
    <div class="w-1/2 h-96 bg-black md:mt-22 lg:mt-44 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <h1 class="text-white font-bold">Scan Sales Order:</h1>
                <div id="reader" class="text-white" style="width: 200px;"></div>
                <input class="w-full border rounded h-8 text-center" placeholder="Scan will appear here" v-model="ordNr" :disabled="loading">
            </div>
        </div>
        <button @click="requestSalesOrder" :disabled="loading" v-if="ordNr != ''"
            class="bg-white rounded w-48 text-grey font-bold h-8">
            <label v-if="!loading" class="cursor-pointer">Confirm</label>
            <label v-if="loading" class="animate-pulse">Searching...</label>
        </button>
    </div>
</template>

<script>
    import axios from "axios";
    import { Html5QrcodeScanner } from "html5-qrcode";
    export default {
        data() {
            return {
                ordNr: '',
                loading: false
            }
        },
        mounted() {
            const html5QrCode = new Html5QrcodeScanner(
                    "reader", { fps: 5, qrbox: 350, aspectRatio: 1, focusMode: "continuous" }
                );
                html5QrCode._fileInput = null
                html5QrCode.render(
                    (decodedText, decodedResult) => {
                    // do something with the decoded text
                    this.ordNr = decodedText;
                    console.log('sacneado')
                    },
                );
        },
        methods: {
            async requestSalesOrder() {
                if ( this.ordNr === '') alert('Must scan Order Nr.')
                else {
                    this.loading = true;
                    try {
                        const response = await axios.get('https://192.168.0.154:4000/', {
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

