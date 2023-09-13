<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {
  AmbientLight,
  BoxGeometry,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useResize, useSizes } from '../mixins/global';
import {
  World,
  SAPBroadphase,
  Material,
  ContactMaterial,
  Plane,
  Sphere,
  Body,
  Box,
  Vec3,
} from 'cannon-es';
import GUI from 'lil-gui';
import Stats from 'stats.js';

const handleResize = useResize();
const sizes = useSizes();
const oldElapsedTime = ref(0);
const props = {
  gravity: -9.8,
};

onBeforeMount(() => {
  document.querySelector('html').style.backgroundColor = '#000';
});

onMounted(() => {
  // Canvas
  const canvas = document.querySelector('canvas.three');
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

  /**
   * Base
   */
  window.addEventListener('resize', () => handleResize(camera, renderer));
  const gui = new GUI();

  // Scene
  const scene = new Scene();

  /**
   * Sounds
   */
  const hitSound = new Audio('/21/sounds/hit.mp3');

  const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();

    if (impactStrength > 1.5) {
      hitSound.volume = Math.random();
      hitSound.currentTime = 0;
      hitSound.play();
    }
  };

  /**
   * Textures
   */
  const cubeTextureLoader = new CubeTextureLoader();
  const environmentMapTexture = cubeTextureLoader.load([
    '/21/textures/environmentMaps/0/px.png',
    '/21/textures/environmentMaps/0/nx.png',
    '/21/textures/environmentMaps/0/py.png',
    '/21/textures/environmentMaps/0/ny.png',
    '/21/textures/environmentMaps/0/pz.png',
    '/21/textures/environmentMaps/0/nz.png',
  ]);

  /**
   * Physics
   */
  const world = new World();
  world.broadphase = new SAPBroadphase(world);
  world.allowSleep = true;
  world.gravity.set(0, props.gravity, 0);

  // Materials
  const defaultMaterial = new Material('default');
  const defaultContactMaterial = new ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    { friction: 0.1, restitution: 0.3 }
  );
  world.addContactMaterial(defaultContactMaterial);
  world.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new Plane();
  const floorBody = new Body({
    mass: 0,
    shape: floorShape,
    material: defaultMaterial,
    envMapIntensity: 0.5,
  });
  floorBody.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(floorBody);

  /**
   * Floor
   */
  const floor = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshStandardMaterial({
      color: '#777777',
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
      envMapIntensity: 0.5,
    })
  );
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /**
   * Lights
   */
  const ambientLight = new AmbientLight(0xffffff, 0.5);
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
  camera.position.set(-3, 3, 3);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.shadowMap.enabled = true;
  renderer.setSize(sizes.width.value, sizes.height.value);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /**
   * Utils
   */
  const objectsToUpdate = [];

  // Sphere
  const sphereGeometry = new SphereGeometry(1, 20, 20);
  const sphereMaterial = new MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  });

  const createSphere = (radius, position) => {
    const mesh = new Mesh(sphereGeometry, sphereMaterial);
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new Sphere(radius);
    const body = new Body({
      mass: 1,
      position: new Vec3(0, 3, 0),
      shape,
      material: defaultMaterial,
    });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    objectsToUpdate.push({
      mesh,
      body,
    });
  };

  // Box
  const boxGeometry = new BoxGeometry(1, 1, 1);
  const boxMaterial = new MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  });

  const createBox = (width, height, depth, position) => {
    const mesh = new Mesh(boxGeometry, boxMaterial);
    mesh.scale.set(width, height, depth);
    mesh.castShadow = true;
    mesh.position.copy(position);
    scene.add(mesh);

    const shape = new Box(
      new Vec3(width / 2, height / 2, depth / 2)
    );
    const body = new Body({
      mass: 1,
      position: new Vec3(0, 3, 0),
      shape,
      material: defaultMaterial,
    });
    body.position.copy(position);
    body.addEventListener('collide', playHitSound);
    world.addBody(body);

    objectsToUpdate.push({
      mesh,
      body,
    });
  };

  // Debug
  const debugObject = {
    createSphere: () =>
      createSphere(Math.random() * 0.5, {
        x: Math.random() * 3 - 0.5,
        y: 3,
        z: Math.random() * 3 - 0.5,
      }),
    createBox: () =>
      createBox(Math.random(), Math.random(), Math.random(), {
        x: Math.random() * 3 - 0.5 * 3,
        y: 3,
        z: Math.random() * 3 - 0.5 * 3,
      }),
    reset: () => {
      for (const object of objectsToUpdate) {
        // Remove body
        object.body.removeEventListener('collide', playHitSound);
        world.removeBody(object.body);

        // Remove mesh
        scene.remove(object.mesh);
      }

      objectsToUpdate.splice(0, objectsToUpdate.length);
    },
  };

  gui.add(world.gravity, 'y').min(-10).max(10).step(1).name('Gravity');
  gui.add(debugObject, 'createSphere').name('Create sphere');
  gui.add(debugObject, 'createBox').name('Create box');
  gui.add(debugObject, 'reset').name('Reset');

  /**
   * Animate
   */
  const clock = new Clock();

  const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime.value;
    oldElapsedTime.value = elapsedTime;

    // Update physics world
    world.step(1 / 60, deltaTime, 3);
    for (const object of objectsToUpdate) {
      object.mesh.position.copy(object.body.position);
      object.mesh.quaternion.copy(object.body.quaternion);
    }

    // Render
    controls.update();
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    stats.end();
  };

  tick();
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
