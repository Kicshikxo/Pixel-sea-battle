<template>
  <div :class="['px-divider__wrapper', `px-divider__wrapper--${mode}`]">
    <PixelShadow full-width full-height>
      <div
        :class="['px-divider', `px-divider--${mode}`]"
        :style="{ '--px-divider-width': `${width}px` }"
      ></div>
    </PixelShadow>
    <span v-if="text" class="px-divider__text">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import PixelShadow from '~/components/pixel/PixelShadow.vue'

const props = withDefaults(
  defineProps<{
    text?: string
    mode?: 'horizontal' | 'vertical'
    width?: string | number
  }>(),
  {
    text: '',
    mode: 'horizontal',
    width: '16',
  },
)
</script>

<style lang="scss" scoped>
.px-divider {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--px-color-black);

  &--horizontal {
    width: 100%;
    height: 2px;
    margin: var(--px-divider-width) 0;
  }
  &--vertical {
    width: 2px;
    height: 100%;
    margin: 0 var(--px-divider-width);
  }

  &__wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &--horizontal {
      width: 100%;
    }
    &--vertical {
      height: 100%;
    }
  }

  &__text {
    position: absolute;
    background-color: var(--px-color-dark);
    padding: 8px;
  }
}
</style>
