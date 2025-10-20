import type { Locales } from '~~/types/i18n'

export default {
  accountEmail: {
    en: 'Account email',
    ru: 'Электронная почта аккаунта',
  },
  sendPasswordRecovery: {
    en: 'Send password recovery',
    ru: 'Восстановить пароль',
  },
  passwordRecoverySucessfullySended: {
    en: 'Password recovery successfully sended',
    ru: 'Запрос на восстановление пароля успешно отправлен',
  },

  unableToChangePassword: {
    en: 'Unable to change password',
    ru: 'Невозможно изменить пароль',
  },
  openAuthPage: {
    en: 'Go back auth page',
    ru: 'На страницу авторизации',
  },
  newPassword: {
    en: 'New password',
    ru: 'Новый пароль',
  },
  newPasswordForAccount: {
    en: 'New password for account {email}',
    ru: 'Новый пароль для аккаунта {email}',
  },
  changePassword: {
    en: 'Change password',
    ru: 'Изменить пароль',
  },
  passwordSuccessfullyChanged: {
    en: 'Password successfully changed',
    ru: 'Пароль успешно изменён',
  },
} satisfies Locales
