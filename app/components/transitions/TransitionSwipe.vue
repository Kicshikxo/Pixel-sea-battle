<template>
  <transition-group v-if="group" :name="`transition-swipe-${axis}-${speed}`" v-bind="{ appear }">
    <slot><!----></slot>
  </transition-group>
  <transition v-else :name="`transition-swipe-${axis}-${speed}`" :mode="mode" v-bind="{ appear }">
    <slot><!----></slot>
  </transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    axis?: 'x' | 'y'
    mode?: 'out-in' | 'in-out'
    speed?: 'fast' | 'normal' | 'slow'
    group?: boolean
    appear?: boolean
  }>(),
  {
    axis: 'y',
    mode: 'out-in',
    speed: 'normal',
    group: false,
    appear: false,
  },
)
</script>

<style lang="scss" scoped>
$axes: (
  x: translateX,
  y: translateY,
);
$speeds: (
  fast: var(--transition-time-fast),
  normal: var(--transition-time-normal),
  slow: var(--transition-time-slow),
);

@each $axis, $transform in $axes {
  @each $speed, $time in $speeds {
    $transition: '.transition-swipe-#{$axis}-#{$speed}';

    #{$transition}-enter-active,
    #{$transition}-leave-active,
    #{$transition}-move {
      transition:
        transform #{$time} cubic-bezier(0.175, 0.885, 0.32, 1.275),
        opacity #{$time} cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    #{$transition}-enter-from {
      opacity: 0;
      transform: #{$transform }(100%);
    }
    #{$transition}-leave-to {
      opacity: 0;
      transform: #{$transform }(-100%);
    }
  }
}
</style>
