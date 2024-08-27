<script setup lang="ts">
const config = useRuntimeConfig();

useSeoMeta({
  title: 'Three.js Course',
  ogTitle: `uiNoiSE's Journey in Mastering Three.js: Unveiling the Power of 3D Web Graphics`,
  description: `Explore my journey in learning Three.js, a powerful JavaScript library for creating 3D graphics. Each lesson is presented on a separate page, showcasing my progress and learnings along the way. Dive in to see how I'm mastering 3D web development!`,
  ogDescription: `Explore my journey in learning Three.js, a powerful JavaScript library for creating 3D graphics. Each lesson is presented on a separate page, showcasing my progress and learnings along the way. Dive in to see how I'm mastering 3D web development!`,
  ogImage: `${process.env.NODE_ENV === 'production' ? config.app.baseURL : ''}/sharing.jpg`,
  ogUrl: 'https://uinoise.github.io/threejs-course/',
  twitterTitle: `uiNoiSE's Journey in Mastering Three.js: Unveiling the Power of 3D Web Graphics`,
  twitterDescription: `Explore my journey in learning Three.js, a powerful JavaScript library for creating 3D graphics. Each lesson is presented on a separate page, showcasing my progress and learnings along the way. Dive in to see how I'm mastering 3D web development!`,
  twitterImage: `${process.env.NODE_ENV === 'production' ? config.app.baseURL : ''}/sharing.jpg`,
  twitterCard: 'summary_large_image',
  formatDetection: 'telephone=no',
});

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{
    rel: 'icon',
    type: 'image/svg+xml',
    href: '/favicon.svg',
  }, {
    rel: 'shortcut icon',
    type: 'image/svg+xml',
    href: `${process.env.NODE_ENV === 'production' ? config.app.baseURL : ''}/favicon.svg`,
  }],
});
</script>

<template>
  <!--TODO: Add Header and Footer, style lil-gui positioning -
   https://lil-gui.georgealways.com/#:~:text=rotation.x%27%20)%3B-,Styling,-By%20default%2C%20the
  -->
  <!--  <header-block />-->
  <ClientOnly>
    <slot />
  </ClientOnly>
  <!--  <footer-block />-->
</template>
