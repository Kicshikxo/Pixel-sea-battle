<template>
  <div class="px-theme-switch">
    <client-only>
      <pixel-transition-swipe-y>
        <div class="px-theme-switch__icon" :key="`${colorMode.value}-${iconName}`">
          <icon :name="iconName" size="24" @click="handleClick" />
        </div>
      </pixel-transition-swipe-y>
    </client-only>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const colorModes = ref(['system', 'light', 'dark'])

const iconName = computed(() => {
  if (colorMode.preference === 'system') {
    return 'pixelarticons:monitor'
  }
  if (colorMode.preference === 'light') {
    return 'pixelarticons:sun-alt'
  }
  if (colorMode.preference === 'dark') {
    return 'pixelarticons:moon'
  }
  return 'pixelarticons:warning-box'
})

function handleClick() {
  colorMode.preference = colorModes.value.at((colorModes.value.indexOf(colorMode.preference) + 1) % colorModes.value.length)!
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
