<script setup lang="ts">
import {
  GridHelper,
  Group,
  Mesh,
  Vector3,
  DirectionalLight,
  ShaderMaterial,
  PointLight,
  PointLightHelper,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui';
import type { IThreeContext } from '~/types/three';

const threeContainer = ref();

const handleSceneReady = ({ scene }: IThreeContext) => {
  const gui = new GUI();

  // Loaders
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('/libs/');

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const sphere = new Group();
  const meshes: Array<{
    mesh: Mesh,
    light: PointLight,
    helper: PointLightHelper,
    isAnimated?: boolean
  }> = [];

  // Shaders
  const customMaterial = new ShaderMaterial({
    uniforms: {
      lightGroup: { value: 0 },
      lightColor: { value: new Vector3(0, 0.8, 0.6) },  // Convert hex color to RGB
      lightPosition: { value: new Vector3() },
    },
    vertexShader: /* glsl */`
varying vec3 vNormal;        // Нормаль, которую передадим во фрагментный шейдер
varying vec3 vWorldPosition; // Позиция в мировых координатах для фрагментного шейдера

void main() {
  // Преобразуем нормаль из локального пространства в пространство вида
  vNormal = normalMatrix * normal;

  // Вычисляем позицию вершины в мировых координатах
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;

  // Вычисляем финальную позицию вершины на экране
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
  `,
    fragmentShader: /* glsl */`
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    uniform int lightGroup;
    uniform vec3 lightColor;
    uniform vec3 lightPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      float diff = max(dot(normal, lightDir), 0.0);

      float distance = length(lightPosition + vWorldPosition);
      float attenuation = 1.0 / (1.0 + 0.01 * distance + 0.001 * distance * distance);

      vec3 finalColor = lightColor * diff * attenuation;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  });

  // Load and setup model
  gltfLoader.load('/sphere/Gltf8.gltf', (gltf) => {
    let i = 0;
    const quaternion = gltf.scene.quaternion;

    gltf.scene.rotation.z = Math.PI / 2;
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        const meshMaterial = customMaterial.clone();
        meshMaterial.uniforms = {
          lightGroup: { value: i },
          lightColor: { value: new Vector3(0, 0.8, 0.6) },
          lightPosition: { value: new Vector3() },
        };

        const rotatedPosition = new Vector3(child.position.z, child.position.x, child.position.y);
        child.position.copy(rotatedPosition);
        child.setRotationFromQuaternion(quaternion);
        child.material = meshMaterial;

        // Compute the bounding box of the mesh
        child.geometry.computeBoundingBox();
        const boundingBox = child.geometry.boundingBox;
        const boundingBoxSize = new Vector3();
        boundingBox.getSize(boundingBoxSize);

        const pointLight = new PointLight('#00CC99', 1, 100);
        pointLight.visible = false; // Hide actual light
        const pointLightHelper = new PointLightHelper(pointLight, 0.05);
        pointLightHelper.visible = true; // Explicitly set helper visible

        const lightPosition = rotatedPosition.clone();
        lightPosition.z += boundingBoxSize.z;

        // Set positions
        pointLight.position.copy(lightPosition);
        meshMaterial.uniforms.lightPosition.value.copy(lightPosition);

        const index = i; // Store current index before pushing
        meshes.push({
          mesh: child,
          light: pointLight,
          helper: pointLightHelper,
          isAnimated: false,
        });

        scene.add(pointLight);
        scene.add(pointLightHelper);

        gui.add({ animated: false }, 'animated')
          .name(`Animate ${index}`)
          .onChange((enabled: boolean) => {
            const meshData = meshes[index]; // Use stored index
            if (meshData) {
              meshData.isAnimated = enabled;
            }
          });

        i++;
      }
    });
    sphere.add(...meshes.map(({ mesh }) => mesh));
    scene.add(sphere);
  });
  // Animation
  if (threeContainer.value) {
    threeContainer.value.onTick((elapsedTime: number) => {
      meshes.forEach((meshData, index) => {
        // if (meshData.isAnimated) {
        const offset = (index / meshes.length) * Math.PI;
        const radius = 0.5;

        const originalY = meshData.light.position.y;

        const newPos = new Vector3(
          radius * Math.cos(elapsedTime + offset),
          originalY,  // Keep base X position
          radius * Math.sin(elapsedTime + offset),
        );

        meshData.light.position.copy(newPos);
        (meshData.mesh.material as ShaderMaterial).uniforms.lightPosition.value.copy(newPos);
        // }

        // scene.rotation.x = Math.sin(elapsedTime * 0.3);
        // scene.rotation.y = elapsedTime * 0.3;
        // scene.rotation.z = Math.cos(elapsedTime * 0.3);
      });
    });
  }

  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 0, 0);

  // Add grid helper
  const gridHelperX = new GridHelper(5, 5);
  const gridHelperY = new GridHelper(5, 5);
  const gridHelperZ = new GridHelper(5, 5);
  gridHelperY.rotation.z = Math.PI / 2;
  gridHelperZ.rotation.x = Math.PI / 2;
  scene.add(
    // gridHelperX,
    // gridHelperY,
    // gridHelperZ,
    directionalLight,
    sphere,
  );

  // Cleanup
  onUnmounted(() => {

  });
};
</script>

<template>
  <ThreeContainer
    ref="threeContainer"
    alpha
    :camera-position="[-5, 0, 0]"
    custom-animation
    @scene-ready="handleSceneReady"
  />
</template>

<style scoped lang="less" />