import locales from '~/locales'

export default defineI18nConfig<{ messages: { en: typeof locales.ru; ru: typeof locales.en } }>(() => ({
  legacy: false,
  locale: 'ru',
  messages: locales,
}))
