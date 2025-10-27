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
  confirmSafeLeaveMessage: {
    en: 'Are you sure you want to leave the room? Your progress will be saved',
    ru: 'Вы уверены, что хотите выйти из комнаты? Весь прогресс будет сохранён',
  },
  confirmUnsafeLeaveMessage: {
    en: 'Are you sure you want to leave the room? Your progress will be lost',
    ru: 'Вы уверены, что хотите выйти из комнаты? Весь прогресс будет удалён',
  },
  cancel: {
    en: 'Cancel',
    ru: 'Отмена',
  },
  leave: {
    en: 'Leave',
    ru: 'Выйти',
  },
  playerConnect: {
    en: '{username} connect to the room',
    ru: '{username} подключился к комнате',
  },
  playerDisconnect: {
    en: '{username} disconnect from the room',
    ru: '{username} отключился от комнаты',
  },
  playerJoin: {
    en: '{username} join the room',
    ru: '{username} вошёл в комнату',
  },
  playerLeave: {
    en: '{username} leave the room',
    ru: '{username} вышёл из комнаты',
  },
  youLeave: {
    en: 'You leave the room',
    ru: 'Вы вышли из комнаты',
  },
} satisfies Locales
