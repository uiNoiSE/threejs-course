<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useResize, useSizes, handleMousemove } from '../mixins/global';
import gsap from 'gsap';
import GUI from 'lil-gui';
import { Power0 } from 'gsap';

const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);

onBeforeMount(() => {
  window.addEventListener('mousemove', (e) => handleMousemove(e));
});

onMounted(() => {
  const gui = new GUI();
  window.addEventListener('resize', () => handleResize(camera, renderer));
  canvas.value = document.querySelector('.three');
  const color = '#ff0000';

  const sceene = new Scene();
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({
    color,
    wireframe: false,
  });

  const mesh = new Mesh(geometry, material);
  sceene.add(mesh);
  const parameters = {
    color,
    spin: () => {
      gsap.to(mesh.rotation, {
        x: mesh.rotation.x + Math.PI / 8,
        y: mesh.rotation.y + Math.PI / 4,
        duration: 0.3,
      });
    },
    reset: () => {
      gsap.to(mesh.rotation, {
        x: 0,
        y: 0,
        duration: 1,
      });
      gsap.to(
        camera.position,
        {
          x: 0,
          y: 0,
          z: 3,
          duration: 1,
          ease: Power0,
        },
        '<'
      );
    },
  };

  const aspectRatio = sizes.width.value / sizes.height.value;

  // Camera
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 3);
  camera.lookAt(mesh.position);
  sceene.add(camera);

  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setClearColor('#242424');

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;

  // Animations
  const tick = () => {
    controls.update();

    // Render
    renderer.render(sceene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  // Debug
  gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation');

  gui.add(mesh, 'visible');

  gui.add(material, 'wireframe');

  gui.addColor(parameters, 'color').onChange(() => {
    material.color.set(parameters.color);
  });

  gui.add(parameters, 'spin');
  gui.add(parameters, 'reset');
});

onUnmounted(() => {
  canvas.value = null;
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
