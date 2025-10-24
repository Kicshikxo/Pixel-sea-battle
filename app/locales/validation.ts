import type { Locales } from '~~/types/i18n'

export default {
  required: {
    en: 'Required',
    ru: 'Необходимое поле',
  },
  invalidEmail: {
    en: 'Invalid email',
    ru: 'Невалидная почта',
  },
  tooManyCharacters: {
    en: 'Too many characters',
    ru: 'Слишком много символов',
  },
} satisfies Locales
