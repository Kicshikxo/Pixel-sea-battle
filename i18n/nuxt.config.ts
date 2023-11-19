import locales from '.'

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@pinia/nuxt'],

  i18n: {
    locales: Object.keys(locales),
    strategy: 'no_prefix',
    defaultLocale: 'ru',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: process.env.LOCALE_COOKIE_NAME ?? 'sea-battle__locale',
    },
  },
})
