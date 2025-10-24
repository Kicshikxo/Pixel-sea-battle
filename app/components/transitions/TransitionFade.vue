<template>
  <transition name="transition-fade" :mode="mode" v-bind="{ appear }">
    <slot :class="`transition-fade--${speed}`"><!----></slot>
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
.transition-fade {
  &--fast {
    --transition-time-fade: var(--transition-time-fast);
  }
  &--normal {
    --transition-time-fade: var(--transition-time-normal);
  }
  &--slow {
    --transition-time-fade: var(--transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    transition: opacity var(--transition-time-fade);
  }

  &-enter-from {
    opacity: 0;
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
