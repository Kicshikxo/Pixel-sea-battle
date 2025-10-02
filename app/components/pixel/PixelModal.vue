<template>
  <teleport to="body">
    <div class="px-modal">
      <PixelContainer> 123 </PixelContainer>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import PixelContainer from '~/components/pixel/PixelContainer.vue'
</script>

<style lang="scss">
.px-modal {
  position: fixed;
}
</style>
