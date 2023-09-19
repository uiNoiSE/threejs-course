<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { handleMousemove, useResize, useSizes } from '../mixins/global';
import GUI from 'lil-gui';

const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);
const gui = new GUI();

onBeforeMount(() => {
  gui.reset();
  window.addEventListener('mousemove', (e) => handleMousemove(e));
});

onMounted(() => {
  canvas.value = document.querySelector('canvas.three');
  /**
   * Base
   */
  window.addEventListener('resize', () => handleResize(camera, renderer));

  // Scene
  const scene = new Scene();

  /**
   * Galaxy
   */
  const parameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    color: {
      inside: '#ff6030',
      outside: '#1b3984',
    },
  };
  let geometry = null;
  let material = null;
  let points = null;

  const generateGalaxy = () => {
    if (points !== null) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }
    /**
     * Geometry
     */
    geometry = new BufferGeometry();

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new Color(parameters.color.inside);
    const colorOutside = new Color(parameters.color.outside);

    console.time('galaxy');
    for (let i = 0; i < parameters.count; i++) {
      //Position
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Colors
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    console.timeEnd('galaxy');

    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));

    /**
     * Material
     */
    material = new PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: AdditiveBlending,
      vertexColors: true,
    });

    /**
     * Points
     */
    points = new Points(geometry, material);
    scene.add(points);
  };
  generateGalaxy();

  /**
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;

  // Base camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(3, 3, 3);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;

  // Debug
  gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
  gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
  gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
  gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
  gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);
  gui.addColor(parameters.color, 'inside').onFinishChange(generateGalaxy);
  gui.addColor(parameters.color, 'outside').onFinishChange(generateGalaxy);

  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });

  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /*
   * Animate
   */
  const tick = () => {
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  tick();
});

onUnmounted(() => {
  canvas.value = null;
  gui.destroy();
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
