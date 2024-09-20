<template>
    <div class="grid grid-cols-12 w-full max-h-screen scroll-auto lg:h-screen">
        <div class="col-span-12 bg-lightGrey flex flex-col">
            <div class="sm:pl-4 sm:pt-4 text-xs sm:text-base">
                <i v-html="backArrow" class="cursor-pointer" @click="$router.push('/')"></i>
                <h1 class="font-bold text-white text-xl sm:pl-10 pl-2">{{ data.ordNr }}</h1>
            </div>
            <ScanLabel @scanned="(scan) => scanned(scan)" />
        </div>
        <div class="bg-grey col-span-12 flex flex-col start-0">
            <div class="flex flex-col gap-5">
                <div>
                    <div v-for="part in data.parts" class="gap-2">
                        <label class="font-bold text-white pl-4" :class="{ 'pl-8': part.ParentPart }">{{ part.PartCode
                            }}:</label>
                        <label class="pl-2 text-white"> <label
                                :class="{ completed: part.ScanQty == part.Qty, 'over-qty': part.ScanQty > part.Qty, incompleted: part.ScanQty < part.Qty }">{{
                                    part.ScanQty ? part.ScanQty : 0 }}</label> / <b>{{ part.Qty }}</b></label>
                        <LabelTable
                            :scans="scannedList[part.PartCode].filter(scan => scan.ParentPart == part.ParentPart)"
                            @removeItem="(scan) => removeItem(scan, part.PartCode)"
                            @changeQty="(payload) => changeQty(payload.scan, payload.qty)" />
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
    <ParentModal v-if="parentDialog" :parents="choosingParents" :scan="choosingScan"
        @selected="(scan) => processScan(scan)" />
</template>

