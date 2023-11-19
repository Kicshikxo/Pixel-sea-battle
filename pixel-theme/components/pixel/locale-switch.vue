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
const { locale, setLocale } = useI18n()

function handleClick() {
  if (locale.value === 'ru') {
    return setLocale('en')
  }
  if (locale.value === 'en') {
    return setLocale('ru')
  }
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
