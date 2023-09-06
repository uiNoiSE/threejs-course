<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  TorusGeometry,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  RectAreaLight,
  Vector3,
  SpotLight,
  HemisphereLightHelper,
  DirectionalLightHelper,
  PointLightHelper,
  SpotLightHelper,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
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
  const canvas = document.querySelector('canvas.three');

  // Canvas

  // Scene
  const scene = new Scene();

  const axesHelper = new AxesHelper();
  scene.add(axesHelper);

  /**
   * Matirial
   */
  const material = new MeshStandardMaterial({
    roughness: 0.4,
  });

  /**
   * Lights
   */
  const ambientLight = new AmbientLight('#fff', 0.5);
  // scene.add(ambientLight);

  const directionalLight = new DirectionalLight('#00fffc', 1);
  directionalLight.position.set(1, 0.25, 0);
  scene.add(directionalLight);

  const hemisphereLight = new HemisphereLight('#ff0000', '#0000ff', 1);
  scene.add(hemisphereLight);

  const pointLight = new PointLight('#ff9000', 3, 10, 1);
  pointLight.position.set(1, -0.5, 1);
  scene.add(pointLight);

  const rectAreaLight = new RectAreaLight('#4e00ff', 2, 1, 1);
  rectAreaLight.position.set(-1.5, 0, 1.5);
  rectAreaLight.lookAt(new Vector3());
  scene.add(rectAreaLight);

  const spotLight = new SpotLight('#fff', 10, 6, Math.PI * 0.1, 0.25, 1);
  spotLight.position.set(0, 2, 3);
  spotLight.target.position.x = -0.75;

  // Helpers
  const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.2);
  const directionalLightHelper = new DirectionalLightHelper(
    directionalLight,
    0.2
  );
  const pointLightHelper = new PointLightHelper(pointLight, 0.2);
  const spotLightHelper = new SpotLightHelper(spotLight);
  const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
  scene.add(
    spotLight,
    spotLight.target,
    hemisphereLightHelper,
    directionalLightHelper,
    pointLightHelper,
    spotLightHelper,
    rectAreaLightHelper,
  );

  /**
   * Materials
   */
  // Objects
  const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
  sphere.position.x = -1.5;

  const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);

  const torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
  torus.position.x = 1.5;

  const plane = new Mesh(new PlaneGeometry(5, 5), material);
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.65;

  scene.add(sphere, cube, torus, plane);

  const aspectRatio = sizes.width.value / sizes.height.value;

  /**
   * Camera
   */
  // Base camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 3;
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Debug
  const gui = new GUI();
  gui.add(material, 'roughness').min(0).max(1).step(0.01).name('Roughness');

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
    sphere.rotation.y = 0.1 * elapsedTime;
    cube.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    cube.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;

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
