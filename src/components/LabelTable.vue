<template>
    <div class=" self-center text-xs sm:text-base">
        <table v-if="scans.length > 0" class="bg-white sm:w-1/2">
            <thead class="header">
                <tr class="grid grid-cols-12">
                    <th class="col-span-3">PartCode</th>
                    <th class="col-span-2">Qty</th>
                    <th class="col-span-6">Certificate / LotNr</th>
                    <th class="col-span-1 flex items-center justify-center">x</th>
                </tr>
            </thead>
            <tbody class="flex flex-col max-h-cel sm:max-h-96 overflow-y-scroll auto">
                <tr v-for=" scan, index  in  scans " class="grid grid-cols-12 transition-transform">
                    <td class="col-span-3 "> {{ scan.partCode }} </td>
                    <td class="col-span-2"> {{ scan.qty }} </td>
                    <td class="col-span-6"> {{ scan.lotNr }} </td>
                    <td class="col-span-1 flex items-center justify-center"> <i v-html="removeIcon"
                            class="cursor-pointer opacity-80 fill-red-500" @click="$emit('removeItem', index)"></i> </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { removeIcon } from '../assets/index.js';
export default {
    props: {
        scans: Array
    },
    data() {
        return {
            removeIcon
        }
    },
}
</script>

<style scoped>
div {
    display: flex;
    flex-direction: column;
}

table {
    border-collapse: collapse;
    width: 100%;
}

table,
th,
td {
    border: 1px solid #000;
}

th,
td {
    padding: 10px;
    text-align: left;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #999;
}

th {
    background: linear-gradient(to right, #adbac0 0%, #dfe0e1 20%, #f2f2f2 50%, #dfe0e1 80%, #b5c1c6 100%);
    overflow-x: hidden;
}

td {
    background-color: #f2f2f2
}
</style>