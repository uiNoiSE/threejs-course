<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { useResize, useSizes } from '../mixins/global';
import Stats from 'stats.js';

// Base
const handleResize = useResize();
const sizes = useSizes();
const canvas = ref(null);
const stats = new Stats();
const scene = new Scene();
const previousTime = ref(0);

let model = null;
let currentIntersect = null;

const dracoLoader = new DRACOLoader();
const gltfLoader = new GLTFLoader();

onBeforeMount(() => {
  document.body.appendChild(stats.dom);
  stats.showPanel(0);

  /*
   * Model
   */
  dracoLoader.setDecoderPath('/libs/');
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf) => {
    model = gltf.scene;
    model.position.y = -1.2;
    scene.add(model);
  });
});

onMounted(() => {
  // Canvas
  canvas.value = document.querySelector('canvas.three');

  // Scene
  window.addEventListener('resize', () => handleResize(camera, renderer));

  /*
   * Objects
   */
  const object1 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: '#ff0000' }));
  const object2 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: '#ff0000' }));
  const object3 = new Mesh(new SphereGeometry(0.5, 16, 16), new MeshBasicMaterial({ color: '#ff0000' }));
  object1.position.x = -2;
  object3.position.x = 2;

  scene.add(object1, object2, object3);

  /*
   * Mouse
   */
  const mouse = new Vector2();
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width.value) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height.value) * 2 + 1;
  });

  window.addEventListener('click', () => {
    if (currentIntersect) {
      switch (currentIntersect.object) {
        case object1:
          console.log('click on object1');
          break;
        case object2:
          console.log('click on object2');
          break;
        case object3:
          console.log('click on object3');
          break;
      }
    }
  });

  const raycaster = new Raycaster();

  /*
   * Camera
   */
  const aspectRatio = sizes.width.value / sizes.height.value;
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
  camera.position.set(0, 0, 3);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas.value);
  controls.enableDamping = true;

  /*
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /*
   * Lights
   */
  const ambientLight = new AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);

  /*
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime.value;
    previousTime.value = elapsedTime;

    object1.position.y = Math.abs(Math.sin(elapsedTime + 0.2 - deltaTime) * 2.5);
    object2.position.y = Math.abs(Math.sin(elapsedTime + 0.4 - deltaTime) * 2.5);
    object3.position.y = Math.abs(Math.sin(elapsedTime + 0.6 - deltaTime) * 2.5);

    /*
     * Raycaster
     */
    raycaster.setFromCamera(mouse, camera);

    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);

    const regularColor = new Color('#ff0000');
    const intersectColor = new Color('#0000ff');

    for (const object of objectsToTest) {
      gsap.to(object.material.color, {
        duration: 0.5,
        r: regularColor.r,
        g: regularColor.g,
        b: regularColor.b,
        ease: 'sine.inOut',
      });
    }

    for (const intersect of intersects) {
      gsap.to(intersect.object.material.color, {
        duration: 0.5,
        r: intersectColor.r,
        g: intersectColor.g,
        b: intersectColor.b,
        ease: 'sine.inOut',
      });
    }

    if (intersects.length) {
      currentIntersect = intersects[0];
    } else {
      currentIntersect = null;
    }

    if (model) {
      const modelIntersects = raycaster.intersectObject(model);

      if (modelIntersects.length) {
        gsap.to(model.scale, {
          duration: 0.05,
          x: 1.2,
          y: 1.2,
          z: 1.2,
          ease: 'power4.inOut',
        });
      } else {
        gsap.to(model.scale, {
          duration: 0.05,
          x: 1,
          y: 1,
          z: 1,
          ease: 'power4.inOut',
        });
      }
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
