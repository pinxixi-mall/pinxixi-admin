import { FC } from 'react'
import { Layout as AntLayout, Avatar, Dropdown, Menu, Input  } from 'antd';
import { UserOutlined, PoweroffOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './index.module.less'
import { logout } from '@/api'
import { UserInfoType } from "@/types"
import { setToken } from '@/utils/utils'
const { useHistory } = require('react-router-dom')
const { Header: AntHeader } = AntLayout;

const Header: FC<UserInfoType> = (props: UserInfoType) => {
  const history = useHistory()

  const toUserInfo = ({ key }: { key: string }) => {    
    history.push(key)
  }

  const handleLogout = async ({ key }: { key: string }) => {
    await logout()
    sessionStorage.removeItem('userInfo')
    setToken(null)
    history.push(key)
  }

  const menu = (
    <Menu>
      <Menu.Item icon={<UserOutlined />} key="/user-manage/user-info" onClick={toUserInfo}>用户信息</Menu.Item>
      <Menu.Divider key="divider" />
      <Menu.Item icon={<PoweroffOutlined />} key="/login" onClick={handleLogout}>退出登录</Menu.Item>
    </Menu>
  )

  return (
    <AntHeader className={styles.navHeader}>
      <div className={styles.headerLeft}>
        <Input placeholder="搜索" prefix={<SearchOutlined />} />
      </div>
      <div className={styles.headerRight}>
        <span className={styles.userName}>{props.userName}</span>
        <Dropdown overlay={menu} placement="bottomRight" arrow>
          <Avatar size="large" src={props.avatar} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header