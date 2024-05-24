<template>
    <div class="grid grid-cols-12 w-full max-h-screen scroll-auto lg:h-screen">
        <div class="col-span-12 bg-lightGrey flex flex-col">
            <div class="flex items-center justify-between px-4 pt-4 md:flex-none md:pl-4 md:pt-4 text-xs md:text-base">
                <i v-html="backArrow" class="cursor-pointer" @click="$router.push('/stock')"></i>
                <h1 class="font-bold text-white text-xl sm:pl-10 pl-2">Stock Transfer</h1>
            </div>
            <div class="flex flex-col py-4 gap-1">
                <div class="flex items-center justify-between px-4">
                    <label class="text-white text-xl">Filter with scan:</label>
                    <input class=" text-black text-center mt-2 mb-2 sm:mt-0" placeholder="Click here before scaning"
                        v-model="label">
                </div>
                <div class="flex items-center justify-between px-4">
                    <label class="text-white text-xl">Parts:</label>
                    <select class=" text-black text-center mt-2 mb-2 sm:mt-0" v-model="selectedPart">
                        <option v-for="part in parts" :value="part">{{ part }}</option>
                    </select>
                </div>
                <div class="flex items-center justify-between px-4">
                    <label class="text-white text-xl">Origin Warehouse:</label>
                    <select class=" text-black text-center mt-2 mb-2 sm:mt-0" v-model="selectedWarehouse">
                        <option v-for="warehouse in warehouses" :value="warehouse">{{ warehouse }}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="bg-grey col-span-12 flex flex-col start-0">

            <button v-if="ready && totalScan > 0" :disabled="loading" @click="confirm"
                class="bg-white text-black p-4 w-1/2 self-center rounded font-bold my-4">
                <label v-if="!loading" class="cursor-pointer">Import Scans</label>
                <label v-if="loading" class="animate-pulse">Importing...</label>
            </button>

        </div>

    </div>
</template>

<script>
import { backArrow } from '../../assets/index.js'
import { stockStore } from '../../stores/stock.js'
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
export default {
    data() {
        return {
            loading: false,
            backArrow,
            selectedPart: '',
            selectedWarehouse: ''
        }
    },
    computed: {
        parts() {
            return stockStore()._parts
        },
        warehouses() {
            return stockStore()._warehouses
        }
    },
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