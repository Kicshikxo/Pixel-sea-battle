import type { Locales } from '~~/types/i18n'

export default {
  unableToReadSession: {
    en: 'Unable to read session',
    ru: 'Невозможно прочитать сессию',
  },
  sessionNotFound: {
    en: 'Session not found',
    ru: 'Сессия не найдена',
  },
  userNotFound: {
    en: 'User not found',
    ru: 'Пользователь не найден',
  },
  invalidSession: {
    en: 'Invalid token credentials',
    ru: 'Неверные учетные данные токена',
  },
  userAlreadyExists: {
    en: 'User already exists',
    ru: 'Пользователь уже существует',
  },
  incorrectLoginCredentials: {
    en: 'Incorrect login credentials',
    ru: 'Неверный логин или пароль',
  },
  googleUserNotFound: {
    en: 'Google user not found',
    ru: 'Пользователь Google не найден',
  },
} satisfies Locales
