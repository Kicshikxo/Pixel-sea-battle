<template>
  <transition :class="[`px-transition-swipe-y--${speed}`]" name="px-transition-swipe-y" :mode="mode">
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
.px-transition-swipe-y {
  &--fast {
    --px-transition-time-swipe-y: var(--px-transition-time-fast);
  }
  &--normal {
    --px-transition-time-swipe-y: var(--px-transition-time-normal);
  }
  &--slow {
    --px-transition-time-swipe-y: var(--px-transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    transition: transform var(--px-transition-time-swipe-y) cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity var(--px-transition-time-swipe-y) cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &-enter-from {
    opacity: 0;
    transform: translateY(100%);
  }
  &-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
