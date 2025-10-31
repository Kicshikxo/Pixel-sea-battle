<template>
  <TransitionGroup
    v-if="group"
    :name="`transition-expand-${axis}-${speed}`"
    v-bind="{ appear }"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot><!----></slot>
  </TransitionGroup>
  <Transition
    v-else
    :name="`transition-expand-${axis}-${speed}`"
    :mode="mode"
    v-bind="{ appear }"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @beforeLeave="beforeLeave"
    @leave="leave"
  >
    <slot><!----></slot>
  </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    axis?: 'x' | 'y'
    mode?: 'out-in' | 'in-out'
    speed?: 'fast' | 'normal' | 'slow'
    group?: boolean
    appear?: boolean
  }>(),
  {
    axis: 'y',
    mode: 'out-in',
    speed: 'normal',
    group: false,
    appear: false,
  },
)

const axisSizeProp = computed(() => (props.axis === 'x' ? 'width' : 'height'))
const axisMaxSizeProp = computed(() => (props.axis === 'x' ? 'maxWidth' : 'maxHeight'))
const axisScrollSizeProp = computed(() => (props.axis === 'x' ? 'scrollWidth' : 'scrollHeight'))

function getAxisVisibleSize(element: Element) {
  const maxAxisSize = parseFloat(getComputedStyle(element)[axisMaxSizeProp.value])

  if (isNaN(maxAxisSize) || maxAxisSize === 0 || maxAxisSize === Infinity) {
    return element[axisScrollSizeProp.value]
  }

  return Math.min(element[axisScrollSizeProp.value], maxAxisSize)
}

const beforeEnter = (element: Element) => ((element as HTMLElement).style[axisSizeProp.value] = '0')
const enter = (element: Element) =>
  ((element as HTMLElement).style[axisSizeProp.value] = `${getAxisVisibleSize(element)}px`)
const afterEnter = (element: Element) => ((element as HTMLElement).style[axisSizeProp.value] = '')
const beforeLeave = enter
const leave = beforeEnter
</script>

<style lang="scss">
$axes: (x, y);
$speeds: (
  fast: var(--transition-time-fast),
  normal: var(--transition-time-normal),
  slow: var(--transition-time-slow),
);

@each $axis in $axes {
  @each $speed, $time in $speeds {
    $transition: '.transition-expand-#{$axis}-#{$speed}';

    #{$transition}-enter-active,
    #{$transition}-leave-active,
    #{$transition}-move {
      overflow: hidden;
      transition:
        width #{$time},
        height #{$time},
        opacity #{$time};
    }

    #{$transition}-enter-from,
    #{$transition}-leave-to {
      opacity: 0;
    }
  }
}
</style>
