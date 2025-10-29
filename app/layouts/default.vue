<template>
  <div class="px-layout">
    <PixelShadow full-width>
      <header class="px-header">
        <TransitionFade>
          <NuxtLink v-if="session.status.value === 'authenticated'" to="/" class="px-header__logo">
            <img class="px-header__logo-img px-icon" src="/logo.svg" />
            <div class="px-header__logo-text">
              <span>{{ $t('page.index.title.topPart') }}</span>
              <span>{{ $t('page.index.title.bottomPart') }}</span>
            </div>
          </NuxtLink>
        </TransitionFade>

        <div class="px-header__actions">
          <PixelLocaleSwitch class="px-header__actions__item" />
          <PixelThemeSwitch class="px-header__actions__item" />
          <TransitionExpand axis="x">
            <div v-if="session.data.value?.id">
              <div class="px-header__actions__item">
                <PixelAvatar
                  :seed="session.data.value?.id"
                  :title="session.data.value?.username"
                  small
                  @click="openProfile"
                />
              </div>
            </div>
          </TransitionExpand>
        </div>

        <NuxtLoadingIndicator
          class="px-loading-indicator"
          color="var(--px-color-page-loading-indicator)"
          :height="2"
          :throttle="0"
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
import TransitionExpand from '~/components/transitions/TransitionExpand.vue'
import TransitionFade from '~/components/transitions/TransitionFade.vue'

const { t, locale } = useI18n()
const { session } = useAuth()
const router = useRouter()

watch(
  () => locale.value,
  () => {
    useHead({
      htmlAttrs: {
        lang: locale.value,
      },
      title: t('page.index.title.full'),
    })
  },
  { immediate: true },
)

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
  justify-content: start;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 8px 24px;
  background-color: var(--px-color-page-header);
  border-bottom: 2px solid var(--px-color-border);

  @include on-breakpoint(sm) {
    padding: 8px;
    padding-left: 0;
  }

  &__logo {
    display: flex;
    gap: 8px;

    &-img {
      width: 64px;
      height: 64px;
    }

    &-text {
      color: var(--px-color-black-on-light-white-on-dark);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    margin-left: auto;

    &__item {
      display: flex;
      align-items: center;
      height: 36px;
      margin-left: 24px;
    }
  }
}
.px-main {
  flex: 1;
  display: flex;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--px-color-page-background);
}
.px-loading-indicator {
  position: absolute !important;
  top: auto !important;
  bottom: 0 !important;
}
.px-page {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  position: absolute;
}
</style>
