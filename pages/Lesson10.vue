<script setup lang="ts">
import { BoxGeometry, GridHelper, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useResize, useSizes } from '~/utils/global';
import gsap, { Power0 } from 'gsap';
import GUI from 'lil-gui';

const canvas = ref<HTMLCanvasElement>();
const handleResize = useResize();
const sizes = useSizes();

const color = '#ff0000';
const scene = new Scene();

// Helpers
const gui = new GUI();
const gridHelper = new GridHelper(5, 5);
gridHelper.position.y = -0.5;

// Mesh
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
  color,
  wireframe: false,
});
const mesh = new Mesh(geometry, material);

// Camera
const aspectRatio = sizes.width.value / sizes.height.value;
const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
camera.position.set(0, 0, 3);
camera.lookAt(mesh.position);

// Debug
const tl = gsap.timeline();
const parameters = {
  color,
  spin: () => {
    tl.to(mesh.rotation, {
      x: mesh.rotation.x + Math.PI / 4,
      y: mesh.rotation.y + Math.PI / 4,
      duration: 0.3,
    });
  },
  reset: () => {
    tl.to(mesh.rotation, {
      x: 0,
      y: 0,
      duration: 1,
    });
    tl.to(mesh.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
    }, '<');
    tl.to(camera.position, {
      x: 0,
      y: 0,
      z: 3,
      duration: 1,
      ease: Power0,
    }, '<');
  },
};
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('Elevation');
gui.add(mesh, 'visible');
gui.add(material, 'wireframe');
gui.addColor(parameters, 'color')
  .onChange(() => {
    material.color.set(parameters.color);
  });
gui.add(parameters, 'spin');
gui.add(parameters, 'reset');

onMounted(() => {
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setClearColor('#242424');

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;
  controls.minDistance = 2;
  controls.maxDistance = 5;

  // Animations
  const tick = () => {
    controls.update();

    // Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  scene.add(gridHelper, mesh, camera);
  window.addEventListener('resize', () => handleResize(camera, renderer));
});

onUnmounted(() => {
  gui.destroy();
})
</script>

<template>
  <canvas ref="canvas" />
</template>
