<template>
  <pixel-border :full-width="fullWidth">
    <div :class="['px-container', { 'px-container--full-width': fullWidth }]">
      <slot />
    </div>
  </pixel-border>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    fullWidth?: boolean
  }>(),
  {
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
