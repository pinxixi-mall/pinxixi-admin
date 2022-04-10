import { useState, useEffect, FC, ReactElement } from "react"
import { Form, Input, message, InputNumber, Radio, ConfigProvider, TreeSelect } from 'antd'
import BodyCard from '@/components/BodyCard'
import Upload from '@/components/Upload'
import RichText from '@/components/RichText'
import { commonUpload, addGoods, updateGoods, goodsDetial, getGoodsCategorys } from '@/api'
import { goodsStatusList } from "@/config/dataList"
import { validateMessages } from "@/config"
import { useRequest } from "@/hooks"
const { useHistory } = require('react-router-dom')
const url = require('url')
const { TextArea } = Input
const { TreeNode } = TreeSelect

const GoodsEdit: FC = (): ReactElement => {
  const [goodsId, setGoodsId] = useState<number>()
  const [refresh, setRefresh] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])
  const [categoryTree, setCategoryTree] = useState<any>()
  const [loading, res] = useRequest({
    fetchApi: getGoodsCategorys,
    deps: []
  })
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
      setFileList([{
        name: 'image.png',
        status: 'done',
        url: data.goodsImage
      }])
    }
    id && getDetail(id)
  }, [refresh])

  // 商品分类
  useEffect(() => {
    if (res) {
      const { data } = res
      setCategoryTree(data)
    }
  }, [res])

  // 提交
  const onSubmit = async () => {
    const validateRes = await form.validateFields()
    validateRes.goodsDetail = validateRes.goodsDetail.toHTML()
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
    setFileList([{
      name: 'image.png',
      status: 'done',
      url
    }])
  }

  // 详情更新
  const onDetailChange = (value: any) => {
    form.setFieldsValue({
      goodsDetail: value
    })
  }

  // 刷新
  const handleRefresh = () => {
    if (goodsId) {
      setRefresh(!refresh)
    } else {
      form.resetFields()
    }
  }

  // 手动渲染树形菜单
  const renderTreeNode = (data: any) => (
    data && data.map((it: any) => {
      if (it.children) {
        return (
          // 如果有子级，设置为，只能选最后一级分类
          <TreeNode selectable={false} value={it.categoryId} title={it.categoryName} key={it.categoryId}>
            {renderTreeNode(it.children)}
          </TreeNode>
        )
      }
      return <TreeNode value={it.categoryId} title={it.categoryName} key={it.categoryId} />
    })
  )

  return (
    <>
      <BodyCard
        onSubmit={onSubmit}
        onRefresh={handleRefresh}
      >
        <ConfigProvider form={{ validateMessages }}>
          <Form {...layout} name="basicForm" form={form}>
            <Form.Item name="goodsName" label="商品名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="goodsCategoryId" label="商品分类" rules={[{ required: true }]}>
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="选择分类"
              >
                {renderTreeNode(categoryTree)}
              </TreeSelect>
            </Form.Item>
            {/* <Form.Item name="goodsType" label="商品类型" rules={[{ required: true }]}>
              <Radio.Group
                options={goodsTypeList}
                optionType="button"
              />
            </Form.Item> */}
            <Form.Item name="goodsDesc" label="商品描述" rules={[{ required: true }]}>
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="goodsImage" label="商品主图" rules={[{ required: true }]}>
              <Upload fileList={fileList} handleUpload={handleUpload} />
            </Form.Item>
            <Form.Item name="goodsPrice" label="商品价格" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="goodsStock" label="商品库存" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="goodsStatus" label="商品状态" rules={[{ required: true }]}>
              <Radio.Group
                options={goodsStatusList}
                optionType="button"
              />
            </Form.Item>
            <Form.Item name="goodsDetail" label="商品详情" rules={[{ required: true }]}>
              <RichText onChange={onDetailChange} />
            </Form.Item>
          </Form>
        </ConfigProvider>
      </BodyCard>
    </>
  )
}

export default GoodsEdit
