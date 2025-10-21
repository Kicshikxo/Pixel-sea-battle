<template>
  <PixelBorder>
    <div
      :class="[
        'px-avatar',
        {
          'px-avatar--small': small,
          'px-avatar--large': large,
        },
      ]"
      v-html="svg"
    />
  </PixelBorder>
</template>

<script setup lang="ts">
import PixelBorder from '~/components/pixel/PixelBorder.vue'

import { styles } from '~/utils/getAvatar'

const props = withDefaults(
  defineProps<{
    seed: string
    style?: keyof typeof styles
    small?: boolean
    large?: boolean
    scale?: number
  }>(),
  {
    style: 'identicon',
    small: false,
    large: false,
    scale: 50,
  },
)

const svg = computed(() => getAvatar(props.seed, props.style, props.scale).svg)
</script>

<style lang="scss" scoped>
.px-avatar {
  width: 64px;
  height: 64px;
  background: var(--px-color-white);

  &--small {
    width: 32px;
    height: 32px;
  }
  &--large {
    width: 128px;
    height: 128px;
  }
}
</style>
