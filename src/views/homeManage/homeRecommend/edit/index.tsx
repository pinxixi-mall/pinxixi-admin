import React, { useState, useEffect, FC, ReactElement, useMemo } from "react"
import { Button, Form, Input, message } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import BodyCard from '@/components/BodyCard'
import Upload from '@/components/Upload'
import RichText from '@/components/RichText'
import { commonUpload, updateRecommend, recommendDetail } from '@/api'
import BraftEditor from 'braft-editor'
const { useHistory } = require('react-router-dom')
const url = require('url')

const RecommendEdit: FC = (pops: any): ReactElement => {
  const [recommendId, setRecommendId] = useState<number>()
  const [refresh, setRefresh] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])
  const history = useHistory()

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  }

  // 初始化
  useEffect(() => {
    const { id } = url.parse(history.location.search, true).query
    setRecommendId(id)
    const getDetail = async (id: string) => {
      const { data } = await recommendDetail({ recommendId: id })
      form.setFieldsValue(data)
      setFileList([
        {
          name: 'image.png',
          status: 'done',
          url: data.imageUrl
        }
      ])
    }
    id && getDetail(id)
  }, [refresh])

  // 提交
  const onSubmit = async (values: any) => {
    const validateRes = await form.validateFields()
    recommendId && (validateRes['recommendId'] = recommendId)
    validateRes.detail = validateRes.detail.toHTML()
    const { code} = await updateRecommend(validateRes)
    message.success('操作成功')
    history.push('/product-manage/home-recomend')
  }

  // 图片上传
  const handleUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data: { url } } = await commonUpload(formData)
    form.setFieldsValue({
      imageUrl: url
    })
    setFileList([
      {
        name: 'image.png',
        status: 'done',
        url
      }
    ])
  }

  // 详情更新
  const onDetailChange = (value: any) => {
    console.log(111,value);
    form.setFieldsValue({
      detail: value
    })
  }

  // 刷新
  const handleRefresh = () => {
    setRefresh(!refresh)
  }

  return (
    <>
      <BodyCard
        onSubmit={onSubmit}
        onRefresh={handleRefresh}
      >
        <Form {...layout} name="basicForm" form={form}>
          <Form.Item name="description" label="活动标题：" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="imageUrl" label="活动图片：" rules={[{ required: true }]}>
            <Upload fileList={fileList} handleUpload={handleUpload} />
          </Form.Item>
          <Form.Item name="detail" label="活动详情：" rules={[{ required: true }]}>
            <RichText onChange={onDetailChange} />
          </Form.Item>
          <Form.Item name="price" label="价格：" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sort" label="排序：" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态：" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </BodyCard>
    </>
  )
}

export default RecommendEdit
