"use client"

import { useEffect } from "react"
import { useTranslation as useTrans } from "react-i18next"
import { initReactI18next } from "react-i18next"
import i18n from "i18next"

import translationUk from "./locales/uk/common.json"
import translationEn from "./locales/en/common.json"
import translationCs from "./locales/cs/common.json"

// Initialize i18n once in a stable way
if (!i18n.isInitialized) {
  const storedLang =
    typeof window !== "undefined" ? localStorage.getItem("lang") : null
  const initialLang = storedLang || "cs"

  if (typeof window !== "undefined" && !storedLang) {
    try {
      localStorage.setItem("lang", initialLang)
    } catch {}
  }

  i18n.use(initReactI18next).init({
    resources: {
      uk: { translation: translationUk },
      en: { translation: translationEn },
      cs: { translation: translationCs },
    },
    lng: initialLang, // Use persisted language if available, otherwise Czech
    fallbackLng: "cs",
    interpolation: { escapeValue: false },
  })
}

export const useTranslation = () => {
  const hook = useTrans()

  // Sync language from localStorage after mount to avoid SSR/CSR mismatch
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("lang") : null
    if (stored && stored !== i18n.language) {
      i18n.changeLanguage(stored)
    }
  }, [])

  return hook
}
