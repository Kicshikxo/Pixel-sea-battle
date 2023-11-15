<template>
  <div :class="['px-shadow', { 'px-shadow--full-width': fullWidth }]">
    <slot />
  </div>
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
.px-shadow {
  display: inline-flex;
  height: min-content;
  filter: drop-shadow(0.125em 0.125em 0 #0004);

  &--full-width {
    width: 100%;
  }
}
</style>
