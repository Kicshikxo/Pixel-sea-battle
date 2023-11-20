<template>
  <transition :class="[`px-transition-expand--${speed}`]" name="px-transition-expand" :mode="mode" @beforeEnter="beforeEnter" @enter="enter" @beforeLeave="beforeLeave" @leave="leave">
    <slot />
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

const beforeEnter = (element: HTMLElement) => (element.style.height = '0')
const beforeLeave = (element: HTMLElement) => (element.style.height = `${element.scrollHeight}px`)
const enter = beforeLeave
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
    transition: height var(--px-transition-time-expand), opacity var(--px-transition-time-expand);
  }

  &-enter-from {
    opacity: 0;
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
