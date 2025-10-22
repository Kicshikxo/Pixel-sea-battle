import type { Locales } from '~~/types/i18n'

export default {
  unauthorized: {
    en: 'Unauthorized',
    ru: 'Не авторизован',
  },
  unableToReadToken: {
    en: 'Unable to read token',
    ru: 'Невозможно прочитать токен',
  },
  unableToReadTokenData: {
    en: 'Unable to read token data',
    ru: 'Невозможно прочитать данные токена',
  },
  userNotFound: {
    en: 'User not found',
    ru: 'Пользователь не найден',
  },
  invalidTokenCredentials: {
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
  invalidRefreshToken: {
    en: 'Invalid refresh token',
    ru: 'Неверный токен обновления',
  },
} satisfies Locales
