<template>
  <transition
    name="px-transition-expand-swipe-y"
    :mode="mode"
    :appear="appear"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot :class="`px-transition-expand-swipe-y--${speed}`"><!----></slot>
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

const beforeEnter = (element: Element) => ((element as HTMLElement).style.height = '0')
const enter = (element: Element) =>
  ((element as HTMLElement).style.height = `${element.scrollHeight}px`)
const afterEnter = (element: Element) => ((element as HTMLElement).style.height = '')
const beforeLeave = enter
const leave = beforeEnter
</script>

<style lang="scss">
.px-transition-expand-swipe-y {
  &--fast {
    --px-transition-time-expand-swipe-y: var(--px-transition-time-fast);
  }
  &--normal {
    --px-transition-time-expand-swipe-y: var(--px-transition-time-normal);
  }
  &--slow {
    --px-transition-time-expand-swipe-y: var(--px-transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition:
      height var(--px-transition-time-expand-swipe-y),
      transform var(--px-transition-time-expand-swipe-y),
      opacity var(--px-transition-time-expand-swipe-y);
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
