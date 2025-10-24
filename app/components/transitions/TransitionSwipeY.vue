<template>
  <transition name="transition-swipe-y" :mode="mode" v-bind="{ appear }">
    <slot :class="`transition-swipe-y--${speed}`"><!----></slot>
  </transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: 'out-in' | 'in-out'
    speed?: 'fast' | 'normal' | 'slow'
    appear?: boolean
  }>(),
  {
    mode: 'out-in',
    speed: 'normal',
    appear: false,
  },
)
</script>

<style lang="scss" scoped>
.transition-swipe-y {
  &--fast {
    --transition-time-swipe-y: var(--transition-time-fast);
  }
  &--normal {
    --transition-time-swipe-y: var(--transition-time-normal);
  }
  &--slow {
    --transition-time-swipe-y: var(--transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    transition:
      transform var(--transition-time-swipe-y) cubic-bezier(0.175, 0.885, 0.32, 1.275),
      opacity var(--transition-time-swipe-y) cubic-bezier(0.175, 0.885, 0.32, 1.275);
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
