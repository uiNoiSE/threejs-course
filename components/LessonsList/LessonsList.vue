<script setup lang="ts">
const lessons = [
  {
    name: '03 - Basic Scene',
    component: 'Lesson03',
  },
  {
    name: '05 - Transform Object',
    component: 'Lesson05',
  },
  {
    name: '06 - Animations',
    component: 'Lesson06',
  },
  {
    name: '07 - Cameras',
    component: 'Lesson07',
  },
  {
    name: '08 - Fullscreen and resizing',
    component: 'Lesson08',
  },
  {
    name: '09 - Geometries',
    component: 'Lesson09',
  },
  {
    name: '10 - Debug UI',
    component: 'Lesson10',
  },
  // {
  //   name: '11 - Textures',
  //   component: 'Lesson11',
  // },
  // {
  //   name: '12 - Materials',
  //   component: 'Lesson12',
  // },
  // {
  //   name: '13 - 3D Text',
  //   component: 'Lesson13',
  // },
  // {
  //   name: '15 - Lights',
  //   component: 'Lesson15',
  // },
  // {
  //   name: '16 - Shadows',
  //   component: 'Lesson16',
  // },
  // {
  //   name: '17 - Haunted house',
  //   component: 'Lesson17',
  // },
  // {
  //   name: '18 - Particles',
  //   component: 'Lesson18',
  // },
  // {
  //   name: '19 - Galaxy generator',
  //   component: 'Lesson19',
  // },
  // {
  //   name: '20 - Scroll Based Animation',
  //   component: 'Lesson20',
  // },
  // {
  //   name: '21 - Physics',
  //   component: 'Lesson21',
  // },
  // {
  //   name: '22 - Imported Models',
  //   component: 'Lesson22',
  // },
  // {
  //   name: '23 - Ray casting',
  //   component: 'Lesson23',
  // },
  // {
  //   name: '24 - Custom Blender Model',
  //   component: 'Lesson24',
  // },
  // {
  //   name: '25 - Realistic Render',
  //   component: 'Lesson25',
  // },
  // {
  //   name: '26 - Code structure',
  //   component: 'Lesson26',
  // },
];
</script>

<template>
  <div class="lessons">
    <div class="lessons__container">
      <h2 class="lessons__title">Lessons:</h2>
      <ul>
        <li v-for="lesson in lessons" class="lessons__link">
          <NuxtLink :to="lesson.component">{{ lesson.name }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style src="./LessonsList.less" lang="less" />
