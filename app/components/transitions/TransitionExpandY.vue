<template>
  <transition
    name="transition-expand"
    :mode="mode"
    v-bind="{ appear }"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot :class="`transition-expand--${speed}`"><!----></slot>
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
.transition-expand {
  &--fast {
    --transition-time-expand: var(--transition-time-fast);
  }
  &--normal {
    --transition-time-expand: var(--transition-time-normal);
  }
  &--slow {
    --transition-time-expand: var(--transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition:
      height var(--transition-time-expand),
      opacity var(--transition-time-expand);
  }

  &-enter-from {
    opacity: 0;
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
