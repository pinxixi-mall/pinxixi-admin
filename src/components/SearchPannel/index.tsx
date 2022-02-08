import React, { ReactNode } from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { SearchOutlined  } from '@ant-design/icons'
import styles from './index.module.less'
const { Option } = Select
export interface SearchFormProps {
  type: string;
  label: string;
  field: string;
  initialValue?: string | number | undefined;
  options?: object[]
}

export interface SearchPannelProps {
  searchFormList: Array<any>;
  onSearch: Function;
}

const SearchPannel: React.FC<SearchPannelProps> = (props) => {
  const { searchFormList, onSearch } = props
  const [form] = Form.useForm();

  const getItemNode = (item: any, idx: number) => {
    const { type, field, label, options, initialValue } = item
    switch (type) {
      case 'INPUT':
        return (
          <Col span={8} key={idx}>
            <Form.Item
              name={field}
              label={label}
              initialValue={initialValue}
            >
              <Input placeholder={`请输入${label}`} allowClear />
            </Form.Item>
          </Col>
        )
      case 'SELECT':
        return (
          <Col span={8} key={idx}>
            <Form.Item
              name={field}
              label={label}
              initialValue={initialValue}
            >
              <Select>
                {
                  options.map((option: any, idx: number) => {
                    return <Option value={option.value} key={idx}>{option.label}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        )
      default:
        break;
    }
  }

  const getFields = () => {
    const children: ReactNode[] = []

    searchFormList.forEach((it: any, idx: number) => {
      children.push(getItemNode(it, idx))
    })
    return children
  }

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    onSearch(values)
  }

  return (
    <div className={styles.formWrapper}>
      <Form
        form={form}
        name="advanced_search"
        className={styles.searchForm}
        onFinish={onFinish}
      >
        <Row gutter={24}>{getFields()}</Row>
        <Row>
          <Col
            span={24}
            style={{
              textAlign: 'right',
            }}
          >
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => {
                form.resetFields()
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchPannel