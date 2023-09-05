<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  useResize,
  useSizes,
  handleFullscreen,
  handleMousemove,
} from '../mixins/global';

const handleResize = useResize();
const sizes = useSizes();

const canvas = ref(null);

onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => handleMousemove(e));
});

onMounted(() => {
  window.addEventListener('resize', () => handleResize(camera, renderer));
  canvas.value = document.querySelector('.three');
  window.addEventListener('dblclick', () => handleFullscreen(canvas));

  const scene = new Scene();
  const geometry = new BufferGeometry();
  const material = new MeshBasicMaterial({ color: 'red', wireframe: true });
  const count = 5000;
  const positionsArray = new Float32Array(count * 3 * 3);

  for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = Math.random() - 0.5;
  }

  const positionsAttribute = new BufferAttribute(positionsArray, 3);

  const mesh = new Mesh(geometry, material);
  geometry.setAttribute('position', positionsAttribute);
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

onUnmounted(() => {
  canvas.value = null;
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
