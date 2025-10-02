<template>
  <PixelBorder :rainbow="rainbow" :full-width="fullWidth">
    <div :class="['px-container', { 'px-container--full-width': fullWidth }]">
      <slot />
    </div>
  </PixelBorder>
</template>

<script setup lang="ts">
import PixelBorder from '~/components/pixel/PixelBorder.vue'

const props = withDefaults(
  defineProps<{
    rainbow?: boolean
    fullWidth?: boolean
  }>(),
  {
    rainbow: false,
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
.px-container {
  background: var(--px-color-dark);
  padding: 12px;

  &--full-width {
    width: 100%;
  }
}
</style>
