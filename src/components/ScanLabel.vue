<template>
    <div class="flex flex-col items-center justify-center">
        <div class="w-96 flex flex-col items-center justify-center gap-2">
            <!-- <button @click="startScan">Scan QR Code</button> -->

            <!-- <i v-html="closeIcon" class="absolute top-0 left-0 pl-4 pt-6 cursor-pointer" @click="$emit('closeModal')"></i> -->
            <!-- <label class="w-1/2 font-bold">Scan Label:</label> -->
            <div class="flex flex-col gap-1">
                <div id="reader" style="width: 200px;" class="hidden sm:block"></div>
                <input class=" text-black text-center mt-2 mb-2 sm:mt-0" placeholder="Scan will appear here"
                    v-model="label">
                <button class="bg-white rounded py-1 text-black mb-2" @click="interpreteScan()"
                    v-if="label != ''">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script>
import { Html5QrcodeScanner } from "html5-qrcode";
import { closeIcon } from '../assets/index.js';
export default {
    data() {
        return {
            label: '',
            closeIcon,
        }
    },
    mounted() {
        const html5QrCode = new Html5QrcodeScanner(
            "reader", { fps: 5, qrbox: 350, aspectRatio: 1, focusMode: "continuous" }
        );
        html5QrCode.render(
            (decodedText, decodedResult) => {
                // do something with the decoded text
                this.label = decodedText;
                console.log('sacneado')
            },
        );
    },
    methods: {
        interpreteScan() {
            switch (this.label) {
                case '':
                    alert('Must scan first')
                    break
                default:
                    let partCodeIndex = this.label.indexOf('1P');
                    let qtyIndex = this.label.indexOf('Q');
                    let dunsIndex = this.label.indexOf('12V');
                    let lotNrIndex = this.label.indexOf('1T');

                    let rawPartCode = this.label.substring(partCodeIndex + 2, qtyIndex - 1)
                    let rawQty = this.label.substring(qtyIndex + 1, dunsIndex - 1)
                    let rawDuns = this.label.substring(dunsIndex + 3, lotNrIndex - 1)
                    let rawLotNr = this.label.substring(lotNrIndex + 2).slice(0, -2)

                    let scan = {
                        partCode: '',
                        qty: '',
                        duns: '',
                        lotNr: ''
                    }

                    if (rawPartCode != '?') scan.partCode = rawPartCode
                    if (rawQty != '?') scan.qty = rawQty
                    if (rawDuns != '?') scan.duns = rawDuns
                    if (rawLotNr != '?') scan.lotNr = rawLotNr

                    this.$emit('scanned', scan)
                    this.label = ''
            }
        }
    }
}
</script>