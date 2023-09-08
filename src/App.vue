<script setup>
import { ref } from 'vue';
import Lesson03 from './components/Lesson03.vue';
import Lesson05 from './components/Lesson05.vue';
import Lesson06 from './components/Lesson06.vue';
import Lesson07 from './components/Lesson07.vue';
import Lesson08 from './components/Lesson08.vue';
import Lesson09 from './components/Lesson09.vue';
import Lesson10 from './components/Lesson10.vue';
import Lesson11 from './components/Lesson11.vue';
import Lesson12 from './components/Lesson12.vue';
import Lesson13 from './components/Lesson13.vue';
import Lesson15 from './components/Lesson15.vue';
import Lesson16 from './components/Lesson16.vue';
import Lesson17 from './components/Lesson17.vue';
import Lesson18 from './components/Lesson18.vue';
import Lesson19 from './components/Lesson19.vue';
import Lesson20 from './components/Lesson20.vue';

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
  {
    name: '07 - Cameras',
    component: Lesson07,
  },
  {
    name: '08 - Fullscreen and resizing',
    component: Lesson08,
  },
  {
    name: '09 - Geometries',
    component: Lesson09,
  },
  {
    name: '10 - Debug UI',
    component: Lesson10,
  },
  {
    name: '11 - Textures',
    component: Lesson11,
  },
  {
    name: '12 - Materials',
    component: Lesson12,
  },
  {
    name: '13 - 3D Text',
    component: Lesson13,
  },
  {
    name: '15 - Lights',
    component: Lesson15,
  },
  {
    name: '16 - Shadows',
    component: Lesson16,
  },
  {
    name: '17 - Haunted house',
    component: Lesson17,
  },
  {
    name: '18 - Particlies',
    component: Lesson18,
  },
  {
    name: '19 - Galaxy generator',
    component: Lesson19,
  },
  {
    name: '20 - Scroll Based Animation',
    component: Lesson20,
  },
];

const chosenLesson = ref(15);
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

  <KeepAlive>
    <component :is="lessons[chosenLesson].component" />
  </KeepAlive>
</template>

<style lang="less">
.app {
  &__menu-button {
    position: fixed;
    z-index: 20;
    bottom: 0;
    right: 0;
    padding: 12px 18px;
    border: 1px solid transparent;
    background-color: #555;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.25s;

    @media @tablet {
      font-size: 32px;
    }

    @media @hd {
      font-size: 24px;
    }

    @media @desktop {
      font-size: 18px;
    }
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
    color: @c-white;
    cursor: pointer;
  }
}
</style>
