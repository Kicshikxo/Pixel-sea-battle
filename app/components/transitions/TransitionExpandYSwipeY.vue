<template>
  <transition
    name="transition-expand-y-swipe-y"
    :mode="mode"
    v-bind="{ appear }"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot :class="`transition-expand-y-swipe-y--${speed}`"><!----></slot>
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

function getVisibleHeight(element: Element) {
  const maxHeight = parseFloat(getComputedStyle(element).maxHeight)

  if (isNaN(maxHeight) || maxHeight === 0 || maxHeight === Infinity) {
    return element.scrollHeight
  }

  return Math.min(element.scrollHeight, maxHeight)
}

const beforeEnter = (element: Element) => ((element as HTMLElement).style.height = '0')
const enter = (element: Element) =>
  ((element as HTMLElement).style.height = `${getVisibleHeight(element)}px`)
const afterEnter = (element: Element) => ((element as HTMLElement).style.height = '')
const beforeLeave = enter
const leave = beforeEnter
</script>

<style lang="scss">
.transition-expand-y-swipe-y {
  &--fast {
    --transition-time-expand-swipe-y: var(--transition-time-fast);
  }
  &--normal {
    --transition-time-expand-swipe-y: var(--transition-time-normal);
  }
  &--slow {
    --transition-time-expand-swipe-y: var(--transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition:
      height var(--transition-time-expand-swipe-y),
      transform var(--transition-time-expand-swipe-y),
      opacity var(--transition-time-expand-swipe-y);
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
