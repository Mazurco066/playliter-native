// Dependencies
import { locale as lcl } from 'expo-localization' 
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from './locales/en.json'
import ptTranslations from './locales/pt.json'

const resources = {
  en: {
    translation: enTranslations
  },
  pt: {
    translation: ptTranslations
  }
}

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: lcl,
  fallbackLng: 'en',
  resources: resources
})

export default i18next