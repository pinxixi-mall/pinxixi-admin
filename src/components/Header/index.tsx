import { FC } from 'react'
import { Layout as AntLayout, Avatar, Dropdown, Menu, Input, Badge, Divider  } from 'antd';
import { UserOutlined, PoweroffOutlined, SearchOutlined, BellOutlined, MessageOutlined } from '@ant-design/icons';
import styles from './index.module.less'
import { logout } from '@/api'
import { UserInfo } from "@/types"
import { setToken } from '@/utils/utils'
import stores from '@/store';
const { useHistory } = require('react-router-dom')
const { Header: AntHeader } = AntLayout;

const Header: FC<UserInfo> = (props: UserInfo) => {
  const history = useHistory()

  const toUserInfo = ({ key }: { key: string }) => {    
    history.push(key)
  }

  const handleLogout = async ({ key }: { key: string }) => {
    await logout()
    sessionStorage.removeItem('userInfo')
    setToken(null)
    stores.UserInfoStore.setInfo(null)
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
        <Input placeholder="搜索(TODO)" prefix={<SearchOutlined />} />
      </div>
      <div className={styles.headerRight}>
        <div className={styles.rightItem}>
          <Badge count={3} overflowCount={99} className={styles.tag}>
            <BellOutlined />
          </Badge>
          <Badge count={6} overflowCount={99} className={styles.tag}>
            <MessageOutlined />
          </Badge>
        </div>
        <Divider type="vertical" style={{height: '50%', color: '#666'}} />
        <div className={styles.rightItem}>
          <span className={styles.userName}>{props.userName}</span>
          <Dropdown overlay={menu} placement="bottomRight" arrow>
            <Avatar size="large" src={props.avatar} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  )
}

export default Header