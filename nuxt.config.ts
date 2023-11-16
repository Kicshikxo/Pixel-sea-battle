// import startSocketIOServer from './server/socket.io'

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

  css: ['assets/css/minecraft.fontface.scss', 'assets/css/pixel.scss', 'assets/css/main.scss'],

  modules: ['@nuxtjs/color-mode', '@pinia/nuxt', '@vee-validate/nuxt', 'nuxt-icon', 'nuxt-vue3-google-signin'],

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storageKey: 'sea-battle__color-mode',
  },

  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    jwtSecretKey: process.env.JWT_SECRET_KEY ?? '<jwt_secret_key>',
    authCookieName: process.env.AUTH_COOKIE_NAME ?? 'sea-battle__auth-token',
  },

  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },

  // hooks: {
  //   listen: startSocketIOServer,
  // },

  build: {
    transpile: ['trpc-nuxt'],
  },
})
