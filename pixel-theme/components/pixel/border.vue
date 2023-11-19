<template>
  <pixel-shadow :color="color" :full-width="fullWidth">
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
    color?: 'dark' | 'light' | 'red' | 'yellow' | 'green' | 'blue'
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
  background: var(--px-color-border);
  padding: var(--px-border-width);
  transition: background 0.125s;

  &--full-width {
    width: 100%;
  }

  &--dark {
    --px-color-border: var(--px-color-black);
  }
  &--light {
    --px-color-border: var(--px-color-white);
  }
  &--red {
    --px-color-border: var(--px-color-red);
  }
  &--yellow {
    --px-color-border: var(--px-color-yellow);
  }
  &--green {
    --px-color-border: var(--px-color-green);
  }
  &--blue {
    --px-color-border: var(--px-color-blue);
  }
}
</style>
