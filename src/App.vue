<template>
  <div class="flex flex-col lg:flex-row">

    <Navbar v-if="navbar"
      class="bg-black border-b-2 border-red-500 flex items-center justify-between px-10 lg:flex-col lg:w-1/12 lg:h-screen lg:py-10 lg:px-0 lg:border-r-2 lg:border-b-0 lg:fixed" />
    <div class="flex items-center justify-center lg:w-11/12 lg:ml-32">
      <router-view />
    </div>
  </div>
  <Toastify />
</template>

<script>
import Navbar from './components/Navbar.vue';
export default {
  components: {
    Navbar
  },
  data() {
    return {
      navbar: true
    }
  },
  computed: {
    navbar() {
      return this.$route.name === 'Login' ? false : true
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