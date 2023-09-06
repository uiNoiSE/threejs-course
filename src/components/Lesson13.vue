<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
AxesHelper,
  Clock,
  Mesh,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useResize, useSizes, handleMousemove } from '../mixins/global';
import GUI from 'lil-gui';

const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);

onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => handleMousemove(e));
});

onMounted(() => {
  /**
   * Base
   */
  window.addEventListener('resize', () => handleResize(camera, renderer));

  // Debug
  // const gui = new GUI();

  // Canvas
  const canvas = document.querySelector('canvas.three');

  // Scene
  const scene = new Scene();

  const axesHelper = new AxesHelper();
  // scene.add(axesHelper);

  /**
   * Textures
   */
  const textureLoader = new TextureLoader();
  // const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

  /**
   * Fonts
   */
  const fontLoader = new FontLoader();
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Three.js', {
      font,
      size: 0.5,
      height: 0.1,
      curveSegments: 24,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSgments: 50,
    });
    textGeometry.computeBoundingBox();
    textGeometry.center();

    const material = new MeshNormalMaterial({
    // const material = new MeshMatcapMaterial({
      // matcap: matcapTexture,
    });
    const text = new Mesh(textGeometry, material);
    scene.add(text);

    console.time('donuts')

    const donutGeometry = new TorusGeometry(0.3, 0.2, 20, 45);

    for (let i = 0; i < 3000; i++) {
      const donut = new Mesh(donutGeometry, material);

      donut.position.x = (Math.random() - 0.5) * 100;
      donut.position.y = (Math.random() - 0.5) * 30;
      donut.position.z = (Math.random() - 0.5) * 30;

      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 0.9;
      donut.scale.set(scale, scale, scale)

      scene.add(donut);
    }
    console.timeEnd('donuts')
  });

  /**
   * Sizes
   */
  const aspectRatio = sizes.width.value / sizes.height.value;

  /**
   * Camera
   */
  // Base camera
  const camera = new PerspectiveCamera(
    75,
    aspectRatio,
    0.1,
    100
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // Update objects
    camera.position.x = Math.tan(elapsedTime / 3);
    camera.position.z = Math.sin(elapsedTime / 4);

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
