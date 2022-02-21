import { useEffect, useRef } from 'react'
import { FormInstance } from 'antd/lib/form'
import type { routeType } from '@/router/routes'
import stores from '@/store'
import { navRoutes } from '@/router/routes'

/**
 * 获取路由title
 * @param key 
 * @param src 
 * @returns 
 */
const getRouterTitle = (key: string, src: Array<routeType>): string => {
  let title: string = ''
  for (const m of src) {
    if (key === m.path) {
      title = m.meta ? m.meta.title : 'unset'
      break
    }
    if (m.routes) {
      title = getRouterTitle(key, m.routes)
      if (title) break
    }
  }
  return title
}

/**
 * reset form fields when modal is form, closed
 * @param param0 
 */
export const useResetFormOnCloseModal = ({ form, visible }: { form: FormInstance; visible: boolean }) => {
  const prevVisibleRef = useRef<boolean>()
  useEffect(() => {
    prevVisibleRef.current = visible
  }, [visible])
  const prevVisible = prevVisibleRef.current

  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields()
    }
  }, [visible, prevVisible])
}

/**
 * 路由层级处理
 * @param pathname /aaa/bbb/ccc/ddd
 */
export const handleRouter = (pathname: string) => {
  let pathArr = pathname.split('/').splice(1) // 第一项是""
  pathArr = pathArr.map((p: string) => `/${p}`) // ['/aaa', '/bbb', '/ccc', '/ddd']
  const newArr: string[] = [pathArr[0]]
  pathArr.reduce((a: string, b: string) => { // ['/aaa', '/bbb', '/ccc', '/ddd'] => ['/aaa/bbb', '/aaa/bbb/ccc', '/aaa/bbb/ccc/ddd']
    newArr.push(`${a + b}`)
    return a + b
  })

  return newArr
}

/**
 * 组装面包屑
 * @param pathArr
 */
export const getRouterPaths = (pathArr: string[], navRoutes: Array<routeType>) => {
  let paths: string[] = []
  for (const key of pathArr) {
    paths.push(getRouterTitle(key, navRoutes))
  }

  return paths
}

/**
 * 设置菜单展开、面包屑
 * @param key 当前路由
 * @param navRoutes 菜单路由表
 */
export const setMenuAndBreadcurmb = (key: string) => {
  const openPaths = handleRouter(key)
  const breadcrumb = getRouterPaths(openPaths, navRoutes)
  // 设置面包屑
  stores.LayoutStore.setBreadcrumb(breadcrumb)
  // 设置菜单展开
  stores.LayoutStore.setOpenKeys(openPaths)
}
