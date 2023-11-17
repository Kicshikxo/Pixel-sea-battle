export default defineI18nConfig(() => ({
  availableLocales: ['ru', 'en'],
  locale: 'ru',
  messages: {
    en: {
      welcome: 'Welcome',
    },
    fr: {
      welcome: 'Bienvenue',
    },
  },
}))
