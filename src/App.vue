<script setup>
import { ref } from 'vue';
import Lesson03 from './components/Lesson03/Lesson03.vue';
import Lesson05 from './components/Lesson05/Lesson05.vue';
import Lesson06 from './components/Lesson06/Lesson06.vue';

const lessons = [
  {
    name: '03 - Basic Scene',
    component: Lesson03,
  },
  {
    name: '05 - Transform Object',
    component: Lesson05,
  },
  {
    name: '06 - Animations',
    component: Lesson06,
  },
];

const chosenLesson = ref(2);
const isMenuOpen = ref(false);

const chooseLesson = (lesson) => {
  chosenLesson.value = lesson;
  toggleMenu(false);
};

const toggleMenu = (state) => {
  if (state !== undefined) {
    isMenuOpen.value = state;
  } else {
    isMenuOpen.value = !isMenuOpen.value;
  }
};
</script>

<template>
  <button @click="toggleMenu()" class="app__menu-button">Меню</button>
  <Transition name="fade">
    <ul v-if="isMenuOpen" class="app__list">
      <li
        class="app__list-item"
        v-for="(lesson, index) in lessons"
        @click="chooseLesson(index)"
      >
        {{ lesson.name }}
      </li>
    </ul>
  </Transition>

  <keep-alive>
    <component :is="lessons[chosenLesson].component" />
  </keep-alive>
</template>

<style lang="less">
.app {
  &__menu-button {
    position: fixed;
    z-index: 20;
    top: 0;
    right: 0;
    background-color: #555;
  }

  &__list {
    position: fixed;
    background-color: #333;
    z-index: 10;
    inset: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__list-item {
    list-style: none;
    font-family: sans-serif;
    font-weight: 500;
    cursor: pointer;
  }
}
</style>
