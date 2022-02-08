import { useEffect, FC, ReactElement } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "./login.module.less";
import { login } from '@/api'
import { setToken } from '@/utils/utils'
const { useHistory } = require('react-router-dom')
const url = require('url')

type SubmitValues = {
  username: string;
  password: string;
  remember: boolean;
}

const Login: FC = (): ReactElement => {
  const history = useHistory()
  const [form] = Form.useForm()

  useEffect(() => {
    setToken(null)
    document.addEventListener('keydown', (e) => {
      e.key === 'Enter' && form.validateFields()
    })
  }, [])

  const onFinish = async (values: SubmitValues) => {
    const { redirect } = url.parse(history.location.search, true).query
    const { data: { token, userInfo } } = await login(values)
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    setToken(token)
    history.push(redirect || '/home')
  };

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
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className="login-form-button"
            block
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
