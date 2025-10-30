import type { Locales } from '~~/types/i18n'

export default {
  nameAlreadyExists: {
    en: 'A room with this name already exists',
    ru: 'Комната с таким названием уже существует',
  },
  notFound: {
    en: 'Room not found',
    ru: 'Комната не найдена',
  },
  isFull: {
    en: 'Room is full',
    ru: 'Комната заполнена',
  },
  notJoined: {
    en: 'You are not joined to this room',
    ru: 'Вы не присоединены к этой комнате',
  },
} satisfies Locales
