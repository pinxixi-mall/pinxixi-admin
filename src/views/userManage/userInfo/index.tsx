import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Avatar, Tabs, Form, Input, Button, ConfigProvider } from 'antd'
import {  } from '@ant-design/icons'
import styles from './index.module.less'
import { useForm } from 'antd/es/form/Form'
import { validateMessages } from '@/config'
import { useRequest } from '@/hooks'
import { getUserInfo } from '@/api'
const { TabPane } = Tabs

const UserInfo: React.FC = () => {
  const [userInfo, setUserInfo] = useState()
  const [editForm] = useForm()
  const [resetForm] = useForm()
  const [loading, res] = useRequest({
    fetchApi: getUserInfo
  })

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  }

  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  }

  useEffect(() => {

  }, [])

  // 信息修改
  const onEditFinish = () => {

  }

  // 密码重置
  const onResetFinish = () => {

  }

  return (
    <section className={styles.container}>
      <Row className={styles.row} gutter={20}>
        <Col span={10}>
          <Card className={styles.info}>
            <div className={styles.avatar}>
              <Avatar size={100} src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />
              <p className={styles.name}>admin</p>
            </div>
            <p className={styles.itemRow}>
              <p>昵 称</p>
              <p>666</p>
            </p>
            <p className={styles.itemRow}>
              <p>手机号</p>
              <p>19999999999</p>
            </p>
            <p className={styles.itemRow}>
              <p>邮 箱</p>
              <p>123456@qq.com</p>
            </p>
          </Card>
        </Col>
        <Col span={14}>
          <Card className={styles.edit}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="信息修改" key="1" className={styles.tabpane}>
                <ConfigProvider form={{ validateMessages }}>
                  <Form {...layout} form={editForm} name="control-ref" onFinish={onEditFinish}>
                    <Form.Item name="nickName" label="昵 称" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item name="email" label="邮 箱" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout} style={{marginTop: '40px'}}>
                      <Button type="primary" htmlType="submit">保 存</Button>
                    </Form.Item>
                  </Form>
                </ConfigProvider>
              </TabPane>
              <TabPane tab="密码重置" key="2" className={styles.tabpane}>
                <ConfigProvider form={{ validateMessages }}>
                  <Form {...layout} form={resetForm} name="control-ref" onFinish={onResetFinish}>
                    <Form.Item name="oldPassword" label="原密码" rules={[{ required: true }]}>
                      <Input type="password" />
                    </Form.Item>
                    <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
                      <Input type="password" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" label="确认密码" rules={[{ required: true }]}>
                      <Input type="password" />
                    </Form.Item>
                    <Form.Item {...tailLayout} style={{marginTop: '40px'}}>
                      <Button type="primary" htmlType="submit">保 存</Button>
                    </Form.Item>
                  </Form>
                </ConfigProvider>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default UserInfo