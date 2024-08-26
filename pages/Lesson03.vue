<script setup>
import { onMounted } from 'vue';
import {
  BoxGeometry,
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

  renderer.render(scene, camera);
});
</script>

<template>
  <canvas class="three" />
</template>
