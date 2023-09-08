<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  ConeGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshToonMaterial,
  NearestFilter,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three';
import { useResize, useSizes } from '../mixins/global';
import gsap from 'gsap';
import GUI from 'lil-gui';

const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);
const currentSection = ref(0);
const scrollY = ref(0);
const cursor = ref({
  x: 0,
  y: 0,
});
const lastFrameTime = ref(0);

onBeforeMount(() => {
  document.querySelector('html').style.backgroundColor = '#1e1a20';
});

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    cursor.value.x = e.clientX / sizes.width.value - 0.5;
    cursor.value.y = e.clientY / sizes.height.value - 0.5;
  });
  window.addEventListener('scroll', () => {
    scrollY.value = window.scrollY;

    const newSection = Math.round(scrollY.value / sizes.height.value);

    if (newSection !== currentSection.value) {
      currentSection.value = newSection;

      gsap.to(sectionMeshes[currentSection.value].rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5',
      });
    }
  });

  /**
   * Base
   */
  window.addEventListener('resize', () => handleResize(camera, renderer));
  const gui = new GUI();

  const parameters = {
    materialColor: '#ffeded',
  };

  gui.addColor(parameters, 'materialColor').onChange(() => {
    material.color.set(parameters.materialColor);
    particlesMaterial.color.set(parameters.materialColor);
  });

  // Canvas
  const canvas = document.querySelector('canvas.three');

  // Scene
  const scene = new Scene();

  // Textures
  const textureLoader = new TextureLoader();
  const gradientTexture = textureLoader.load('/20/images/5.jpg');

  /**
   * Objects
   */
  const material = new MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
  });
  gradientTexture.magFilter = NearestFilter;
  const objectDistance = 6;
  const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), material);
  const mesh2 = new Mesh(new ConeGeometry(1, 2, 32), material);
  const mesh3 = new Mesh(new TorusKnotGeometry(0.8, 0.35, 100, 16), material);

  mesh2.position.y = -objectDistance * 1;
  mesh3.position.y = -objectDistance * 2;

  mesh1.position.x = 2;
  mesh2.position.x = -2;
  mesh3.position.x = 2;
  scene.add(mesh1, mesh2, mesh3);

  const sectionMeshes = [mesh1, mesh2, mesh3];

  /**
   * Particles
   */
  const particlesCount = 1000;
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] =
      objectDistance * 0.4 -
      Math.random() * objectDistance * sectionMeshes.length;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const particlesGeometry = new BufferGeometry();
  particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3));

  // Material
  const particlesMaterial = new PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.005,
  });

  // Points
  const particles = new Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  /**
   * Lights
   */
  const directionalLight = new DirectionalLight('#fff', 1);
  directionalLight.position.set(1, 1, 0);
  scene.add(directionalLight);

  /**
   * Camera
   */
  const cameraGroup = new Group();
  scene.add(cameraGroup);
  const aspectRatio = sizes.width.value / sizes.height.value;

  // Base camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, window.innerWidth < 425 ? 6 : 3);
  cameraGroup.add(camera);

  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas,
    alpha: true,
  });

  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - lastFrameTime.value;
    lastFrameTime.value = elapsedTime;

    // Animations
    for (const mesh of sectionMeshes) {
      mesh.rotation.x = elapsedTime * 0.1;
      mesh.rotation.y = elapsedTime * 0.12;
    }
    camera.position.y = (-scrollY.value / sizes.height.value) * objectDistance;
    cameraGroup.position.x +=
      (cursor.value.x - cameraGroup.position.x) * 2.5 * deltaTime;
    cameraGroup.position.y +=
      (-cursor.value.y - cameraGroup.position.y) * 2.5 * deltaTime;

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
  <div class="container">
    <section class="section">
      <h1>My Portfolio</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
  </div>

  <canvas class="three"></canvas>
</template>

<style lang="less" scoped>
h1,
h2 {
  flex-wrap: nowrap;
  font-size: 38px;

  @media @tablet {
    font-size: 64px;
  }

  @media @desktop {
    font-size: 72px;
  }
}

.section {
  position: relative;
  z-index: 1;
  height: 100vh;
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-family: sans-serif;
  font-size: 7vmin;
  text-transform: uppercase;
  color: #ffeded;
}

section:nth-child(even) {
  justify-content: flex-end;
}
</style>
