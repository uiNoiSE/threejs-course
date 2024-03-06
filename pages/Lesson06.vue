<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';
import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

onMounted(() => {
  const scene = new Scene();

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 'red' });

  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const sizes = {
    width: 800,
    height: 600,
  };

  const aspectRatio = () => sizes.width / sizes.height;

  // Camera
  const camera = new PerspectiveCamera(75, aspectRatio());
  camera.position.z = 3;
  scene.add(camera);

  const canvas = document.querySelector('.three');
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setClearColor('#242424');

  // Clock
  // const clock = new Clock();

  gsap.to(mesh.position, {
    duration: 1,
    delay: 1,
    x: 2,
  });
  gsap.to(
    mesh.position,
    {
      duration: 1,
      delay: 1,
      x: -2,
    },
    '<'
  );
  gsap.to(
    mesh.position,
    {
      duration: 1,
      delay: 1,
      x: 0,
    },
    '<'
  );

  // Animations
  const tick = () => {
    //   // Clock
    //   const elapsedTime = clock.getElapsedTime();

    //   // Update objects
    //   mesh.position.y = Math.sin(elapsedTime);
    //   mesh.position.x = Math.cos(elapsedTime);

    //   camera.lookAt(mesh.position);

    //   // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
