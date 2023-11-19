<template>
  <div class="px-theme-switch">
    <client-only>
      <transition name="px-theme-switch__icon-swipe" mode="out-in">
        <div class="px-theme-switch__icon" :key="`${colorMode.value}-${iconName}`">
          <icon :name="iconName" size="24" @click="handleClick" />
        </div>
      </transition>
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
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &-swipe-enter-from {
      opacity: 0;
      transform: translateY(100%);
    }
    &-swipe-leave-to {
      opacity: 0;
      transform: translateY(-100%);
    }
  }
}
</style>
