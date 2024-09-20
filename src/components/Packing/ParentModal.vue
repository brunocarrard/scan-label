<template>
    <div
        class="absolute w-80 sm:w-1/2 h-32 sm:h-96 bg-black px-4 sm:px-0 mt-44 sm:mt-10 rounded-xl flex flex-col items-center justify-center gap-4 border-4 border-red-500">
        <div class="w-96 flex flex-col items-center justify-center gap-2">
            <h3 class="text-white font-bold">Choose your SubPart's Parent Part</h3>
            <button v-for="parent in parents" @click="chooseParent(parent)"
                class="bg-white rounded w-48 text-grey font-bold h-8">{{ parent == undefined ? 'Not a SubPart' :
                    parent
                }}</button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        parents: Array,
        scan: Object
    },
    methods: {
        chooseParent(parent) {
            if (parent != undefined) {
                this.scan.ParentPart = parent
                this.scan.SubPartInd = 1
            } else {
                this.scan.SubPartInd = 0
            }
            this.$emit('selected', this.scan)
        }
    }
}
</script>