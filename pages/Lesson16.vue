<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  CameraHelper,
  Clock,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  TextureLoader,
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
  // const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
  const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new AmbientLight(0xffffff, 0.3);
  gui.add(ambientLight, 'intensity', 0, 1, 0.001).name('Ambient');
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new DirectionalLight(0xffffff, 0.3);
  scene.add(directionalLight);

  const directionalLightHelper = new DirectionalLightHelper(directionalLight, 0.2);
  directionalLight.position.set(2, 2, -1);
  gui.add(directionalLight, 'intensity', 0, 1, 0.001).name('Directional light');
  gui.add(directionalLight.position, 'x', -5, 5, 0.001);
  gui.add(directionalLight.position, 'y', -5, 5, 0.001);
  gui.add(directionalLight.position, 'z', -5, 5, 0.001);
  gui.add(directionalLight.shadow.camera, 'far', -100, 100, 0.001).name('Far');
  gui.add(directionalLight.shadow.camera, 'near', -100, 100, 0.001).name('Near');

  directionalLight.castShadow = false;
  directionalLight.shadow.mapSize.x = 1024;
  directionalLight.shadow.mapSize.y = 1024;

  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 6;

  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.left = -2;
  // directionalLight.shadow.radius = 10;

  const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
  directionalLightCameraHelper.visible = false;
  scene.add(directionalLightHelper);
  scene.add(directionalLightCameraHelper);

  // Spotlight
  const spotLight = new SpotLight('#fff', 4, 0.5, Math.PI * 0.3);
  spotLight.castShadow = false;
  spotLight.position.set(0, 2, 2);
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.fov = 15;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 4.2;

  const spotLightCameraHelper = new CameraHelper(spotLight.shadow.camera);
  spotLightCameraHelper.visible = false;
  scene.add(spotLight, spotLight.target, spotLightCameraHelper);

  // Point light
  const pointLight = new PointLight('#fff', 0.5);
  pointLight.castShadow = false;
  pointLight.position.set(-1, 1, 0);
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 5;

  const pointLightCameraHelper = new CameraHelper(pointLight.shadow.camera);
  pointLightCameraHelper.visible = false;
  scene.add(pointLight, pointLightCameraHelper);

  /**
   * Materials
   */
  const material = new MeshStandardMaterial();
  material.roughness = 0.7;
  gui.add(material, 'metalness', 0, 1, 0.001).name('Metalness');
  gui.add(material, 'roughness', 0, 1, 0.001).name('Roughness');

  /**
   * Objects
   */
  const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
  sphere.position.y = 0.1;
  sphere.castShadow = true;

  const plane = new Mesh(
    new PlaneGeometry(5, 5),
    // new MeshBasicMaterial({ map: bakedShadow })
  );
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.5;

  const sphereShadow = new Mesh(
    new PlaneGeometry(1.5, 1.5),
    new MeshBasicMaterial({
      color: '#000',
      transparent: true,
      alphaMap: simpleShadow,
    }),
  );
  sphereShadow.rotation.x = -Math.PI * 0.5;
  sphereShadow.position.y = plane.position.y + 0.01;
  scene.add(sphere, plane, sphereShadow);

  const aspectRatio = sizes.width.value / sizes.height.value;

  /**
   * Camera
   */
  // Base camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(1, 1, 3);
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
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // Update objects
    sphere.position.x = Math.cos(elapsedTime * 3) * 1.5;
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
    sphere.position.z = Math.sin(elapsedTime * 3) * 1.5;

    sphereShadow.position.x = sphere.position.x;
    sphereShadow.position.z = sphere.position.z;
    sphereShadow.material.opacity = 1 - Math.abs(sphere.position.y);

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
  gui.destroy();
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
