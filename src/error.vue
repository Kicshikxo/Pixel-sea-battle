<template>
  <div class="error-page">
    <pixel-form class="error-page__form" @submit="handleSubmit">
      <icon name="pixelarticons:mood-sad" size="64" />
      <div class="error-page__status-code">{{ $t('errorPage.error', { statusCode: error.statusCode }) }}</div>
      <div v-if="error.statusCode === 404" class="error-page__message">{{ $t('errorPage.error404') }}</div>
      <div v-else-if="error.statusCode === 500" class="error-page__message">{{ $t('errorPage.error500') }}</div>
      <div v-else class="error-page__message">{{ error.message }}</div>
      <pixel-button type="submit" :label="$t('errorPage.goBackHome')">
        <template #append-icon>
          <icon name="pixelarticons:home" />
        </template>
      </pixel-button>
    </pixel-form>
  </div>
</template>

<script setup lang="ts">
const error: any = useError()

const handleSubmit = () => {
  clearError({ redirect: '/' })
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--px-color-page-background);

  &__form {
    width: 400px !important;
  }

  &__status-code {
    font-size: 32px;
  }

  &__message {
    font-size: 16;
    margin: 16px 0;
  }
}
</style>
