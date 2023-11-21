import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  app: {
    head: {
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

  css: [resolve('assets/scss/minecraft.fontface.scss'), resolve('assets/scss/pixel.scss'), resolve('assets/scss/toast.scss')],
})
