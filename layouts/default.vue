<script setup lang="ts">
const { siteUrl } = useRuntimeConfig().public;

useSeoMeta({
  title: 'Three.js Course',
  ogTitle: `uiNoiSE's Journey in Mastering Three.js: Unveiling the Power of 3D Web Graphics`,
  description: `Explore my journey in learning Three.js, a powerful JavaScript library for creating 3D graphics. Each lesson is presented on a separate page, showcasing my progress and learnings along the way. Dive in to see how I'm mastering 3D web development!`,
  ogDescription: `Explore my journey in learning Three.js, a powerful JavaScript library for creating 3D graphics. Each lesson is presented on a separate page, showcasing my progress and learnings along the way. Dive in to see how I'm mastering 3D web development!`,
  ogImageUrl: `${siteUrl}sharing.jpg`,
  ogUrl: 'https://uinoise.github.io/threejs-course/',
  twitterTitle: `uiNoiSE's Journey in Mastering Three.js: Unveiling the Power of 3D Web Graphics`,
  twitterDescription: `Explore my journey in learning Three.js, a powerful JavaScript library for creating 3D graphics. Each lesson is presented on a separate page, showcasing my progress and learnings along the way. Dive in to see how I'm mastering 3D web development!`,
  twitterImage: `${siteUrl}sharing.jpg`,
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
    href: `${siteUrl}favicon.svg`,
  }, {
    rel: 'shortcut icon',
    type: 'image/svg+xml',
    href: `${siteUrl}favicon.svg`,
  }],
});
</script>

<template>
  <!--TODO: Add Header and Footer, style lil-gui positioning -
   https://lil-gui.georgealways.com/#:~:text=rotation.x%27%20)%3B-,Styling,-By%20default%2C%20the
  -->
  <!--  <header-block />-->
  <slot />
  <!--  <footer-block />-->
</template>
