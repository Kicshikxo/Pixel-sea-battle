<template>
  <div :class="['px-shadow', `px-shadow--${color}`, { 'px-shadow--full-width': fullWidth }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    color?: 'dark' | 'light' | 'red' | 'yellow' | 'green' | 'blue'
    fullWidth?: boolean
  }>(),
  {
    color: 'dark',
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
.px-shadow {
  display: inline-flex;
  height: min-content;
  filter: drop-shadow(0.125em 0.125em 0 var(--px-color-shadow));
  transition: filter 0.125s;

  &--full-width {
    width: 100%;
  }

  &--dark {
    --px-color-shadow: var(--px-color-shadow-black);
  }
  &--light {
    --px-color-shadow: var(--px-color-shadow-white);
  }
  &--red {
    --px-color-shadow: var(--px-color-shadow-red);
  }
  &--yellow {
    --px-color-shadow: var(--px-color-shadow-yellow);
  }
  &--green {
    --px-color-shadow: var(--px-color-shadow-green);
  }
  &--blue {
    --px-color-shadow: var(--px-color-shadow-blue);
  }
}
</style>
