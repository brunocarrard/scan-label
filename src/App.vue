<template>
  <div class="flex items-center justify-center">
    <router-view />
  </div>
  <Toastify />
</template>

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