<template>
  <transition
    name="transition-expand-x"
    :mode="mode"
    v-bind="{ appear }"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot :class="`transition-expand-x--${speed}`"><!----></slot>
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

function getVisibleWidth(element: Element) {
  const maxWidth = parseFloat(getComputedStyle(element).maxWidth)

  if (isNaN(maxWidth) || maxWidth === 0 || maxWidth === Infinity) {
    return element.scrollWidth
  }

  return Math.min(element.scrollWidth, maxWidth)
}

const beforeEnter = (element: Element) => ((element as HTMLElement).style.width = '0')
const enter = (element: Element) =>
  ((element as HTMLElement).style.width = `${getVisibleWidth(element)}px`)
const afterEnter = (element: Element) => ((element as HTMLElement).style.width = '')
const beforeLeave = enter
const leave = beforeEnter
</script>

<style lang="scss">
.transition-expand-x {
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
      width var(--transition-time-expand),
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
