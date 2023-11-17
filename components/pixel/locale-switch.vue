<template>
  <div class="px-language-switch">
    <client-only>
      <transition name="px-language-switch__value-swipe" mode="out-in">
        <div class="px-language-switch__value" :key="locale" @click="handleClick">
          {{ locale }}
        </div>
      </transition>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import locales from '~/locales'

const { locale, setLocale } = useI18n()

const localesList = ref(Object.keys(locales))

function handleClick() {
  setLocale(localesList.value.at((localesList.value.indexOf(locale.value) + 1) % localesList.value.length)!)
}
</script>

<style lang="scss" scoped>
.px-language-switch {
  overflow: hidden;
  height: min-content;

  &__value {
    cursor: pointer;
    text-transform: uppercase;
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
