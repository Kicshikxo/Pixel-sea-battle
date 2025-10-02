export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  components: false,

  app: {
    head: {
      title: 'Пиксельный морской бой',
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

        locales: ['en', 'ru'],
        strategy: 'no_prefix',
        defaultLocale: 'en',

        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: process.env.LOCALE_COOKIE_NAME ?? 'sea-battle__locale',
        },
      },
    ],
    [
      '@nuxtjs/color-mode',
      {
        preference: 'system',
        fallback: 'dark',
        storageKey: process.env.COLOR_MODE_COOKIE_NAME ?? 'sea-battle__color-mode',
      },
    ],
    [
      '@nuxt/icon',
      {
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
  ],

  build: {
    transpile: ['trpc-nuxt', 'vue-toastification'],
  },

  runtimeConfig: {
    auth: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      jwtSecretKey: process.env.JWT_SECRET_KEY ?? '<jwt_secret_key>',
      cookieName: process.env.AUTH_COOKIE_NAME ?? 'sea-battle__auth-token',
    },
    email: {
      host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) ?? 587,
      auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
      },
      from: process.env.EMAIL_FROM,
    },
  },
})
