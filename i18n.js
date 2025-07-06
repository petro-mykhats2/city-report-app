"use client"

import { useTranslation as useTrans } from "react-i18next"
import { initReactI18next } from "react-i18next"
import i18n from "i18next"

import translationUk from "./locales/uk/common.json"
import translationEn from "./locales/en/common.json"
import translationCs from "./locales/cs/common.json"

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: translationUk },
    en: { translation: translationEn },
    cs: { translation: translationCs },
  },
  lng:
    typeof window !== "undefined" ? localStorage.getItem("lang") || "uk" : "uk",
  fallbackLng: "uk",
  interpolation: {
    escapeValue: false,
  },
})

export const useTranslation = () => useTrans()