<script>
import { backArrow } from '../../assets/index.js'
import LabelTable from './LabelTable.vue';
import ScanLabel from '../ScanLabel.vue';
import ParentModal from './ParentModal.vue';
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
import { shippingStore } from "../../stores/shipping.js"
export default {
    components: {
        LabelTable,
        ScanLabel,
        ParentModal
    },
    data() {
        return {
            scannedList: {},
            backArrow,
            ready: false,
            loading: false,
            totalScan: 0,
            data: {},
            parentDialog: false,
            choosingScan: {},
            choosingParents: []
        }
    },
    beforeMount() {

        if (Object.keys(shippingStore()._orderData).length > 0) this.data = shippingStore()._orderData;
        else this.$router.push('/')
        this.data.parts.forEach(part => {
            this.scannedList[part.PartCode] = []
        })
        console.log(this.data)
    },
    methods: {
        scanned(scan) {
            if (this.data.parts.some(part => part.PartCode === scan.partCode)) {
                if (this.existsCertificate(scan)) {
                    // scan.SubPartInd = this.data.parts.find(part => part.PartCode === scan.partCode).SubPartInd ?? 0
                    // scan.SubPartInd = 0
                    this.data.parts.filter(part => part.PartCode === scan.partCode).map(part => part.SubPartInd).forEach(SubPartInd => {
                        if (SubPartInd) scan.MustChoose = SubPartInd
                    })
                    if (scan.MustChoose) {
                        if (this.data.parts.filter(part => part.PartCode === scan.partCode).length > 1) {
                            this.choosingScan = scan
                            this.data.parts.filter(part => part.PartCode === scan.partCode).forEach(choosePart => {
                                if (choosePart.PartCode == scan.PartCode) this.choosingParents.push(choosePart)
                                else this.choosingParents.push(choosePart.ParentPart)
                            })
                            this.parentDialog = true
                            return
                        } else scan.ParentPart = this.data.parts.find(part => part.PartCode === scan.partCode).ParentPart
                    }
                    if (this.data.parts.filter(part => part.PartCode === scan.partCode).length == 1 && this.data.parts.filter(part => part.PartCode === scan.partCode)[0].SubPartInd) scan.SubPartInd = 1
                    else scan.SubPartInd = 0
                    this.processScan(scan)

                }
            } else toastify('error', 'Scanned PartCode does not exists on Sales Order')

        },
        processScan(scan) {

            this.scannedList[scan.partCode].push(scan)
            this.calculateQty()
            this.parentDialog = false
            this.choosingParents = []
            this.choosingScan = {}
        },
        existsCertificate(scan) {
            let dataPart = this.data.parts.find(part => part.PartCode === scan.partCode)
            if (!dataPart.available_certificates || dataPart.available_certificates.length == 0) return true
            else {
                let availableCertificates = dataPart.available_certificates.find(certificate => certificate.code == scan.lotNr)
                if (!availableCertificates) {
                    toastify('error', `Scanned LotNr/Certificate "${scan.lotNr}" does not belong in this Part.`)
                    return false
                } else {
                    if ((isNaN(parseInt(availableCertificates.scannedQty)) ? 0 : parseInt(availableCertificates.scannedQty)) + parseInt(scan.qty) > parseInt(availableCertificates.qty)) {
                        toastify('error', `Scanned LotNr/Certificate "${scan.lotNr}" has already been fulfilled.`)
                        return false
                    } else {
                        if (availableCertificates.scannedQty) availableCertificates.scannedQty = parseInt(scan.qty) + availableCertificates.scannedQty
                        else availableCertificates.scannedQty = parseInt(scan.qty)
                        return true
                    }
                }
            }
        },
        calculateQty() {
            this.totalScan = 0
            this.data.parts.forEach(item => {
                item.ScanQty = 0
            })
            this.data.parts.forEach(part => {
                this.scannedList[part.PartCode].forEach(scan => {
                    if (scan.SubPartInd == 1) {
                        if (scan.ParentPart === part.ParentPart) {
                            part.ScanQty += parseInt(scan.qty)
                            this.totalScan += parseInt(scan.qty)
                        }
                    } else {
                        if (!part.ParentPart) {
                            part.ScanQty += parseInt(scan.qty)
                            this.totalScan += parseInt(scan.qty)
                        }
                    }
                })
            })
            let ready = true
            // let scanArray = []
            // Object.values(this.scannedList).forEach(scans => {
            //     scans.forEach(scan => {
            //         if (scan.SubPartInd == 1 && this.data.parts.find(part => part.PartCode == scan.ParentPart).ScanQty < scan.qty) scanArray.push(scan)
            //     })
            // })
            // if (scanArray.length > 0) ready = false

            this.data.parts.forEach(part => {
                if (part.ScanQty > part.Qty) ready = false
            })
            if (this.totalScan == 0) ready = false
            this.ready = ready
        },
        removeItem(scan, partCode) {
            if (this.scannedList[partCode].find(obj => obj == scan).lotNr != "") {
                let availableCertificates = this.data.parts.find(part => part.PartCode === partCode).available_certificates
                if (availableCertificates) {
                    let certificateObj = availableCertificates.find(certificate => certificate.code == this.scannedList[partCode].find(obj => obj == scan).lotNr)
                    if (certificateObj) certificateObj.scannedQty = certificateObj.scannedQty - this.scannedList[partCode].find(obj => obj == scan).qty
                }
            }
            this.scannedList[partCode] = this.scannedList[partCode].filter(obj => obj !== scan)
            this.calculateQty();
        },
        changeQty(scan, qty) {
            this.scannedList[scan.partCode].find(obj => obj == scan).qty = qty
            this.calculateQty();
        },
        async confirm() {
            this.loading = true
            let payload = {
                ordNr: this.data.ordNr,
                delLines: []
            }
            // this.data.parts.forEach(part => {
            //     this.scannedList[part.PartCode].forEach(scan => {
            //         payload.delLines.push(scan)
            //     })
            // })
            Object.values(this.scannedList).forEach(scans => {
                scans.forEach(scan => {
                    payload.delLines.push(scan)
                })
            })
            try {
                // console.log(payload)
                let response = await shippingStore().postScans(payload);
                toastify('success', response.data)
                this.$router.push('/')
            } catch (error) {
                if (error.response.status == '422') {
                    toastify('warning', 'Session has expired. Please login again.')
                    localStorage.clear();
                    this.$router.push('/login')
                } else if (error.response.status != '401') {
                    toastify('error', error.response.data)
                }
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