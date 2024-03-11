<script setup>
const canvasWrap = ref();

onMounted(() => {
  window.addEventListener('dblclick', () => handleFullscreen(canvasWrap.value));
});
</script>

<template>
  <div ref="canvasWrap" :style="{ width: '70vw', height: '70vh'}">
    <TresCanvas ref="canvas">
      <TresPerspectiveCamera :position="[3, 3, 3]" :args="[75, 1, 0.1, 100]" />
      <OrbitControls />
      <Box>
        <TresMeshBasicMaterial color="red" />
      </Box>
    </TresCanvas>
  </div>
</template>
