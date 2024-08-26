<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import {
  BoxGeometry,
  Clock,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {
  width: 800,
  height: 600,
};

/*
/ Cursor
*/
const cursor = {
  x: ref(0),
  y: ref(0),
};
onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => {
    cursor.x.value = e.clientX / sizes.width - 0.5;
    cursor.y.value = -(e.clientY / sizes.height - 0.5);
  });
});

onMounted(() => {
  const scene = new Scene();

  const mesh = new Mesh(
    new BoxGeometry(1, 1, 1, 5, 5, 5),
    new MeshBasicMaterial({ color: 'red' })
  );
  scene.add(mesh);

  const aspectRatio = sizes.width / sizes.height;

  // Camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 3);
  camera.lookAt(mesh.position);
  scene.add(camera);

  const canvas = document.querySelector('.three');
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setClearColor('#242424');

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Animations
  const tick = () => {
    controls.update();

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();
});
</script>

<template>
  <canvas class="three" />
</template>
