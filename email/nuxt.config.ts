export default defineNuxtConfig({
  runtimeConfig: {
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
