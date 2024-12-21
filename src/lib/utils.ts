import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const localStorageKey = 'USER_INFO'

export function setUser(token: string, userId: number) {
  localStorage.setItem(localStorageKey, JSON.stringify({ token, userId }))
}

export function clearUser() {
  localStorage.removeItem(localStorageKey)
}

export function getUserInfo(): { token: string; userId: number } {
  const info = localStorage.getItem(localStorageKey)
  if (info) {
    return JSON.parse(info)
  } else {
    return { token: '', userId: 0 }
  }
}

export const isLoggedIn = () => {
  return localStorage.getItem(localStorageKey) !== null
}
