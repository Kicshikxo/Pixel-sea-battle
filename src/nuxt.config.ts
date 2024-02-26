import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Пиксельный морской бой',
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
