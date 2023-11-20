import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

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
    },

    pageTransition: { name: 'page-fade', mode: 'out-in' },
  },

  modules: ['@vee-validate/nuxt'],

  css: [resolve('./assets/scss/main.scss')],
})
