<script setup>
import { onMounted } from 'vue';
import {
  AxesHelper,
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';

onMounted(() => {
  const sceene = new Scene();

  /*
  Objects
  */
  const group = new Group();
  group.position.y = 1;
  group.scale.y = 2;
  group.rotation.y = 1;
  sceene.add(group);

  const cube1 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 'red' })
  );

  const cube2 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 'green' })
  );
  cube2.position.x = -2

  const cube3 = new Mesh(
    new BoxGeometry(1, 1, 1),
    new MeshBasicMaterial({ color: 'blue' })
  );
  cube3.position.x = 2

  group.add(cube1, cube2, cube3);

  // const geometry = new BoxGeometry(1, 1, 1);
  // const material = new MeshBasicMaterial({ color: 'red' });
  // const mesh = new Mesh(geometry, material);
  // sceene.add(mesh);

  // // Scale
  // mesh.scale.set(2, 0.5, 0.5);

  // // Rotation
  // mesh.rotation.reorder('YXZ')
  // mesh.rotation.x = Math.PI * 0.25;
  // mesh.rotation.y = Math.PI * 0.25;

  //   // Positioning
  // // mesh.position.x = 0.7;
  // // mesh.position.y = -0.6;
  // // mesh.position.z = 1;
  // // mesh.position.normalize(); // turns any axis value to 1
  // mesh.position.set(0.7, -0.6, 1);

  const sizes = {
    width: 800,
    height: 600,
  };

  const axesHelper = new AxesHelper();
  sceene.add(axesHelper);

  // Camera
  const aspectRatio = () => sizes.width / sizes.height;
  const camera = new PerspectiveCamera(75, aspectRatio());
  camera.position.set(0, 0, 3);
  sceene.add(camera);
  // camera.lookAt(mesh.position);

  const canvas = document.querySelector('.three');
  const renderer = new WebGLRenderer({
    canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(sceene, camera);
});
</script>

<template>
  <canvas class="three"></canvas>
</template>
