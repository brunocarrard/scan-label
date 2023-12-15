<template>
    <div class="w-full grid grid-cols-12">
        <div class="bg-grey text-white col-span-4 sm:h-tablet lg:h-screen  flex flex-col justify-between">
            <div class="pl-4 pt-4">
                <i v-html="backArrow" class="cursor-pointer" @click="$router.push('/')"></i>
                <h1 class="font-bold text-xl pl-10">{{ data.ordNr }}</h1>
                <div >
                    <div v-for="part in data.parts" class="pl-12">
                        <label class="font-bold">{{ part.PartCode }}:</label>
                        <label class="pl-2"> <label :class="{completed: part.ScanQty === part.Qty, 'over-qty': part.ScanQty > part.Qty}">{{ part.ScanQty }}</label> / <b>{{ part.Qty }}</b></label>
                    </div>
                </div>
            </div>
            <button v-if="ready" class="bg-white text-black p-4 w-1/2 self-center mb-4 rounded">Confirm</button>
            <ScanLabel v-if="scaning" @scanned="(scan) => scanned(scan)" @closeModal="scaning = false"/>
        </div>
        <div class="col-span-8 bg-lightGrey flex flex-col gap-6">
            <button class="bg-white rounded text-black p-2 w-10/12 self-center mt-4" @click="() => {this.scaning = true}">
                Scan Label
            </button>
            
            <LabelTable :scans="scannedList" @removeItem="(index) => removeItem(index)"/>
        </div>
    </div>
</template>

<script>
    import {backArrow} from '../assets/index.js'
    import LabelTable from './LabelTable.vue';
    import ScanLabel from './ScanLabel.vue';
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
                scannedList: [],
                backArrow,
                ready: false
            }
        },
        methods: {
            scanned(scan) {
                if (this.data.parts.some(part => part.PartCode === scan.partCode )) {
                    this.scannedList.push(scan)
                    this.calculateQty()
                    this.scaning = false
                } else {
                    alert('Scanned PartCode does not exists on Sales Order')
                }
                
            },
            calculateQty() {
                this.data.parts.forEach(item => {
                    item.ScanQty = 0
                })
                this.scannedList.forEach(item => {
                    this.data.parts.forEach(mapItem => {
                        if ( mapItem.PartCode === item.partCode ) {
                            mapItem.ScanQty += parseInt(item.qty)
                        }
                    })
                })
                let ready = true
                this.data.parts.forEach(part => {
                    if (part.ScanQty != part.Qty) ready = false
                })
                console.log(ready)
                this.ready = ready
            },
            removeItem(index) {
                this.scannedList.splice(index, 1);
                this.calculateQty();
            },
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
</style>