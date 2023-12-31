<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { handleMousemove, useResize, useSizes } from '../mixins/global';

const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);

onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => handleMousemove(e));
});

onMounted(() => {
  canvas.value = document.querySelector('canvas.three');
  window.addEventListener('resize', () => handleResize(camera, renderer));

  // Scene
  const scene = new Scene();

  /**
   * Textures
   */
  const textureLoader = new TextureLoader();
  const particleTexture = textureLoader.load('/18/2.png');

  /**
   * Particles
   */
  const particlesGeometry = new BufferGeometry();
  const count = 20000;
  const particlesMaterial = new PointsMaterial({
    size: 0.1,
    // color: 'magenta',
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
  });

  console.time('points');
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  console.timeEnd('points');

  particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new BufferAttribute(colors, 3));

  // Points
  const particles = new Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  /**
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;

  // Base camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 3);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });

  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Animate particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = particlesGeometry.attributes.position.array[i3];
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x);
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
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
