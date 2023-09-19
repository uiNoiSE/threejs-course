<!--suppress ALL -->
<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  AnimationMixer,
  Clock,
  ColorManagement,
  DirectionalLight,
  LinearSRGBColorSpace,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { useResize, useSizes } from '../mixins/global';
import Stats from 'stats.js';

// Base
ColorManagement.enabled = false;
const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);
const stats = new Stats();
const scene = new Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/libs/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Animations related
const mixer = ref(null);
const previousTime = ref(0);

onBeforeMount(() => {
  document.querySelector('html').style.backgroundColor = '#fff';
  document.body.appendChild(stats.dom);
  stats.showPanel(0);

  gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf) => {
    mixer.value = new AnimationMixer(gltf.scene);
    const action = mixer.value.clipAction(gltf.animations[1]);
    action.play();

    gltf.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(gltf.scene);
  });
});

onMounted(() => {
  // Canvas
  canvas.value = document.querySelector('canvas.three');

  // Scene
  window.addEventListener('resize', () => handleResize(camera, renderer));

  // gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) =>
  //   scene.add(gltf.scene.children[0])
  // );

  // gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  //   console.log(gltf);
  //   scene.add(gltf.scene);
  // });

  // gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (gltf) =>
  //   scene.add(gltf.scene.children[0]),
  // );

  /**
   * Floor
   */
  const floor = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshStandardMaterial({
      color: '#444444',
      metalness: 0,
      roughness: 0.5,
    }),
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /**
   * Lights
   */
  const ambientLight = new AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.camera.left = -7;
  directionalLight.shadow.camera.top = 7;
  directionalLight.shadow.camera.right = 7;
  directionalLight.shadow.camera.bottom = -7;
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  /**
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(2, 2, 2);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.target.set(0, 0.75, 0);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime.value;
    previousTime.value = elapsedTime;

    // Update mixer
    if (mixer.value) {
      mixer.value.update(deltaTime);
    }

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
