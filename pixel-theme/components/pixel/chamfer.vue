<template>
  <div :class="['px-chamfer', { 'px-chamfer--full-width': fullWidth }]" :style="{ '--px-chamfer-level': `${level}px` }">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    level?: string | number
    fullWidth?: boolean
  }>(),
  {
    level: 4,
    fullWidth: false,
  },
)
</script>

<style lang="scss" scoped>
.px-chamfer {
  display: inline-flex;
  height: min-content;
  clip-path: polygon(
    var(--px-chamfer-level) 0%,
    calc(100% - var(--px-chamfer-level)) 0%,
    calc(100% - var(--px-chamfer-level)) var(--px-chamfer-level),
    100% var(--px-chamfer-level),
    100% calc(100% - var(--px-chamfer-level)),
    calc(100% - var(--px-chamfer-level)) calc(100% - var(--px-chamfer-level)),
    calc(100% - var(--px-chamfer-level)) 100%,
    var(--px-chamfer-level) 100%,
    var(--px-chamfer-level) calc(100% - var(--px-chamfer-level)),
    0% calc(100% - var(--px-chamfer-level)),
    0% var(--px-chamfer-level),
    var(--px-chamfer-level) var(--px-chamfer-level)
  );

  &--full-width {
    width: 100%;
  }
}
</style>
