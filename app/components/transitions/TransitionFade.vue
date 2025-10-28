<template>
  <transition-group v-if="group" :name="`transition-fade-${speed}`" v-bind="{ appear }">
    <slot><!----></slot>
  </transition-group>
  <transition v-else :name="`transition-fade-${speed}`" :mode="mode" v-bind="{ appear }">
    <slot><!----></slot>
  </transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: 'out-in' | 'in-out'
    speed?: 'fast' | 'normal' | 'slow'
    appear?: boolean
    group?: boolean
  }>(),
  {
    mode: 'out-in',
    speed: 'normal',
    appear: false,
    group: false,
  },
)
</script>

<style lang="scss" scoped>
$speeds: (
  fast: var(--transition-time-fast),
  normal: var(--transition-time-normal),
  slow: var(--transition-time-slow),
);

@each $speed, $time in $speeds {
  $transition: '.transition-fade-#{$speed}';

  #{$transition}-enter-active,
  #{$transition}-leave-active,
  #{$transition}-move {
    transition:
      width #{$time},
      height #{$time},
      opacity #{$time};
  }

  #{$transition}-enter-from,
  #{$transition}-leave-to {
    opacity: 0;
  }
}
</style>
