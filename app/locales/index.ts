import type { Locale, Locales } from '~~/types/i18n'
import { locales } from '~~/types/i18n'

import error from './error'
import validation from './validation'

import authPage from './pages/auth'
import confirmEmailPage from './pages/confirmEmail'
import errorPage from './pages/error'
import indexPage from './pages/index'
import roomPage from './pages/room'

export const translationFiles: Record<string, Locales> = {
  error,
  validation,

  page: {
    auth: authPage,
    confirmEmail: confirmEmailPage,
    error: errorPage,
    index: indexPage,
    room: roomPage,
  },
}

export function transformTranslationFiles(files: Record<string, Locales>): Record<Locale, any> {
  const transformed: Record<string, any> = {}

  for (const locale of locales) {
    transformed[locale] = {}
  }

  const processingStack: [Locales, string[], string][] = Object.entries(files).map(
    ([fileName, translations]) => [translations, [], fileName],
  )

  while (processingStack.length) {
    const [currentObject, currentPath, currentFileName] = processingStack.pop()!

    for (const key in currentObject) {
      const value = currentObject[key]

      if (value && locales.every((locale) => locale in value)) {
        for (const locale of locales) {
          let pointer = transformed[locale]
          const fullPath = [currentFileName, ...currentPath]
          for (const pathPart of fullPath) {
            if (!pointer[pathPart]) pointer[pathPart] = {}
            pointer = pointer[pathPart]
          }
          pointer[key] = value[locale]
        }
      } else {
        processingStack.push([value as Locales, [...currentPath, key], currentFileName])
      }
    }
  }

  return transformed as Record<Locale, any>
}

export const messages = transformTranslationFiles(translationFiles)
