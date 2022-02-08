import Cookies from 'js-cookie'
import { TOKEN_KEY } from '../config/base'

export const setCookie = (key: string, value: string): void => {
  Cookies.set(key, value)
}

export const getCookie = (key: string): string => {
  return Cookies.get(key)
}

export const setToken = (value: any): void => {
  setCookie(TOKEN_KEY, value)
}

export const getToken = (): string => {
  return getCookie(TOKEN_KEY)
}
