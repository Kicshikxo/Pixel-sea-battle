<template>
  <transition :class="[`px-transition-fade--${speed}`]" name="px-transition-fade" :mode="mode">
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
</script>

<style lang="scss" scoped>
.px-transition-fade {
  &--fast {
    --px-transition-time-fade: var(--px-transition-time-fast);
  }
  &--normal {
    --px-transition-time-fade: var(--px-transition-time-normal);
  }
  &--slow {
    --px-transition-time-fade: var(--px-transition-time-slow);
  }

  &-enter-active,
  &-leave-active {
    transition: opacity var(--px-transition-time-fade);
  }

  &-enter-from {
    opacity: 0;
  }
  &-leave-to {
    opacity: 0;
  }
}
</style>
