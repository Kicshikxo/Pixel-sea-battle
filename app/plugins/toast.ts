import Toast, { type PluginOptions } from 'vue-toastification'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    icon: false,
    position: 'top-center',
    closeOnClick: false,
    draggable: false,
  } as PluginOptions)
})
