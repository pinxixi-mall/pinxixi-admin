import { FC } from 'react'
import { Row, Col, Card, Tabs, Form, Input, Button, ConfigProvider, message } from 'antd'
import styles from './index.module.less'
import { useForm } from 'antd/es/form/Form'
import { validateMessages } from '@/config'
import { commonUpload, resetPassword, updateUserInfo } from '@/api'
import { UserInfo } from '@/types'
import Upload from '@/components/Upload';
import stores from '@/store'
import { inject, observer } from 'mobx-react'
import { setToken } from '@/utils/utils'
const { useHistory } = require('react-router-dom')

const { TabPane } = Tabs

const UserInfoFC: FC = (props: any) => {
  const history = useHistory()
  const [editForm] = useForm()
  const [resetForm] = useForm()
  const userInfo = props.UserInfoStore.getInfo || {}

  editForm.setFieldsValue(userInfo)

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  }
  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  }

  // 信息修改
  const onEditFinish = async (values: UserInfo) => {
    await editForm.validateFields()
    const { msg } = await updateUserInfo(values)
    message.success(msg)
    refreshUser(values)
  }

  // 密码重置
  const onResetFinish = async (values: any) => {
    await editForm.validateFields()
    const { msg } = await resetPassword(values)
    message.success(msg)
    sessionStorage.removeItem('userInfo')
    setToken(null)
    stores.UserInfoStore.setInfo(null)
    history.push('/login')
  }

   // 头像修改
   const handleAvatarUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data: { url } } = await commonUpload(formData)
    await updateUserInfo({ avatar: url })
    refreshUser({
      ...userInfo,
      avatar: url
    })
  }

  // 刷新用户信息
  const refreshUser = (data: UserInfo) => {
    stores.UserInfoStore.setInfo(data)
  }

  return (
    <section className={styles.container}>
      <Row className={styles.row} gutter={20}>
        <Col span={10}>
          <Card className={styles.info}>
            <div className={styles.avatar}>
              <Upload className={styles.avatarUploader} fileList={[{url: userInfo.avatar}]} handleUpload={handleAvatarUpload} />
              <div className={styles.name}>{userInfo.userName}</div>
            </div>
            <div className={styles.itemRow}>
              <div>昵 称</div>
              <div>{userInfo.nickName}</div>
            </div>
            <div className={styles.itemRow}>
              <div>手机号</div>
              <div>{userInfo.phone}</div>
            </div>
            <div className={styles.itemRow}>
              <div>邮 箱</div>
              <div>{userInfo.email}</div>
            </div>
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
                      <Input maxLength={11}/>
                    </Form.Item>
                    <Form.Item name="email" label="邮 箱" rules={[{ required: true }]}>
                      <Input />
                    </Form.Item>
                    <Form.Item {...tailLayout} style={{ marginTop: '40px' }}>
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
                    <Form.Item {...tailLayout} style={{ marginTop: '40px' }}>
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

export default inject('UserInfoStore')(observer(UserInfoFC))