export default defineNuxtConfig({
  extends: ['auth', 'avatar', 'color-mode', 'email', 'i18n', 'icons', 'pixel-theme', 'prisma', 'socket.io/', 'src', 'store', 'toast', 'trpc'],

  devtools: { enabled: true },
  typescript: {
    strict: true,
  },

  modules: ['nuxt-typed-router'],
})
