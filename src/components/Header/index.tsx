import React from 'react'
import { Layout as AntLayout, Avatar, Image, Dropdown, Menu  } from 'antd';
import { UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import styles from './index.module.less'
import { logout } from '@/api'
const { useHistory } = require('react-router-dom')

const { Header: AntHeader } = AntLayout;
interface Props {
  avater?: string
}

const Header = (props: Props) => {
  const history = useHistory()

  const toUserInfo = ({ key }: { key: string }) => {    
    history.push(key)
  }

  const handleLogout = ({ key }: { key: string }) => {
    logout()
    history.push(key)
  }

  const menu = (
    <Menu>
      <Menu.Item icon={<UserOutlined />} key="/user-manage/user-info" onClick={toUserInfo}>个人信息</Menu.Item>
      <Menu.Divider key="divider" />
      <Menu.Item icon={<PoweroffOutlined />} key="/login" onClick={handleLogout}>退出登录</Menu.Item>
    </Menu>
  )

  return (
    <AntHeader className={styles.navHeader}>
      <Image
        className={styles.logo}
        preview={false}
        height={36}
        src="./img/pxx-logo.png"
      />
      <div className={styles.headerRight}>
        <Dropdown overlay={menu} arrow>
          <Avatar size="large" src={props.avater} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header