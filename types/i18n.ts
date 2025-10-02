export const locales = ['en', 'ru'] as const

export type Locale = (typeof locales)[number]

export type LocaleRecord = {
  [key in Locale]: string
}

export type Locales = {
  [key: string]: LocaleRecord | Locales
}
