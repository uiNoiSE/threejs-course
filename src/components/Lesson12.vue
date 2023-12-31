<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  BufferAttribute,
  Clock,
  CubeTextureLoader,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  TextureLoader,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { handleMousemove, useResize } from '../mixins/global';
import GUI from 'lil-gui';

const handleResize = useResize();
const canvas = ref(null);

onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => handleMousemove(e));
  window.addEventListener('resize', () => handleResize(camera, renderer));
});

onMounted(() => {
  /**
   * Base
   */
  // Debug
  const gui = new GUI();

  // Textures
  const textureLoader = new TextureLoader();
  const cubeTextureLoader = new CubeTextureLoader();

  const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
  const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
  const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
  const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
  const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
  const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
  const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
  // const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
  // const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');

  const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
  ]);

  // Canvas
  const canvas = document.querySelector('canvas.three');

  // Scene
  const scene = new Scene();

  /**
   * Lights
   */
  const ambientLight = new AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const light = new PointLight(0xffffff, 0.5);
  light.position.x = 2;
  light.position.y = 3;
  light.position.z = 4;
  scene.add(light);

  /**
   * Objects
   */
  // const material = new MeshBasicMaterial()
  // material.map = doorColorTexture
  // material.color = new Color('#ff0000')
  // material.wireframe = true
  // material.transparent = true
  // material.opacity = 0.5
  // material.alphaMap = doorAlphaTexture
  // material.side = DoubleSide
  // material.flatShading = true

  // const material = new MeshNormalMaterial()
  // material.flatShading = true

  // const material = new MeshMatcapMaterial()
  // material.matcap = matcapTexture

  // const material = new MeshDepthMaterial()

  // const material = new MeshLambertMaterial()

  // const material = new MeshPhongMaterial()
  // material.shininess = 100
  // material.specular = new Color(0x1188ff)

  // const material = new MeshToonMaterial()
  // gradientTexture.generateMipmaps = false
  // gradientTexture.minFilter = NearestFilter
  // gradientTexture.magFilter = NearestFilter
  // material.gradientMap = gradientTexture

  // const material = new MeshStandardMaterial()
  // material.metalness = 0
  // material.roughness = 1
  // gui.add(material, 'metalness').min(0).max(1).step(0.0001)
  // gui.add(material, 'roughness').min(0).max(1).step(0.0001)
  // material.map = doorColorTexture
  // material.aoMap = doorAmbientOcclusionTexture
  // material.aoMapIntensity = 1
  // material.displacementMap = doorHeightTexture
  // material.displacementScale = 0.05
  // material.metalnessMap = doorMetalnessTexture
  // material.roughnessMap = doorRoughnessTexture
  // material.normalMap = doorNormalTexture
  // material.normalScale.set(0.5, 0.5)
  // material.transparent = true
  // material.alphaMap = doorAlphaTexture

  const material = new MeshPhysicalMaterial();
  material.metalness = 0;
  material.roughness = 1;
  gui.add(material, 'metalness').min(0).max(1).step(0.0001);
  gui.add(material, 'roughness').min(0).max(1).step(0.0001);
  material.map = doorColorTexture;
  material.aoMap = doorAmbientOcclusionTexture;
  material.aoMapIntensity = 1;
  material.displacementMap = doorHeightTexture;
  material.displacementScale = 0.05;
  material.metalnessMap = doorMetalnessTexture;
  material.roughnessMap = doorRoughnessTexture;
  material.normalMap = doorNormalTexture;
  material.normalScale.set(0.5, 0.5);
  material.transparent = true;
  material.alphaMap = doorAlphaTexture;
  material.clearcoat = 1;
  material.clearcoatRoughness = 0;

  // const material = new MeshStandardMaterial()
  // material.metalness = 0.7
  // material.roughness = 0.2
  gui.add(material, 'metalness').min(0).max(1).step(0.0001);
  gui.add(material, 'roughness').min(0).max(1).step(0.0001);
  material.envMap = environmentMapTexture;

  const sphere = new Mesh(new SphereGeometry(0.5, 64, 64), material);
  sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2));
  sphere.position.x = -1.5;

  const plane = new Mesh(new PlaneGeometry(1, 1, 100, 100), material);
  plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2));

  const torus = new Mesh(new TorusGeometry(0.3, 0.2, 64, 128), material);
  torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2));
  torus.position.x = 1.5;
  scene.add(sphere, plane, torus);

  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * Camera
   */
  // Base camera
  const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
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
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;

    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
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
  gui.destroy();
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
