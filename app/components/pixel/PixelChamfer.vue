<template>
  <div
    :class="[
      'px-chamfer',
      { 'px-chamfer--full-width': fullWidth, 'px-chamfer--full-height': fullHeight },
    ]"
    :style="{ '--px-chamfer-depth': `${depth}px` }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    depth?: string | number
    fullWidth?: boolean
    fullHeight?: boolean
  }>(),
  {
    depth: 4,
    fullWidth: false,
    fullHeight: false,
  },
)
</script>

<style lang="scss" scoped>
.px-chamfer {
  display: inline-flex;
  height: min-content;
  clip-path: polygon(
    var(--px-chamfer-depth) 0%,
    calc(100% - var(--px-chamfer-depth)) 0%,
    calc(100% - var(--px-chamfer-depth)) var(--px-chamfer-depth),
    100% var(--px-chamfer-depth),
    100% calc(100% - var(--px-chamfer-depth)),
    calc(100% - var(--px-chamfer-depth)) calc(100% - var(--px-chamfer-depth)),
    calc(100% - var(--px-chamfer-depth)) 100%,
    var(--px-chamfer-depth) 100%,
    var(--px-chamfer-depth) calc(100% - var(--px-chamfer-depth)),
    0% calc(100% - var(--px-chamfer-depth)),
    0% var(--px-chamfer-depth),
    var(--px-chamfer-depth) var(--px-chamfer-depth)
  );

  &--full-width {
    width: 100%;
  }
  &--full-height {
    height: 100%;
  }
}
</style>
