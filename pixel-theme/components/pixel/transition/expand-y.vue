<template>
  <transition :class="[`px-transition-expand--${speed}`]" name="px-transition-expand" :mode="mode" @beforeEnter="beforeEnter" @enter="enter" @afterEnter="afterEnter" @beforeLeave="beforeLeave" @leave="leave">
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
.px-transition-expand {
  &--fast {
    --px-transition-time-expand: var(--px-transition-time-fast);
  }
  &--normal {
    --px-transition-time-expand: var(--px-transition-time-normal);
  }
  &--slow {
    --px-transition-time-expand: var(--px-transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    overflow: hidden;
    transition:
      height var(--px-transition-time-expand),
      opacity var(--px-transition-time-expand);
  }

  &-enter-from {
    opacity: 0;
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
