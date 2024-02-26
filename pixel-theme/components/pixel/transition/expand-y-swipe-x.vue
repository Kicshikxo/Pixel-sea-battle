<template>
  <transition :class="[`px-transition-expand-swipe-x--${speed}`]" name="px-transition-expand-swipe-x" :mode="mode" @beforeEnter="beforeEnter" @enter="enter" @afterEnter="afterEnter" @beforeLeave="beforeLeave" @leave="leave">
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

const beforeEnter = (element: Element) => ((element as HTMLElement).style.height = '0')
const enter = (element: Element) => ((element as HTMLElement).style.height = `${element.scrollHeight}px`)
const afterEnter = (element: Element) => ((element as HTMLElement).style.height = '')
const beforeLeave = enter
const leave = beforeEnter
</script>

<style lang="scss">
.px-transition-expand-swipe-x {
  &--fast {
    --px-transition-time-expand-swipe-x: var(--px-transition-time-fast);
  }
  &--normal {
    --px-transition-time-expand-swipe-x: var(--px-transition-time-normal);
  }
  &--slow {
    --px-transition-time-expand-swipe-x: var(--px-transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition:
      height var(--px-transition-time-expand-swipe-x),
      transform var(--px-transition-time-expand-swipe-x),
      opacity var(--px-transition-time-expand-swipe-x);
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
