<template>
  <div class="px-layout">
    <pixel-shadow full-width>
      <header class="px-header">
        <nuxt-loading-indicator class="px-loading-indicator" color="var(--px-color-page-loading-indicator)" :height="2" :throttle="0" />
        <pixel-locale-switch />
        <pixel-theme-switch />
      </header>
    </pixel-shadow>
    <main class="px-main">
      <div class="px-page">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts"></script>

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
