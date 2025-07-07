import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeToNow(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

// NOTE: If you get an error like "Module not found: Can't resolve 'date-fns'", you may need to install it:
// npm install date-fns
// or
// yarn add date-fns
// or
// pnpm add date-fns
