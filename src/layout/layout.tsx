import React, { useState, useEffect } from 'react'
import { Layout as AntLayout, Menu } from 'antd';
import Header from '@/components/Header'
import Breadcrumb from '@/components/Breadcrumb'
import { navRoutes } from '@/router/routes';
import type { routeType } from '@/router/routes'
import { inject, observer } from 'mobx-react'
import styles from './index.module.less'
import { setMenuAndBreadcurmb } from '@/utils/common'
import { UserInfoProps } from "@/types"
const { useHistory, useLocation } = require('react-router-dom')
const { SubMenu } = Menu
const { Content, Sider } = AntLayout

const Layout: React.FC = (props: any) => {
  const history = useHistory()
  const { pathname } = useLocation()
  let [userInfo, setUserInfo] = useState<UserInfoProps>()
  let [menus, setMenus] = useState<Array<React.ReactElement>>([])

  useEffect(() => {
    setUserInfo(JSON.parse(sessionStorage.getItem('userInfo') || '{}'))
    initPage() // useEffect里调用外面定义的函数会警告，加下面注释可屏蔽
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 监听路由变化
  useEffect(() => {
    setMenuAndBreadcurmb(pathname)
  }, [pathname])

  // 初始化
  const initPage = () => {
    const pathname = history.location.pathname // /aaa/bbb/ccc/ddd
    // 菜单渲染
    setMenus(createMenu(navRoutes))

    // 初始化菜单、面包屑
    onMenuClick({ key: pathname }, false)
  }

  // 菜单生成
  const createMenu = (menus: Array<routeType>) => {
    menus = menus.filter((menu: any) => !menu.meta.hideMenu)
    return menus.map((menu: any) => {
      if (menu.routes) {
        return (
          <SubMenu key={menu.path} icon={menu.meta.icon} title={menu.meta.title || '未设置'}>
            { createMenu(menu.routes)}
          </SubMenu>
        )
      } else {
        return <Menu.Item key={menu.path} icon={menu.meta.icon && menu.meta.icon} >{menu.meta.title || '未设置'}</Menu.Item>
      }
    })
  }

  // 菜单选中
  const onMenuClick = (options: any, pushFlag: boolean = true) => {
    const { key, keyPath } = options
    // 设置菜单展开、面包屑
    pushFlag && history.push(`${key}`)
  }

  // 菜单展开
  const onOpenChange = (options: any) => {
    props.LayoutStore.setOpenKeys(options)
  }

  return (
    <>
      <AntLayout className='my-layout'>
        <Header {...userInfo} />
        <AntLayout className={styles.layoutContent}>
          <Sider width={200} className={styles.siderBar}>
            <Menu
              mode="inline"
              selectedKeys={[history.location.pathname]}
              openKeys={props.LayoutStore.openKeys}
              style={{ height: '100%', borderRight: 0 }}
              onClick={onMenuClick}
              onOpenChange={onOpenChange}
            >
              {menus}
            </Menu>
          </Sider>
          <AntLayout  className={styles.contentBox}>
            <Breadcrumb breads={props.LayoutStore.breadcrumb} />
            <Content className={styles.content}>
              {props.children}
            </Content>
          </AntLayout>
        </AntLayout>
      </AntLayout>
    </>
  )
}

export default inject('LayoutStore')(observer(Layout))