<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  BoxGeometry,
  Clock,
  ConeGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Fog,
  Group,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RepeatWrapping,
  Scene,
  SphereGeometry,
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

  // Fog
  scene.fog = new Fog('#262837', 2, 16);

  /**
   * Textures
   */
  const textureLoader = new TextureLoader();
  const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
  const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
  const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
  const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
  const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
  const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
  const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

  const bricksColorTexture = textureLoader.load('/17/bricks/color.jpg');
  const bricksAmbientOcclusionTexture = textureLoader.load('/17/bricks/ambientOcclusion.jpg');
  const bricksNormalTexture = textureLoader.load('/17/bricks/normal.jpg');
  const bricksRoughnessTexture = textureLoader.load('/17/bricks/roughness.jpg');

  const grassColorTexture = textureLoader.load('/17/grass/color.jpg');
  const grassAmbientOcclusionTexture = textureLoader.load('/17/grass/ambientOcclusion.jpg');
  const grassNormalTexture = textureLoader.load('/17/grass/normal.jpg');
  const grassRoughnessTexture = textureLoader.load('/17/grass/roughness.jpg');

  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = RepeatWrapping;
  grassNormalTexture.wrapS = RepeatWrapping;
  grassRoughnessTexture.wrapS = RepeatWrapping;

  grassColorTexture.wrapT = RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = RepeatWrapping;
  grassNormalTexture.wrapT = RepeatWrapping;
  grassRoughnessTexture.wrapT = RepeatWrapping;

  /**
   * House
   */
  const house = new Group();
  scene.add(house);

  // Walls
  const walls = new Mesh(
    new BoxGeometry(4, 2.5, 4),
    new MeshStandardMaterial({
      map: bricksColorTexture,
      transparent: true,
      aoMap: bricksAmbientOcclusionTexture,
      normalMap: bricksNormalTexture,
      roughnessMap: bricksRoughnessTexture,
    }),
  );
  walls.geometry.setAttribute('uv2', new Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
  walls.position.y = 2.5 / 2;
  house.add(walls);

  // Roof
  const roof = new Mesh(new ConeGeometry(3.5, 1, 4), new MeshStandardMaterial({ color: '#b35f45' }));
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 3;
  house.add(roof);

  // Door
  const door = new Mesh(
    new PlaneGeometry(2.2, 2.2, 100, 100),
    new MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.1,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    }),
  );
  door.geometry.setAttribute('uv2', new Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
  door.position.z = 2 + 0.01;
  door.position.y = 1;
  house.add(door);

  // Bushes
  const bushGeometry = new SphereGeometry(1, 16, 16);
  const bushMaterial = new MeshStandardMaterial({ color: '#89c854' });

  const bush1 = new Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.position.set(0.8, 0.2, 2.2);

  const bush2 = new Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.position.set(1.4, 0.1, 2.1);

  const bush3 = new Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.position.set(-0.8, 0.1, 2.2);

  const bush4 = new Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.position.set(-1, 0.05, 2.6);

  house.add(bush1, bush2, bush3, bush4);

  /**
   * Graves
   */
  const graves = new Group();
  scene.add(graves);

  const gravesGeometry = new BoxGeometry(0.6, 0.8, 0.2);
  const gravesMaterial = new MeshStandardMaterial({ color: '#b2b6b1' });

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    const grave = new Mesh(gravesGeometry, gravesMaterial);
    grave.castShadow = true;
    grave.position.set(x, 0.3, z);
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    graves.add(grave);
  }

  // Floor
  const floor = new Mesh(
    new PlaneGeometry(20, 20),
    new MeshStandardMaterial({
      map: grassColorTexture,
      transparent: true,
      aoMap: grassAmbientOcclusionTexture,
      normalMap: grassNormalTexture,
      roughnessMap: grassRoughnessTexture,
    }),
  );
  floor.receiveShadow = true;
  floor.geometry.setAttribute('uv2', new Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0;
  scene.add(floor);

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new AmbientLight('#b9d5ff', 0.22);
  gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const moonLight = new DirectionalLight('#b9d5ff', 0.22);
  moonLight.position.set(4, 5, -2);
  gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
  gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
  gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
  gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
  scene.add(moonLight);

  const doorLight = new PointLight('#ff7d46');
  doorLight.position.set(0, 2.2, 2.7);
  house.add(doorLight);

  // Ghosts
  const ghost1 = new PointLight('#ff00ff', 2, 3);
  const ghost2 = new PointLight('#00ffff', 2, 3);
  const ghost3 = new PointLight('#ffff00', 2, 3);
  scene.add(ghost1, ghost2, ghost3);

  /**
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;

  // Base camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(4, 2, 5);
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

  // Shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  moonLight.castShadow = true;

  doorLight.castShadow = true;
  doorLight.shadow.mapSize.width = 256;
  doorLight.shadow.mapSize.height = 256;
  doorLight.shadow.camera.far = 7;

  ghost1.castShadow = true;
  ghost1.shadow.mapSize.width = 256;
  ghost1.shadow.mapSize.height = 256;
  ghost1.shadow.camera.far = 7;
  ghost2.castShadow = true;
  ghost2.shadow.mapSize.width = 256;
  ghost2.shadow.mapSize.height = 256;
  ghost2.shadow.camera.far = 7;
  ghost3.castShadow = true;
  ghost3.shadow.mapSize.width = 256;
  ghost3.shadow.mapSize.height = 256;
  ghost3.shadow.camera.far = 7;

  walls.castShadow = true;
  bush1.castShadow = true;
  bush2.castShadow = true;
  bush3.castShadow = true;
  bush4.castShadow = true;

  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor('#262837');

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Ghosts animation
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(ghost1Angle * 3);
    ghost1.position.z = Math.sin(ghost1Angle) * 4;

    const ghost2Angle = -(elapsedTime * 0.32);
    ghost2.position.x = Math.cos(ghost2Angle) * 6;
    ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5);
    ghost2.position.z = Math.sin(ghost2Angle) * 6;

    const ghost3Angle = -(elapsedTime * 0.18);
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 0.5);
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));

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
