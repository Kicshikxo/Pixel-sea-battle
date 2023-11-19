export default defineNuxtConfig({
  modules: ['nuxt-vue3-google-signin'],

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
})
