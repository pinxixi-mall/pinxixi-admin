import React, { useState, useEffect } from 'react'
import { Layout as AntLayout, Menu, Image } from 'antd';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import { navRoutes } from '@/router/routes';
import type { routeType } from '@/router/routes'
import { inject, observer } from 'mobx-react'
import styles from './index.module.less'
import { setMenuAndBreadcurmb } from '@/utils/common'
import { getUserInfo } from '@/api';
import stores from '@/store';
const { useHistory, useLocation } = require('react-router-dom')
const { SubMenu } = Menu
const { Content, Sider } = AntLayout

const Layout: React.FC = (props: any) => {
  const history = useHistory()
  const { pathname } = useLocation()
  let [menus, setMenus] = useState<Array<React.ReactElement>>([])

  useEffect(() => {
    const getUser = async () => {
      const { data } = await getUserInfo()
      sessionStorage.setItem('userInfo', JSON.stringify(data))
      stores.UserInfoStore.setInfo(data)
    }
    getUser()

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
            {createMenu(menu.routes)}
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
      <AntLayout className={styles.layoutContent}>
        <Sider width={200} className={styles.siderBar}>
          <div className={styles.logo}>
            <Image
              className={styles.logoImg}
              preview={false}
              src="./img/pxx-logo.png"
            />
          </div>
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
        <AntLayout>
          <Header {...stores.UserInfoStore.getInfo} />
          <AntLayout className={styles.contentBox}>
            {
              !['/dashboard'].includes(pathname) && <Breadcrumb breads={props.LayoutStore.breadcrumb} />
            }
            <Content className={styles.content}>
              <div style={{ paddingBottom: '20px' }}>
                {props.children}
              </div>
            </Content>
          </AntLayout>
          <Footer />
        </AntLayout>
      </AntLayout>
    </>
  )
}

export default inject('LayoutStore')(observer(Layout))