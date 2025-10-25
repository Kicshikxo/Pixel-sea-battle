import type { Locales } from '~~/types/i18n'

export default {
  messages: {
    en: 'Messages',
    ru: 'Сообщения',
  },
  message: {
    en: 'Message',
    ru: 'Сообщение',
  },
  sendMessage: {
    en: 'Send message',
    ru: 'Отправить сообщение',
  },
  board: {
    A: { en: 'A', ru: 'А' },
    B: { en: 'B', ru: 'Б' },
    C: { en: 'C', ru: 'В' },
    D: { en: 'D', ru: 'Г' },
    E: { en: 'E', ru: 'Д' },
    F: { en: 'F', ru: 'Е' },
    G: { en: 'G', ru: 'Ж' },
    H: { en: 'H', ru: 'З' },
    I: { en: 'I', ru: 'И' },
    J: { en: 'J', ru: 'К' },
  },
  confirmLeave: {
    en: 'Confirm leave',
    ru: 'Подтвердите выход',
  },
  confirmLeaveMessage: {
    en: 'Are you sure you want to leave the room? Your progress will be saved',
    ru: 'Вы уверены, что хотите выйти из комнаты? Весь прогресс будет сохранён',
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена',
  },
  leave: {
    en: 'Leave',
    ru: 'Выйти',
  },
  playerJoin: {
    en: '{username} joined the room',
    ru: '{username} присоединился к комнате',
  },
  playerLeave: {
    en: '{username} left the room',
    ru: '{username} вышел из комнаты',
  },
} satisfies Locales
