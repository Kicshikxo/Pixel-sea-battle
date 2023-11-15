<template>
  <pixel-shadow :full-width="fullWidth">
    <pixel-chamfer :level="level" :full-width="fullWidth">
      <div :class="['px-border', `px-border--${color}`, { 'px-border--full-width': fullWidth }]" :style="{ '--px-border-width': `${width}px` }">
        <pixel-chamfer :level="level" :full-width="fullWidth">
          <slot />
        </pixel-chamfer>
      </div>
    </pixel-chamfer>
  </pixel-shadow>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: string | number
    level?: string | number
    color?: 'dark' | 'light' | 'red' | 'green' | 'blue'
    fullWidth?: boolean
  }>(),
  {
    width: 2,
    level: 4,
    color: 'dark',
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
.px-border {
  display: inline-flex;
  background: var(--px-border-color);
  padding: var(--px-border-width);

  &--full-width {
    width: 100%;
  }

  &--dark {
    --px-border-color: var(--px-color-black);
  }
  &--light {
    --px-border-color: var(--px-color-white);
  }
  &--red {
    --px-border-color: var(--px-color-red);
  }
  &--green {
    --px-border-color: var(--px-color-green);
  }
  &--blue {
    --px-border-color: var(--px-color-blue);
  }
}
</style>
