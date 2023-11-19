import locales from '.';

export default defineI18nConfig<{ messages: { en: typeof locales.ru; ru: typeof locales.en } }>(() => ({
  messages: locales,
}))
