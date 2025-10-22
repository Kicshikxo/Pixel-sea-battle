import { locales } from './types/i18n'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  components: false,

  app: {
    head: {
      meta: [
        {
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

  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/pixel.scss',
    '~/assets/scss/minecraft.fontface.scss',
    '~/assets/scss/toast.scss',
    'vue-toastification/dist/index.css',
  ],

  modules: [
    [
      '@nuxtjs/i18n',
      {
        vueI18n: '~/i18n.config.ts',

        locales,
        strategy: 'no_prefix',
        defaultLocale: locales[0],

        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: process.env.LOCALE_COOKIE_KEY ?? 'sea-battle__locale',
        },
      },
    ],
    [
      '@nuxtjs/color-mode',
      {
        preference: 'system',
        fallback: 'dark',
        storageKey: process.env.COLOR_MODE_STORAGE_KEY ?? 'sea-battle__color-mode',
      },
    ],
    [
      '@nuxt/icon',
      {
        mode: 'svg',
        size: '24px',
        class: 'px-icon',
      },
    ],
    [
      'nuxt-vue3-google-signin',
      {
        clientId: process.env.GOOGLE_CLIENT_ID,
      },
    ],
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-typed-router',
  ],

  build: {
    transpile: ['trpc-nuxt', 'vue-toastification'],
  },

  runtimeConfig: {
    public: {
      auth: {
        accessTokenKey: process.env.ACCESS_TOKEN_COOKIE_KEY ?? 'sea-battle__access-token',
        refreshTokenKey: process.env.REFRESH_TOKEN_COOKIE_KEY ?? 'sea-battle__refresh-token',
      },
    },
    auth: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      jwtSecretKey: process.env.JWT_SECRET_KEY ?? '<jwt_secret_key>',
    },
    email: {
      host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) ?? 465,
      auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
      },
      from: process.env.EMAIL_FROM,
    },
  },

  vite: {
    resolve: {
      alias: { '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js' },
    },
  },
})
