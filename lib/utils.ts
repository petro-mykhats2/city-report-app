import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict } from "date-fns"
import type { Locale } from "date-fns"
import { uk, enUS, cs } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

export function formatTimeToNow(date: Date | string, localeCode: string = "en"): string {
  if (typeof date === "string") {
    date = new Date(date)
  }

  const localeMap: Record<string, Locale> = {
    uk,
    en: enUS,
    cs,
  }

  const locale = localeMap[localeCode] || enUS

  return formatDistanceToNowStrict(date, { addSuffix: true, locale })
}


// NOTE: If you get an error like "Module not found: Can't resolve 'date-fns'", you may need to install it:
// npm install date-fns
// or
// yarn add date-fns
// or
// pnpm add date-fns
