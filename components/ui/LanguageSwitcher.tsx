'use client'

import i18n from 'i18next'
import { useTranslation } from '@/i18n'
import { useTheme } from 'next-themes'
import { useState, useRef } from 'react'

const languages = [
  { code: 'uk', flag: '🇺🇦' },
  { code: 'en', flag: '🇬🇧' },
  { code: 'cs', flag: '🇨🇿' },
]

export default function LanguageSwitcher() {
  const { i18n: i18nInstance } = useTranslation()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openMenu = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

  const closeMenu = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      timeoutRef.current = null
    }, 250)
  }

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    i18nInstance.changeLanguage(lng)
    try {
      localStorage.setItem('lang', lng)
      document.documentElement.setAttribute('lang', lng)
    } catch {}
    setIsOpen(false)
  }

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  return (
    <div
      className="relative inline-block"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        type="button"
        className="h-8 w-8 flex items-center justify-center text-xl cursor-pointer rounded-md"
        onClick={toggleMenu} // <-- Клік для мобільних
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {currentLang.flag}
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 z-10 mt-2 w-12 rounded-md bg-popover text-popover-foreground shadow-lg ring-1 ring-border transition-opacity duration-200 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-center w-full px-2 py-1 text-xl ${
                i18n.language === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
