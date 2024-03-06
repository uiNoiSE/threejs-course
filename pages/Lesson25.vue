<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  LinearSRGBColorSpace,
  LinearToneMapping,
  Mesh,
  MeshStandardMaterial,
  NoToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  ReinhardToneMapping,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useResize, useSizes } from '../mixins/global';
import Stats from 'stats.js';
import GUI from 'lil-gui';

// Base
const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);
const stats = new Stats();
const scene = new Scene();
const gui = new GUI();
const debugObject = {
  envMapIntensity: 1,
};

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/libs/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const cubeTextureLoader = new CubeTextureLoader();

// Animations related
const mixer = ref(null);
const previousTime = ref(0);

onBeforeMount(() => {
  document.querySelector('html').style.backgroundColor = '#fff';
  document.body.appendChild(stats.dom);
  stats.showPanel(0);
});

onMounted(() => {
  // Canvas
  canvas.value = document.querySelector('canvas.three');

  // Scene
  window.addEventListener('resize', () => handleResize(camera, renderer));

  /**
   * Update all materials
   */
  const updateAllMaterials = () => scene.traverse((child) => {
    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
      // child.material.envMap = enviromentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const enviromentMap = cubeTextureLoader.load([
    '/25/environmentMaps/0/px.png',
    '/25/environmentMaps/0/nx.png',
    '/25/environmentMaps/0/py.png',
    '/25/environmentMaps/0/ny.png',
    '/25/environmentMaps/0/pz.png',
    '/25/environmentMaps/0/nz.png',
  ]);
  enviromentMap.colorSpace = 'srgb';
  scene.background = enviromentMap;
  scene.environment = enviromentMap;
  gui.add(debugObject, 'envMapIntensity', 0, 10, 0.001).onChange(updateAllMaterials);


  // Models
  gltfLoader.load('/models/hamburger.glb', (gltf) => {
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    gui.add(gltf.scene.rotation, 'y', -Math.PI, Math.PI, 0.001).name('Helmet rotation');
    updateAllMaterials();
  });

  /**
   * Lights
   */

  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(-1.3, 2, 4);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.far = 10;
  directionalLight.shadow.mapSize.set(1024, 1024);
  directionalLight.shadow.normalBias = 0.015;
  scene.add(directionalLight);

  // const directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
  // scene.add(directionalLightCameraHelper);

  /**
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(3, 3, 3);
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
    antialias: true,
  });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = 'srgb';
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 3;

  gui.add(directionalLight, 'intensity', 0, 10, 0.001).name('Light intensity');
  gui.add(directionalLight.position, 'x', -5, 5, 0.001).name('Light pos.X');
  gui.add(directionalLight.position, 'y', -5, 10, 0.001).name('Light pos.Y');
  gui.add(directionalLight.position, 'z', -5, 5, 0.001).name('Light pos.Z');
  gui.add(renderer, 'toneMapping', {
    No: NoToneMapping,
    Linear: LinearToneMapping,
    Reinhard: ReinhardToneMapping,
    Cineon: CineonToneMapping,
    ACESFilmic: ACESFilmicToneMapping,
  });
  gui.add(renderer, 'toneMappingExposure', 0, 3, 0.001);

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
  <canvas class="three" />
</template>
