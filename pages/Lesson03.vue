<script setup lang="ts">
</script>

<template>
  <TresCanvas ref="canvas" window-size clearColor="#1b1b1f">
    <TresPerspectiveCamera
      :position="[0, 0, 3]"
      :look-at="[0, 0, 0]"
    />
    <TresMesh>
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshBasicMaterial color="red" />
    </TresMesh>
  </TresCanvas>
</template>
