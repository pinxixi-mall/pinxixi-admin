import React, { ReactNode } from 'react';
import { Form, Row, Col, Input, Button, Select } from 'antd'
import { SearchOutlined, UndoOutlined  } from '@ant-design/icons'
import styles from './index.module.less'
import type { SearchItemType } from '@/types'
const { Option } = Select

export interface SearchPannelProps {
  searchFormList: Array<any>;
  onSearch: Function;
}

const SearchPannel: React.FC<SearchPannelProps> = (props) => {
  const { searchFormList, onSearch } = props
  const [form] = Form.useForm();

  const getItemNode = (item: SearchItemType, idx: number) => {
    const { type, field, label, options, initialValue, placeholder } = item
    switch (type) {
      case 'INPUT':
        return (
          <Col key={idx}>
            <Form.Item
              name={field}
              label={label}
              initialValue={initialValue}
            >
              <Input placeholder={placeholder || `请输入${label}`} allowClear />
            </Form.Item>
          </Col>
        )
      case 'SELECT':
        return (
          <Col key={idx}>
            <Form.Item
              name={field}
              label={label}
              initialValue={initialValue}
            >
              <Select style={{ minWidth: 120 }}>
                {
                  options?.map((option: any, idx: number) => {
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
        <Row gutter={24}>
          {getFields()}
          <span className={styles.operBtn}>
            <Button className={styles.btn} type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
            <Button
              className={styles.btn}
              icon={<UndoOutlined />}
              onClick={() => {
                form.resetFields()
              }}
            >
              重置
            </Button>
          </span>
        </Row>
      </Form>
    </div>
  );
};

export default SearchPannel