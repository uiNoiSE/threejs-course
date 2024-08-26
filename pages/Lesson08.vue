<script setup>
import { onMounted, onBeforeMount, onUnmounted, ref } from 'vue';
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  useResize,
  useSizes,
  toggleFullScreen,
  handleMousemove,
} from '~/utils/global';

const handleResize = useResize();
const sizes = useSizes();

const canvas = ref(null);

onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => handleMousemove(e));
});

onMounted(() => {
  window.addEventListener('resize', () => handleResize(camera, renderer));
  canvas.value = document.querySelector('.three');
  window.addEventListener('dblclick', () => toggleFullScreen(canvas));

  const scene = new Scene();

  const mesh = new Mesh(
    new BoxGeometry(1, 1, 1, 5, 5, 5),
    new MeshBasicMaterial({ color: 'red' })
  );
  scene.add(mesh);

  const aspectRatio = sizes.width.value / sizes.height.value;

  // Camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 3);
  camera.lookAt(mesh.position);
  scene.add(camera);

  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setClearColor('#242424');

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;

  // Animations
  const tick = () => {
    controls.update();

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  onUnmounted(() => {
    canvas.value = null;
  });
});
</script>

<template>
  <canvas class="three" />
</template>
