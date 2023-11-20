export default defineNuxtConfig({
  extends: ['auth', 'color-mode', 'email', 'i18n', 'icons', 'pixel-theme', 'prisma', 'socket.io/', 'src', 'store', 'trpc'],

  devtools: { enabled: true },
  typescript: {
    strict: true,
  },

  modules: ['nuxt-typed-router'],
})
