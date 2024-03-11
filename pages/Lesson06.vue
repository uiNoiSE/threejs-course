<script setup lang="ts">
import { gsap } from 'gsap';
import type { Mesh } from 'three';
import type { ShallowRef } from 'vue';

const boxRef: ShallowRef<Mesh | null> = shallowRef(null);

const animateBox = () => {
  if (boxRef.value) {
    const timeline = gsap.timeline();

    timeline.to(boxRef.value.position, {
      duration: 1,
      delay: 1,
      x: 2,
    });

    timeline.to(boxRef.value.position, {
      duration: 1,
      delay: 1,
      x: -2,
    }, '<');

    timeline.to(boxRef.value.position, {
      duration: 1,
      delay: 1,
      x: 0,
    }, '<');
  }
};

onMounted(async () => {
  await nextTick(() =>
    animateBox(),
  );
});
</script>

<template>
  <TresCanvas windowSize>
    <TresPerspectiveCamera :position="[0, 0, 3]" />
    <TresMesh ref="boxRef">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshBasicMaterial color="red" />
    </TresMesh>
  </TresCanvas>
</template>
