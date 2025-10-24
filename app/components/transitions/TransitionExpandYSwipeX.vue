<template>
  <transition
    name="transition-expand-swipe-x"
    :mode="mode"
    v-bind="{ appear }"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot :class="`transition-expand-swipe-x--${speed}`"><!----></slot>
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
.transition-expand-swipe-x {
  &--fast {
    --transition-time-expand-swipe-x: var(--transition-time-fast);
  }
  &--normal {
    --transition-time-expand-swipe-x: var(--transition-time-normal);
  }
  &--slow {
    --transition-time-expand-swipe-x: var(--transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition:
      height var(--transition-time-expand-swipe-x),
      transform var(--transition-time-expand-swipe-x),
      opacity var(--transition-time-expand-swipe-x);
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
