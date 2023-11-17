import locales from './locales'

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      title: 'Морской бой',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Морской бой',
        },
      ],
      link: [
        {
          rel: 'preload',
          href: '/fonts/Minecraft.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },

    pageTransition: { name: 'page-fade', mode: 'out-in' },
  },

  devtools: { enabled: true },
  typescript: {
    strict: true,
  },

  css: ['assets/css/minecraft.fontface.scss', 'assets/css/pixel.scss', 'assets/css/main.scss'],

  modules: ['@nuxtjs/i18n', '@nuxtjs/color-mode', '@pinia/nuxt', '@vee-validate/nuxt', 'nuxt-icon', 'nuxt-vue3-google-signin'],

  i18n: {
    locales: Object.keys(locales),
    strategy: 'no_prefix',

    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: process.env.LOCALE_COOKIE_NAME ?? 'sea-battle__locale',
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storageKey: process.env.COLOR_MODE_COOKIE_NAME ?? 'sea-battle__color-mode',
  },

  runtimeConfig: {
    auth: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      jwtSecretKey: process.env.JWT_SECRET_KEY ?? '<jwt_secret_key>',
      cookieName: process.env.AUTH_COOKIE_NAME ?? 'sea-battle__auth-token',
    },
  },

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },

  build: {
    transpile: ['trpc-nuxt'],
  },
})
