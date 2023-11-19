export default defineNuxtConfig({
  extends: ['src', 'i18n', 'icons', 'color-mode', 'prisma', 'trpc', 'email', 'pixel-theme', 'auth', 'socket.io/'],

  devtools: { enabled: true },
  typescript: {
    strict: true,
  },

  modules: ['@vee-validate/nuxt', 'nuxt-typed-router'],
})
