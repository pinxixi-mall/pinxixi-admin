import Cookies from 'js-cookie'
import { TOKEN_KEY } from '../config/base'
import { OptionProps } from '@/types'

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

/**
 * 根据value获取list中对应的label
 * @param value 
 * @param list 
 * @returns 
 */
export const getLabelByValue = (value: number | string, list: Array<OptionProps>): string => {
  const item: OptionProps | undefined = list.find((it: OptionProps) => (it.value === value))
  return item ? item.label : '';
}
