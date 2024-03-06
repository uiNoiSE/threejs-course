<script setup>
</script>

<template>
  <TresCanvas windowSize>
    <TresPerspectiveCamera :position="[0, 0, 3]"  />
    <TresAxesHelper />
    <TresGroup :scale="[1, 2, 1]" :rotation="[0, 1, 0]" :position="[0, 1, 0]">
      <TresMesh>
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshBasicMaterial color="red" />
      </TresMesh>
      <TresMesh :position="[-2, 0, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshBasicMaterial color="green" />
      </TresMesh>
      <TresMesh :position="[2, 0, 0]">
        <TresBoxGeometry :args="[1, 1, 1]" />
        <TresMeshBasicMaterial color="blue" />
      </TresMesh>
    </TresGroup>
  </TresCanvas>
</template>
