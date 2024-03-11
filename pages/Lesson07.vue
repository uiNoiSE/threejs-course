<script setup>
</script>

<template>
  <TresCanvas windowSize>
    <TresPerspectiveCamera :position="[3, 3, 3]" :args="[75, 1, 0.1, 100]" />
    <OrbitControls />
    <Box>
      <TresMeshBasicMaterial color="red" />
    </Box>
  </TresCanvas>
</template>
