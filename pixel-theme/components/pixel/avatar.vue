<template>
  <pixel-border>
    <div :class="['px-avatar', `px-avatar--${size}`]" v-html="svg" />
  </pixel-border>
</template>

<script setup lang="ts">
import { styles } from '~/avatar/utils/getAvatar'

const props = withDefaults(
  defineProps<{
    seed: string
    type?: keyof typeof styles
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    type: 'pixelArt',
    size: 'medium',
  },
)

const svg = computed(() => getAvatar(props.seed, props.type).svg)
</script>

<style lang="scss" scoped>
.px-avatar {
  background: var(--px-color-white);

  &--small {
    width: 32px;
    height: 32px;
  }
  &--medium {
    width: 64px;
    height: 64px;
  }
  &--large {
    width: 128px;
    height: 128px;
  }
}
</style>
