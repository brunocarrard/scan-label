<template>
    <div
        class="sm:w-1/2 h-48 sm:h-96 bg-black px-4 sm:px-0 mt-44 sm:mt-10 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <!-- <h1 class="text-white font-bold">TEST APP</h1> -->
                <h1 class="text-white font-bold">Select Stock function:</h1>
            </div>
        </div>
        <button v-for="path in paths" @click="redirect(path.path)"
            class="bg-white rounded w-48 text-grey font-bold h-8">
            <label v-if="!loading" class="cursor-pointer">{{ path.name }}</label>
            <label v-if="loading" class="animate-pulse">Loading...</label>
        </button>
    </div>
</template>

<script>
import { stockStore } from "../../stores/stock.js"
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
export default {
    data() {
        return {
            loading: false,
            paths: [
                {
                    name: 'Transfer Stock',
                    path: '/stock/transfer',
                },
                {
                    name: 'Put Away',
                    path: '/stock/putaway'
                }
            ]
        }
    },
    methods: {
        async redirect(path) {
            this.loading = true
            try {
                let response = await stockStore().getWarehouses()
                console.log(response)
                this.$router.push(path)
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
