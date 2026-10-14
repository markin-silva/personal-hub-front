import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import commonEn from './locales/en/common.json'
import navEn from './locales/en/nav.json'
import authEn from './locales/en/auth.json'
import commonPtBR from './locales/pt-BR/common.json'
import navPtBR from './locales/pt-BR/nav.json'
import authPtBR from './locales/pt-BR/auth.json'

export const defaultNS = 'common'

export const resources = {
  en: {
    common: commonEn,
    nav: navEn,
    auth: authEn,
  },
  'pt-BR': {
    common: commonPtBR,
    nav: navPtBR,
    auth: authPtBR,
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS,
    ns: ['common', 'nav', 'auth'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
