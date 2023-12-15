<template>
    <div class="h-screen w-screen absolute flex flex-col items-center justify-center">
        <div class="w-96 h-96 bg-black flex flex-col items-center justify-center gap-4 border-2 border-red-500 rounded-xl relative"> 
            <i v-html="closeIcon" class="absolute top-0 left-0 pl-4 pt-6 cursor-pointer" @click="$emit('closeModal')"></i>
            <label class="w-1/2 font-bold">Scan Label:</label>
            <div class="flex flex-col gap-2 w-1/2">

                <input class=" text-black" placeholder="Click here before scanning" v-model="label">
                <button class="bg-white rounded py-1 text-black" @click="interpreteScan()">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script>
    import { closeIcon } from '../assets/index.js';
    export default {
        data() {
            return {
                label: '',
                closeIcon
            }
        },
        methods: {
            interpreteScan() {
                if (this.label === '') alert('Must scan first')
                else {
                    let partCodeIndex = this.label.indexOf('1P');
                    let qtyIndex = this.label.indexOf('Q');
                    let dunsIndex = this.label.indexOf('12V');
                    let lotNrIndex = this.label.indexOf('1T');
                    
                    let rawPartCode = this.label.substring(partCodeIndex + 2, qtyIndex - 1)
                    let rawQty = this.label.substring(qtyIndex + 1, dunsIndex - 1)
                    let rawDuns = this.label.substring(dunsIndex + 3, lotNrIndex - 1)
                    let rawLotNr = this.label.substring(lotNrIndex + 2).slice(0, -1)

                    let scan = {
                        partCode: '',
                        qty: '',
                        duns: '',
                        lotNr: ''
                    }

                    if ( rawPartCode != '?' ) scan.partCode = rawPartCode
                    if ( rawQty != '?' )    scan.qty = rawQty
                    if ( rawDuns != '?' ) scan.duns = rawDuns
                    if ( rawLotNr != '?' ) scan.lotNr = rawLotNr

                    this.$emit('scanned', scan)
                }
            }
        }
    }
</script>