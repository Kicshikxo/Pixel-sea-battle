<template>
  <PixelShadow :color="color" :full-width="fullWidth" :full-height="fullHeight">
    <PixelChamfer :depth="depth" :full-width="fullWidth" :full-height="fullHeight">
      <div
        :class="[
          'px-border',
          `px-border--${color}`,
          {
            'px-border--full-width': fullWidth,
            'px-border--full-height': fullHeight,
            'px-border--rainbow': rainbow,
          },
        ]"
        :style="{ '--px-border-width': `${width}px` }"
      >
        <PixelChamfer :depth="depth" :full-width="fullWidth" :full-height="fullHeight">
          <slot />
        </PixelChamfer>
      </div>
    </PixelChamfer>
  </PixelShadow>
</template>

<script setup lang="ts">
import PixelChamfer from '~/components/pixel/PixelChamfer.vue'
import PixelShadow from '~/components/pixel/PixelShadow.vue'

const props = withDefaults(
  defineProps<{
    width?: string | number
    depth?: string | number
    color?: 'dark' | 'light' | 'red' | 'yellow' | 'green' | 'blue'
    rainbow?: boolean
    fullWidth?: boolean
    fullHeight?: boolean
  }>(),
  {
    width: 2,
    depth: 4,
    color: 'dark',
    rainbow: false,
    fullWidth: false,
    fullHeight: false,
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
  background-color: var(--px-color-border);
  padding: var(--px-border-width);
  transition: background-color var(--transition-time-fast);

  &--full-width {
    width: 100%;
  }
  &--full-height {
    height: 100%;
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

    animation: px-border--rainbow-spin calc(var(--transition-time-slow) * 10) linear infinite;
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
