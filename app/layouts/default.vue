<template>
  <div class="px-layout">
    <PixelShadow full-width>
      <header class="px-header">
        <TransitionFade>
          <NuxtLink v-if="session.status.value === 'authenticated'" to="/" class="px-header__logo">
            <img class="px-header__logo-img px-icon" src="/logo.svg" />
            <div class="px-header__logo-text">
              <span>{{ $t('page.index.title.top') }}</span>
              <span>{{ $t('page.index.title.bottom') }}</span>
            </div>
          </NuxtLink>
        </TransitionFade>
        <NuxtLoadingIndicator
          class="px-loading-indicator"
          color="var(--px-color-page-loading-indicator)"
          :height="2"
          :throttle="0"
        />
        <PixelLocaleSwitch />
        <PixelThemeSwitch />
        <PixelAvatar
          v-if="session.data.value?.id"
          :seed="session.data.value?.id"
          size="small"
          @click="openProfile"
        />
      </header>
    </PixelShadow>
    <main class="px-main">
      <div class="px-page">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import PixelAvatar from '~/components/pixel/PixelAvatar.vue'
import PixelLocaleSwitch from '~/components/pixel/PixelLocaleSwitch.vue'
import PixelShadow from '~/components/pixel/PixelShadow.vue'
import PixelThemeSwitch from '~/components/pixel/PixelThemeSwitch.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'

const { locale } = useI18n()
const { session } = useAuth()
const router = useRouter()

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
})

function openProfile() {
  router.push({ name: 'profile' })
}
</script>

<style lang="scss" scoped>
.px-layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  height: 100dvh;
  min-height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
}
.px-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  gap: 24px;
  width: 100%;
  height: 64px;
  padding: 8px 24px;
  background: var(--px-color-page-header);
  border-bottom: 2px solid var(--px-color-border);

  &__logo {
    display: flex;
    gap: 8px;
    margin-right: auto;

    &-img {
      width: 64px;
    }

    &-text {
      color: var(--px-color-black-on-light-white-on-dark);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}
.px-main {
  flex: 1;
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--px-color-page-background);
}
.px-loading-indicator {
  position: absolute !important;
  top: auto !important;
  bottom: 0 !important;
}
.px-page {
  display: flex;
  width: 100%;
  min-height: 100%;
  position: absolute;
}
</style>
