<template>
  <transition :class="[`px-transition-swipe-x--${speed}`]" name="px-transition-swipe-x" :mode="mode">
    <slot><!----></slot>
  </transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: 'out-in' | 'in-out'
    speed?: 'fast' | 'normal' | 'slow'
  }>(),
  {
    mode: 'out-in',
    speed: 'normal',
  },
)
</script>

<style lang="scss" scoped>
.px-transition-swipe-x {
  &--fast {
    --px-transition-time-swipe-x: var(--px-transition-time-fast);
  }
  &--normal {
    --px-transition-time-swipe-x: var(--px-transition-time-normal);
  }
  &--slow {
    --px-transition-time-swipe-x: var(--px-transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    transition: transform var(--px-transition-time-swipe-x) cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity var(--px-transition-time-swipe-x) cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  &-leave-to {
    opacity: 0;
    transform: translateX(-100%);
  }
}
</style>
