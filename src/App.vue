<template>
  <div class="flex items-center justify-center sm:h-tablet lg:h-full w-100%">
    <router-view @confirmed="(data) => confirmedOrdNr(data)" :data="data"/>
  </div>
  <Toastify/>
</template>

<script>
  export default {
    data() {
      return {
        data: {}
      } 
    },
    methods: {
      confirmedOrdNr(data) { 
        this.data = data;
        this.$router.push('/dashboard');
      }
    }
  }
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
  body {
    @apply bg-grey;
  }
  .container {
        width: 10%;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>