<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { useResize, useSizes } from '../mixins/global';
import Stats from 'stats.js';

// Base
const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);
const stats = new Stats();
const scene = new Scene();
const previousTime = ref(0);

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();
dracoLoader.setDecoderPath('/libs/');
gltfLoader.setDRACOLoader(dracoLoader);

onBeforeMount(() => {
  document.body.appendChild(stats.dom);
  stats.showPanel(0);

  /*
   * Model
   */
  gltfLoader.load('/models/hamburger.glb', (gltf) => {
    scene.add(gltf.scene);
  });
});

onMounted(() => {
  // Canvas
  canvas.value = document.querySelector('canvas.three');

  // Scene
  window.addEventListener('resize', () => handleResize(camera, renderer));

  /**
   * Floor
   */
  const floor = new Mesh(
    new PlaneGeometry(50, 50),
    new MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5,
    }),
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);

  /*
   * Mouse
   */
  const mouse = new Vector2();
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width.value) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height.value) * 2 + 1;
  });

  /*
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(-8, 4, 8);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;

  /*
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /*
   * Lights
   */
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 2);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  /*
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime.value;
    previousTime.value = elapsedTime;

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    stats.end();
  };

  tick();
});

onUnmounted(() => {
  canvas.value = null;
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
