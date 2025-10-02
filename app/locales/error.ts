import type { Locales } from '~~/types/i18n'

export default {
  auth: {
    unableToReadToken: {
      en: 'Unable to read token',
      ru: 'Невозможно прочитать токен',
    },
    unableToReadTokenData: {
      en: 'Unable to read token data',
      ru: 'Невозможно прочитать данные токен',
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
  },
  email: {
    emailConfirmationIdNotFound: {
      en: 'Email confirmation id not found',
      ru: 'Идентификатор подтверждения электронной почты не найден',
    },
    emailConfirmationUserNotFound: {
      en: 'Email confirmation user not found',
      ru: 'Пользователь с этой электронной почтой не найден',
    },
    emailAlreadyConfirmed: {
      en: 'Email already confirmed',
      ru: 'Электронная почта уже подтверждена',
    },
  },
  room: {
    roomNotFound: {
      en: 'Room not found',
      ru: 'Комната не найдена',
    },
    roomIsFull: {
      en: 'Room is full',
      ru: 'Комната заполнена',
    },
  },
} satisfies Locales
