<template>
  <pixel-shadow :color="color" :full-width="fullWidth">
    <pixel-chamfer :level="level" :full-width="fullWidth">
      <div :class="['px-border', `px-border--${color}`, { 'px-border--full-width': fullWidth, 'px-border--rainbow': rainbow }]" :style="{ '--px-border-width': `${width}px` }">
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
    rainbow?: boolean
    fullWidth?: boolean
  }>(),
  {
    width: 2,
    level: 4,
    color: 'dark',
    rainbow: false,
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
@property --px-border-rainbow-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
.px-border {
  display: inline-flex;
  background: var(--px-color-border);
  padding: var(--px-border-width);
  transition: background var(--px-transition-time-fast);

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

  &--rainbow {
    --px-border-rainbow-angle: 135deg;
    --px-color-border: linear-gradient(
      var(--px-border-rainbow-angle),
      hsl(0, 100%, 50%),
      hsl(30, 100%, 50%),
      hsl(60, 100%, 50%),
      hsl(90, 100%, 50%),
      hsl(120, 100%, 50%),
      hsl(150, 100%, 50%),
      hsl(180, 100%, 50%),
      hsl(210, 100%, 50%),
      hsl(240, 100%, 50%),
      hsl(270, 100%, 50%),
      hsl(300, 100%, 50%),
      hsl(330, 100%, 50%),
      hsl(360, 100%, 50%)
    );

    animation: px-border--rainbow-spin calc(var(--px-transition-time-slow) * 10) linear infinite;
    @keyframes px-border--rainbow-spin {
      from {
        --px-border-rainbow-angle: 0deg;
      }
      to {
        --px-border-rainbow-angle: 360deg;
      }
    }
  }
}
</style>
