import type { Locales } from '~~/types/i18n'

export default {
  error: {
    en: 'Error {statusCode}',
    ru: 'Ошибка {statusCode}',
  },
  error404: {
    en: 'Page not found',
    ru: 'Страница не найдена',
  },
  error500: {
    en: 'Server error',
    ru: 'Ошибка сервера',
  },
  goBackHome: {
    en: 'Go back home',
    ru: 'На главную',
  },
} satisfies Locales
