<template>
  <div class="px-theme-switch">
    <client-only>
      <TransitionSwipeY>
        <div class="px-theme-switch__icon" :key="`${colorMode.value}-${iconName}`">
          <icon :name="iconName" size="24" @click="handleClick" />
        </div>
      </TransitionSwipeY>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import TransitionSwipeY from '~/components/transitions/TransitionSwipeY.vue'

const colorMode = useColorMode()

const colorModes = ref(['system', 'light', 'dark'])

const iconName = computed(() => {
  return (
    { system: 'pixelarticons:monitor', light: 'pixelarticons:sun-alt', dark: 'pixelarticons:moon' }[
      colorMode.preference
    ] ?? 'pixelarticons:warning-box'
  )
})

function handleClick() {
  colorMode.preference = colorModes.value.at(
    (colorModes.value.indexOf(colorMode.preference) + 1) % colorModes.value.length,
  )!
}
</script>

<style lang="scss" scoped>
.px-theme-switch {
  overflow: hidden;
  height: min-content;

  &__icon {
    cursor: pointer;
  }
}
</style>
