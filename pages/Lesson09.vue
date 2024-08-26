<script setup lang="ts">
import {
  BufferAttribute,
  BufferGeometry,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { toggleFullScreen, useResize, useSizes } from '~/utils/global';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = ref<HTMLCanvasElement>();
const handleResize = useResize();
const sizes = useSizes();

const scene = new Scene();
const geometry = new BufferGeometry();
const material = new MeshBasicMaterial({ color: 'red', wireframe: true });
const count = 5000;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}
const positionsAttribute = new BufferAttribute(positionsArray, 3);

// Helpers
const gridHelper = new GridHelper(5, 5);
gridHelper.position.y = -0.5;

const mesh = new Mesh(geometry, material);
geometry.setAttribute('position', positionsAttribute);

// Camera
const aspectRatio = sizes.width.value / sizes.height.value;
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position);
scene.add(camera);

onMounted(() => {
  // if (!canvas.value) throw new Error('Canvas not found');
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setClearColor('#242424');

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;
  controls.minDistance = 2;
  controls.maxDistance = 5;

  // Animations
  const tick = () => {
    controls.update();

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  scene.add(gridHelper, mesh, camera);
  window.addEventListener('resize', () => handleResize(camera, renderer));
  window.addEventListener('dblclick', () => toggleFullScreen(canvas));
});
</script>

<template>
  <canvas ref="canvas" />
</template>

