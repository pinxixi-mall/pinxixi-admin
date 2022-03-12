import React, { useState, useEffect, FC, ReactElement, useMemo } from "react"
import { Button, Form, Input, message, InputNumber, Radio } from 'antd'
import BodyCard from '@/components/BodyCard'
import Upload from '@/components/Upload'
import RichText from '@/components/RichText'
import { commonUpload, addGoods, updateGoods, goodsDetial } from '@/api'
import { goodsTypeList, goodsStatusList } from "@/config/dataList"
const { useHistory } = require('react-router-dom')
const url = require('url')
const { TextArea } = Input

const GoodsEdit: FC = (pops: any): ReactElement => {
  const [goodsId, setGoodsId] = useState<number>()
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
    setGoodsId(id)
    const getDetail = async (id: number) => {
      const { data } = await goodsDetial(id)
      form.setFieldsValue(data)
      setFileList([
        {
          name: 'image.png',
          status: 'done',
          url: data.goodsImage
        }
      ])
    }
    id && getDetail(id)
  }, [refresh])

  // 提交
  const onSubmit = async (values: any) => {
    // validateRes.detail = validateRes.detail.toHTML()
    const validateRes = await form.validateFields()
    goodsId && (validateRes['goodsId'] = goodsId * 1)
    let fetchApi = goodsId ? updateGoods : addGoods
    const { msg } = await fetchApi(validateRes)
    message.success(msg)
    history.push('/goods-manage/goods')
  }

  // 图片上传
  const handleUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data: { url } } = await commonUpload(formData)
    form.setFieldsValue({
      goodsImage: url
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
          <Form.Item name="goodsName" label="商品名称：" rules={[{ required: true, message: "商品名称不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="goodsCategoryId" label="商品分类：" rules={[{ required: true, message: "商品分类不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="goodsType" label="商品类型：" rules={[{ required: true, message: "商品类型不能为空" }]}>
          <Radio.Group
              options={goodsTypeList}
              optionType="button"
            />
          </Form.Item>
          <Form.Item name="goodsDesc" label="商品描述：" rules={[{ required: true, message: "商品描述不能为空" }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="goodsImage" label="商品主图：" rules={[{ required: true, message: "商品主图不能为空" }]}>
            <Upload fileList={fileList} handleUpload={handleUpload} />
          </Form.Item>
          <Form.Item name="goodsPrice" label="价格：" rules={[{ required: true, message: "商品价格不能为空" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="goodsStock" label="库存：" rules={[{ required: true, message: "商品名称不能为空" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item name="goodsStatus" label="状态：" rules={[{ required: true, message: "商品状态不能为空" }]}>
            <Radio.Group
              options={goodsStatusList}
              optionType="button"
            />
          </Form.Item>
          <Form.Item name="goodsDetail" label="商品详情：" rules={[{ required: true, message: "商品详情不能为空" }]}>
            {/* <RichText onChange={onDetailChange} /> */}
            <Input />
          </Form.Item>
        </Form>
      </BodyCard>
    </>
  )
}

export default GoodsEdit
