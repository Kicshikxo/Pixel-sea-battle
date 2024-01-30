<template>
  <div class="px-layout">
    <pixel-shadow full-width>
      <header class="px-header">
        <pixel-transition-fade>
          <nuxt-link v-if="state.status.value === 'authenticated'" to="/" class="px-header__logo">
            <img class="px-header__logo-img px-icon" src="/logo.svg" />
            <div class="px-header__logo-text">
              <span>Морской</span>
              <span>Бой</span>
            </div>
          </nuxt-link>
        </pixel-transition-fade>
        <nuxt-loading-indicator class="px-loading-indicator" color="var(--px-color-page-loading-indicator)" :height="2" :throttle="0" />
        <pixel-locale-switch />
        <pixel-theme-switch />
        <pixel-avatar v-if="state.data.value?.id" :seed="state.data.value?.id" size="small" />
      </header>
    </pixel-shadow>
    <main class="px-main">
      <div class="px-page">
        <nuxt-page />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { state } = useAuth()
</script>

<style lang="scss" scoped>
.px-layout {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
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
