<template>
    <div
        class="sm:w-1/2 h-48 sm:h-96 bg-black px-4 sm:px-0 mt-44 sm:mt-10 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <!-- <h1 class="text-white font-bold">TEST APP</h1> -->
                <h1 class="text-white font-bold">Select Origin Warehouse:</h1>
            </div>
            <select v-model="originWarehouse">
                <option v-for="warehouse in warehouses" :value="warehouse">{{ warehouse }}</option>
            </select>
        </div>
        <button @click="selectWarehouse()" class="bg-white rounded w-48 text-grey font-bold h-8">
            <label v-if="!loading" class="cursor-pointer">Confirm</label>
        </button>
    </div>
</template>

<script>
import { stockStore } from "../../stores/stock.js"
export default {
    data() {
        return {
            originWarehouse: '',
        }
    },
    computed: {
        warehouses() {
            return stockStore()._warehouses
        }
    },
    watch: {
        warehouses: {
            handler(newValue, oldValue) {
                if (newValue == []) this.restoreSession;
            },
        }
    },
    methods: {
        restoreSession() {
            this.$router.push('/stock')
        },
        async selectWarehouse() {
            this.loading = true
            try {
                await stockStore().getParts(this.originWarehouse)
                this.$router.push('/stock/dashboard')
            } catch (error) {
                if (error.response.status == '422') {
                    toastify('warning', 'Session has expired. Please login again.')
                    localStorage.clear();
                    this.$router.push('/login');
                } else if (error.response.status != '401') {
                    toastify('error', error.response.data.error)
                }
            } finally {
                this.loading = false
            }
        }
    }
}
</script>
