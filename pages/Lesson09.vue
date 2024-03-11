<script setup>
const count = 5000;
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}
</script>

<template>
  <TresCanvas windowSize>
    <TresPerspectiveCamera :position="1" :args="[75, 1, 0.1, 100]" />
    <OrbitControls />

    <TresLineSegments>
      <TresBufferGeometry :position="[positionsArray, 3]" />
      <TresMeshBasicMaterial color="red" />
    </TresLineSegments>
  </TresCanvas>
</template>
