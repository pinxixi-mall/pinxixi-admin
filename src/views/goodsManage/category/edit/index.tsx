import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Select, ConfigProvider } from 'antd'
import { addGoodsCategory, updateGoodsCategory, getGoodsCategoryByLevel, getGoodsCategory, commonUpload } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import type { CategoryType } from '../index'
import { goodsCategoryLevelList } from '@/config/dataList'
import { validateMessages } from '@/config'
import Upload from '@/components/Upload'
const { Option } = Select

interface ModalFormType {
  visible: boolean;
  pageType?: string;
  detail: Partial<CategoryType>,
  onCancel(): void;
  onSuccess(): void;
}

const CategoryEdit: React.FC<ModalFormType> = ({ visible, onCancel, detail, onSuccess, pageType }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  // 一级分类
  const [categoryLevel1List, setCategoryLevel1List] = useState<Array<CategoryType>>([])
  // 二级分类
  const [categoryLevel2List, setCategoryLevel2List] = useState<Array<CategoryType>>([])
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  }

  // 重置表单
  useResetFormOnCloseModal({
    form,
    visible,
  })

  useEffect(() => {
    if (!visible) {
      setFileList([])
      return
    }
    if (pageType === 'EDIT') {
      init(detail)
      setFileList([{
        name: 'image.png',
        status: 'done',
        url: detail.categoryImage
      }])
    }
  }, [visible])

  // 回显
  const init = async (detail: Partial<CategoryType>) => {
    if (detail.categoryLevel) {
      await onLevelChange(detail.categoryLevel)

      if ([1, 2].includes(detail.categoryLevel)) {
        form.setFieldsValue({
          ...detail,
          categoryId1: detail.parentId
        })
      }

      if (detail.categoryLevel === 3) {
        // 如果是三级
        if (detail.parentId) {
          // 先查一级列表
          await onLevel1Change(detail.parentId)
          // 再查其父级
          const { data } = await getGoodsCategory(detail.parentId)
          // 再根据其父级查二级列表
          await onLevel1Change(data.parentId)
          form.setFieldsValue({
            ...detail,
            categoryId1: data.parentId,
            categoryId2: detail.parentId
          })
        }
      }
    }
  }

  // 根据级别查询一级分类列表
  const onLevelChange = async (level: number) => {
    setCategoryLevel1List([])
    setCategoryLevel2List([])
    // 清空一二级
    form.setFieldsValue({
      categoryId1: null,
      categoryId2: null
    })
    if (level === 1) {
      // 一级分类不需要查询父级分类
      return
    }
    // 二、三级先查出一级列表
    const { data } = await getGoodsCategoryByLevel({ categoryLevel: 1 })
    setCategoryLevel1List(data)
  }

  // 一级查二级
  const onLevel1Change = async (categoryId: number) => {
    // 清空二级
    form.setFieldsValue({
      categoryId2: null
    })
    const { data: list2 } = await getGoodsCategoryByLevel({ parentId: categoryId })
    setCategoryLevel2List(list2)
  }

  // 图片上传
  const handleUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data: { url } } = await commonUpload(formData)
    form.setFieldsValue({
      categoryImage: url
    })
    setFileList([{
      name: 'image.png',
      status: 'done',
      url
    }])
  }

  // 分类级别只允许修改到父级
  // 提交
  const handleOk = () => {
    setConfirmLoading(true)
    form.validateFields().then(async values => {
      setConfirmLoading(false)
      // 编辑参数
      let params: Record<string, number | string> = {
        categoryLevel: values.categoryLevel,
        parentId: 0, // 一级分类父级ID是0
        categoryName: values.categoryName,
        categorySort: values.categorySort,
        categoryImage: values.categoryImage,
      }
      // 如果是2、3级分类，取其上一级的分类ID
      if (values.categoryLevel === 2) {
        // 新增二级取一级分类id
        params.parentId = values.categoryId1
      } else if (values.categoryLevel === 3) {
        // 新增三级取二级分类id
        params.parentId = values.categoryId2
      }
      let ajaxFn = addGoodsCategory
      if (pageType === 'EDIT') {
        params.categoryId = values.categoryId
        ajaxFn = updateGoodsCategory
      }
      const { msg } = await ajaxFn(params)
      message.success(msg)
      onSuccess()
    }, () => {
      setConfirmLoading(false)
      message.error('操作失败')
    })
  }

  return (
    <Modal
      title={pageType === 'ADD' ? '新增' : '编辑'}
      visible={visible}
      maskClosable={false}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => onCancel()}
    >
      <ConfigProvider form={{ validateMessages }}>
        <Form form={form} {...layout} name="control-ref">
          {
            pageType === 'EDIT' &&
            <Form.Item
              name="categoryId"
              label="分类编号"
            >
              <Input disabled={true} />
            </Form.Item>
          }
          <Form.Item
            name="categoryLevel"
            label="分类级别"
            rules={[{
              required: true,
            }]}
          >
            <Select disabled={pageType === 'EDIT'} onChange={onLevelChange}>
              {
                goodsCategoryLevelList.map(c => (
                  <Option value={c.value} key={c.value}>{c.label}</Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.categoryLevel !== currentValues.categoryLevel}
          >
            {({ getFieldValue }) =>
              [2, 3].includes(getFieldValue('categoryLevel')) && (
                <Form.Item
                  name="categoryId1"
                  label="一级分类"
                  rules={[{ required: true }]}
                >
                  <Select disabled={pageType === 'EDIT' && getFieldValue('categoryLevel') === 3} onChange={onLevel1Change} placeholder="选择一级分类">
                    {
                      categoryLevel1List.map(c => (
                        <Option value={c.categoryId} key={c.categoryId}>{c.categoryName}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
          >
            {({ getFieldValue }) =>
              getFieldValue('categoryLevel') === 3 && (
                <Form.Item
                  name="categoryId2"
                  label="二级分类"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="选择二级分类">
                    {
                      categoryLevel2List.map(c => (
                        <Option value={c.categoryId} key={c.categoryId}>{c.categoryName}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{
              required: true,
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="categoryImage" label="缩略图" rules={[{ required: true }]}>
            <Upload fileList={fileList} handleUpload={handleUpload} />
          </Form.Item>
          <Form.Item
            name="categorySort"
            label="排序"
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}

export default CategoryEdit