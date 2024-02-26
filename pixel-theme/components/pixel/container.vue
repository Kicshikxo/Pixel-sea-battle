<template>
  <pixel-border :rainbow="rainbow" :full-width="fullWidth">
    <div :class="['px-container', { 'px-container--full-width': fullWidth }]">
      <slot />
    </div>
  </pixel-border>
</template>

<script setup lang="ts">
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
