export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storageKey: process.env.COLOR_MODE_COOKIE_NAME ?? 'sea-battle__color-mode',
  },
})
