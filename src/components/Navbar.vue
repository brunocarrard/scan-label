<template>
    <div>
        <label class="text-white">{{ user }}</label>
        <button @click="logout()"
            class="cursor-pointer justify-center flex items-center bg-lightGrey w-28 px-3 gap-2 rounded-md lg:flex-col lg:gap-0 lg:px-0 lg:w-16 my-4 border-4 border-grey">
            <label class="text-white cursor-pointer">Logout</label>
            <i v-html="logoutIcon" class="pt-1 lg:w-1/2"></i>
        </button>
    </div>
</template>

<script>
import { logoutIcon } from '../assets/index.js'
export default {
    data() {
        return {
            logoutIcon
        }
    },
    computed: {
        user() {
            return localStorage.getItem('user') || ''
        }
    },
    methods: {
        logout() {
            localStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>