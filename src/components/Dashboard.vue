<template>
    <div
        class="sm:w-1/2 h-48 sm:h-96 bg-black px-4 sm:px-0 mt-44 sm:mt-10 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-48 flex flex-col gap-2">
            <div class="flex flex-col gap-2">
                <!-- <h1 class="text-white font-bold">TEST APP</h1> -->
                <h1 class="text-white font-bold">Select your path:</h1>
            </div>
        </div>
        <button v-for="path in paths" @click="$router.push(path.path)"
            class="bg-white rounded w-48 text-grey font-bold h-8">{{ path.name }}</button>
        <router-view />
    </div>
</template>

<script>
export default {
    data() {
        return {
            paths: [
                {
                    name: 'Packing',
                    path: '/packing',
                },
                {
                    name: 'Stock',
                    path: '/stock'
                }
            ]
        }
    }
}
</script>
