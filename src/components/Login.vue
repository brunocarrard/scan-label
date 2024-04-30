<template>
    <div
        class="sm:w-1/2 h-64 sm:h-96 bg-black px-4 sm:px-0 mt-44 sm:mt-10 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <!-- <h1 class="text-white font-bold">TEST APP</h1> -->
                <h1 class="text-white font-bold">Username</h1>
                <input class="w-full border rounded h-8 text-center" v-model="username" :disabled="loading">
                <h1 class="text-white font-bold">Password</h1>
                <input class="w-full border rounded h-8 text-center" type="password" v-model="password"
                    :disabled="loading">
            </div>
        </div>
        <button @click="requestSalesOrder" :disabled="loading" class="bg-white rounded w-48 text-grey font-bold h-8">
            <label v-if="!loading" class="cursor-pointer">Confirm</label>
            <label v-if="loading" class="animate-pulse">Searching...</label>
        </button>
    </div>
</template>

<script>
import { useToastify } from 'vue-toastify-3'
const { toastify } = useToastify()
import { authStore } from "../stores/auth.js"
export default {
    data() {
        return {
            username: '',
            password: '',
            loading: false
        }
    },
    methods: {
        async requestSalesOrder() {
            if (this.username === '' || this.password === '') alert('Must inform username and password')
            else {
                let payload = {
                    username: this.username,
                    password: this.password
                }
                this.loading = true;
                try {
                    await authStore().auth(payload);
                    toastify('success', 'Login Successfull')
                    this.$router.push('/')
                } catch (error) {
                    console.error(error)
                    toastify('error', error.response.data.error)

                } finally {
                    this.loading = false;
                }
            }
        }
    }
}
</script>

<style></style>
