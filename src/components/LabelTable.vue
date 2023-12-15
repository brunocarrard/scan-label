<template>
    <div class="w-10/12 self-center">
        <table v-if="scans.length > 0" class="bg-white">
        <thead>
            <tr class="grid grid-cols-12">
                <th class="col-span-3">PartCode</th>
                <th class="col-span-2">Qty</th>
                <th class="col-span-3">Duns</th>
                <th class="col-span-3">LotNr</th>
                <th class="col-span-1 flex items-center justify-center">x</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="scan, index in scans" class="grid grid-cols-12">
                <td class="col-span-3"> {{ scan.partCode }} </td>
                <td class="col-span-2"> {{ scan.qty }} </td>
                <td class="col-span-3"> {{ scan.duns }} </td>
                <td class="col-span-3"> {{ scan.lotNr }} </td>
                <td class="col-span-1 flex items-center justify-center"> <i v-html="removeIcon" class="cursor-pointer" @click="$emit('removeItem', index)"></i> </td>
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

        table, th, td {
            border: 1px solid #000;
        }

        th, td {
            padding: 10px;
            text-align: left;
        }
</style>