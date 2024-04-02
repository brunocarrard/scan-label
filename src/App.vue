<template>
  <div class="flex items-center justify-center">
    <router-view @confirmed="(data) => confirmedOrdNr(data)" :data="data" />
  </div>
  <Toastify />
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
      const rearrangedArray = [];
      data.parts.forEach(obj => {
        if (!obj.ParentPart) {
          rearrangedArray.push(obj);
          const children = data.parts.filter(child => child.ParentPart === obj.PartCode);
          rearrangedArray.push(...children);
        }
      });
      data.parts = rearrangedArray
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