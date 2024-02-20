<template>
    <div class="grid grid-cols-12 w-full max-h-screen scroll-auto">
        <div class="col-span-12 bg-lightGrey flex flex-col">
            <div class="sm:pl-4 sm:pt-4 text-xs sm:text-base">
                <i v-html="backArrow" class="cursor-pointer" @click="$router.push('/')"></i>
                <h1 class="font-bold text-white text-xl sm:pl-10 pl-2">{{ data.ordNr }}</h1>
            </div>
            <!-- <button class="bg-white rounded text-black p-2 w-10/12 self-center mt-4" @click="() => {this.scaning = true}" :disabled="loading">
                Scan Label
            </button> -->
            <ScanLabel @scanned="(scan) => scanned(scan)" @closeModal="scaning = false" />
            <!-- <LabelTable :scans="scannedList" @removeItem="(index) => removeItem(index)" /> -->
        </div>
        <div class="bg-grey col-span-12 flex flex-col">
            <div class="flex flex-col gap-5">
                <div>
                    <div v-for="part in data.parts" class="gap-2">
                        <label class="font-bold text-white pl-4">{{ part.PartCode }}:</label>
                        <label class="pl-2 text-white"> <label
                                :class="{ completed: part.ScanQty == part.Qty, 'over-qty': part.ScanQty > part.Qty, incompleted: part.ScanQty < part.Qty }">{{
                                    part.ScanQty ? part.ScanQty : 0 }}</label> / <b>{{ part.Qty }}</b></label>
                        <LabelTable :scans="scannedList[part.PartCode]"
                            @removeItem="(index) => removeItem(index, part.PartCode)" />
                    </div>

                </div>
                <label class="text-white"><b>Total Scanned Boxes:</b> {{ totalScan }}</label>
            </div>

            <button v-if="ready && totalScan > 0" :disabled="loading" @click="confirm"
                class="bg-white text-black p-4 w-1/2 self-center rounded font-bold my-4">
                <label v-if="!loading" class="cursor-pointer">Import Scans</label>
                <label v-if="loading" class="animate-pulse">Importing...</label>
            </button>

        </div>

    </div>
</template>

<script>
import { backArrow } from '../assets/index.js'
import LabelTable from './LabelTable.vue';
import ScanLabel from './ScanLabel.vue';
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
import axios from "axios";
export default {
    props: {
        data: {}
    },
    components: {
        LabelTable,
        ScanLabel
    },
    data() {
        return {
            scaning: false,
            scannedList: {},
            backArrow,
            ready: false,
            loading: false,
            totalScan: 0
        }
    },
    beforeMount() {
        this.data.parts.forEach(part => {
            this.scannedList[part.PartCode] = []
        })
    },
    methods: {
        scanned(scan) {
            if (this.data.parts.some(part => part.PartCode === scan.partCode)) {
                this.scannedList[scan.partCode].push(scan)
                this.calculateQty()
                this.scaning = false
            } else {
                toastify('error', 'Scanned PartCode does not exists on Sales Order')
            }

        },
        calculateQty() {
            this.totalScan = 0
            this.data.parts.forEach(item => {
                item.ScanQty = 0
            })
            this.data.parts.forEach(part => {
                this.scannedList[part.PartCode].forEach(scan => {
                    part.ScanQty += parseInt(scan.qty)
                    this.totalScan += parseInt(scan.qty)
                })

            })
            let ready = true
            this.data.parts.forEach(part => {
                if (part.ScanQty > part.Qty) ready = false
            })
            console.log(ready)
            this.ready = ready
        },
        removeItem(index, partCode) {
            this.scannedList[partCode].splice(index, 1);
            this.calculateQty();
        },
        async confirm() {
            this.loading = true
            let payload = {
                ordNr: this.data.ordNr,
                delLines: []
            }
            this.data.parts.forEach(part => {
                this.scannedList[part.PartCode].forEach(scan => {
                    payload.delLines.push(scan)
                })
            })
            try {
                const response = await axios.post('https://192.168.0.154:4020/', payload);
                toastify('success', response.data)
                this.$router.push('/')
            } catch (error) {
                console.error(error)
                toastify('error', error.response.data)
            } finally {
                this.loading = false
            }
        }
    },
    watch: {
        data() {
            if (this.data.parts.length === 0) this.$router.push('/')
        }
    }
}
</script>

<style>
.over-qty {
    @apply text-red-500;
    @apply font-bold;
}

.completed {
    @apply text-green-500;
    @apply font-bold;
}

.incompleted {
    @apply text-yellow-600;
    @apply font-bold
}
</style>