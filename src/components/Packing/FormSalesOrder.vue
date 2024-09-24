<template>
    <div
        class="sm:w-1/2 h-auto bg-black px-4 sm:px-0 mt-44 py-4 sm:mt-10 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <!-- <h1 class="text-white font-bold">TEST APP</h1> -->
                <h1 class="text-white font-bold">Scan Sales Order:</h1>
                <div id="reader" class="text-white hidden sm:block" style="width: 200px;"></div>
                <input class="w-full border rounded h-8 text-center" placeholder="Scan order" v-model="ordNr"
                    :disabled="loading">
                <div class="border rounded flex flex-col gap-2 p-2">
                    <select id="options" v-model="ordNr" :disabled="availableOrders.length == 0" name="options"
                        class="w-full border rounded h-8 text-center">
                        <option value="">Or select one</option>
                        <option v-for="order in filteredOrders" :key="order.id" :value="order.id">{{ order.date }}/{{
                            order.id
                        }}/{{ order.custId }}
                        </option>
                    </select>
                    <select v-model="customerFiltered" :disabled="availableOrders.length == 0"
                        class="w-full border rounded h-8 text-center">
                        <option value="">Filter by Customer</option>
                        <option v-for="order in availableCustomers" :key="order.custId" :value="order.custId">{{
                            order.custId }}</option>
                    </select>
                    <input :disabled="availableOrders.length == 0" type="date" v-model="dateFiltered"
                        class="w-full border rounded h-8 text-center">
                </div>

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
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
import { Html5QrcodeScanner } from "html5-qrcode";
import { shippingStore } from "../../stores/shipping.js"
export default {
    data() {
        return {
            ordNr: '',
            loading: false,
            availableOrders: [],
            filteredOrders: [],
            availableCustomers: [],
            selectedOrder: { id: '' },
            customerFiltered: '',
            dateFiltered: ''
        }
    },
    watch: {
        customerFiltered(newVal, oldVal) {
            this.filteredOrders = []
            if (newVal == '' && this.dateFiltered == '') this.filteredOrders = this.availableOrders
            else if (newVal == '' && this.dateFiltered != '') {
                this.availableOrders.forEach(order => {
                    if (order.date == this.dateFiltered) {
                        this.filteredOrders.push(order)
                    }
                })
            }
            else {
                this.availableOrders.forEach(order => {
                    if (order.custId == newVal) {
                        if (this.dateFiltered == '') this.filteredOrders.push(order)
                        else if (order.date == this.dateFiltered) this.filteredOrders.push(order)
                    }
                })
            }
        },
        dateFiltered(newVal, oldVal) {
            this.filteredOrders = []
            if (newVal == '' && this.customerFiltered == '') this.filteredOrders = this.availableOrders
            else if (newVal == '' && this.customerFiltered != '') {
                this.availableOrders.forEach(order => {
                    if (order.custId == this.customerFiltered) {
                        this.filteredOrders.push(order)
                    }
                })
            }
            else {
                this.availableOrders.forEach(order => {
                    if (order.date == newVal) {
                        if (this.customerFiltered == '') this.filteredOrders.push(order)
                        else if (order.custId = this.customerFiltered) this.filteredOrders.push(order)
                    }
                })
            }

        }
    },
    async mounted() {
        const html5QrCode = new Html5QrcodeScanner(
            "reader", { fps: 5, qrbox: 350, aspectRatio: 1, focusMode: "continuous" }
        );
        html5QrCode._fileInput = null
        html5QrCode.render(
            (decodedText, decodedResult) => {
                // do something with the decoded text
                this.ordNr = decodedText;
            },
        );
        try {
            await shippingStore().getAvailableOrders()
        } catch (error) {
            if (error.response.status == '422') {
                toastify('warning', 'Session has expired. Please login again.')
                localStorage.clear();
                this.$router.push('/login');
            } else if (error.response.status != '401') {
                toastify('error', error.response.data.error)
            }
        }
        this.availableOrders = shippingStore()._availableOrders
        this.filteredOrders = shippingStore()._availableOrders
        let hasCustId
        shippingStore()._availableOrders.forEach(order => {
            hasCustId = false
            this.availableCustomers.forEach(customer => {
                if (customer.custId == order.custId) hasCustId = true
            })
            if (!hasCustId) this.availableCustomers.push({ custId: order.custId })
        })
    },
    methods: {
        async requestSalesOrder() {
            if (this.ordNr === '') alert('Must scan Order Nr.')
            else {
                this.loading = true;
                try {
                    await shippingStore().getOrderData(this.ordNr);
                    this.$router.push('/packing/dashboard')
                } catch (error) {
                    console.log(error)
                    if (error.response.status == '422') {
                        toastify('warning', 'Session has expired. Please login again.')
                        localStorage.clear();
                        this.$router.push('/login');
                    } else if (error.response.status != '401') {
                        toastify('error', error.response.data.error)
                    }
                } finally {
                    this.loading = false;
                }
            }
        }
    }
}
</script>

<style></style>
