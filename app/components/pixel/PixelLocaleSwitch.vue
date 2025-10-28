<template>
  <div class="px-language-switch">
    <client-only>
      <TransitionSwipe>
        <div class="px-language-switch__value" :key="locale" @click="handleClick">
          {{ locale }}
        </div>
      </TransitionSwipe>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import TransitionSwipe from '~/components/transitions/TransitionSwipe.vue'

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
  }
}
</style>
