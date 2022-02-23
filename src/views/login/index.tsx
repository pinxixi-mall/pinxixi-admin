import { useEffect, FC, ReactElement, useState } from "react";
import { Form, Input, Button, Checkbox, Image } from "antd";
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { login } from '@/api'
import { setToken } from '@/utils/utils'
import VerifyCode from "@/components/VerifyCode"
// import VerifyCode from "@/components/verify-code-react"
const { useHistory } = require('react-router-dom')
const url = require('url')

type SubmitValues = {
  username: string;
  password: string;
  verifyCode: string;
  remember: boolean;
}

const Login: FC = (): ReactElement => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [verifyImgCode, setVerifyImgCode] = useState<string>()

  useEffect(() => {
    setToken(null)
    document.addEventListener('keydown', (e) => {
      e.key === 'Enter' && form.validateFields()
    })
  }, [form])

  const onVerifyCodeChange = (code: string) : void => {
    setVerifyImgCode(code)
  }

  const onFinish = async (values: SubmitValues) => {
    const { redirect } = url.parse(history.location.search, true).query
    const { data: { token, userInfo } } = await login(values)
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    setToken(token)
    history.push(redirect || '/home')
  }

  return (
    <div className={styles.loginBox}>
      <Form
        form={form}
        name="normal_login"
        className={styles.loginForm}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <section className={styles.logo}>
          {/* <Image
            preview={false}
            height={50}
            src="img/pxx-logo.png"
          /> */}
          <span className={styles.name}>后台管理系统</span>
        </section>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
          ]}
        >
          <Input.Password
            size="large"
            placeholder="密码"
            prefix={<LockOutlined className="site-form-item-icon" />}
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <Form.Item style={{marginBottom:'10px'}}>
          <Input.Group className={styles.verify}>
            <Form.Item
              style={{marginBottom:0}}
              name="verifyCode"
              rules={[
                {
                  validator: (_, value) =>
                    !value
                    ? Promise.reject(new Error('请输入验证码'))
                    : value.toLocaleLowerCase() !== verifyImgCode?.toLocaleLowerCase()
                    ? Promise.reject(new Error('验证码不正确'))
                    : Promise.resolve() 
                },
              ]}>
              <Input
                className={styles.verifyInput}
                size="large"
                placeholder="验证码"
                maxLength={4}
                prefix={<SafetyCertificateOutlined />}
              />
            </Form.Item>
            <VerifyCode width={120} height={40} length={4} change={onVerifyCodeChange}/>
          </Input.Group>
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className="login-form-button"
            block
          >
            登 录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
