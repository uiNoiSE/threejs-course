<script setup lang="ts">
const nuxtApp = useNuxtApp();
const loading = ref(true);

if (process.client) {
  document.body.classList.add('lock');
}

nuxtApp.hook('page:finish', () => {
  console.time();
  loading.value = false;
  document.body.classList.remove('lock');
  console.timeEnd();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
