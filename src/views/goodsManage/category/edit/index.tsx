import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Select, ConfigProvider } from 'antd'
import { addGoodsCategory, updateGoodsCategory, getGoodsCategoryByLevel } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import type { CategoryProps } from '../index'
import { goodsCategoryLevelList } from '@/config/dataList'
import { validateMessages } from '@/config'
const { Option } = Select
interface ModalFormProps {
  visible: boolean;
  pageType?: string;
  detail: CategoryProps,
  onCancel: Function;
  onSuccess: () => void;
}

const CategoryEdit: React.FC<ModalFormProps> = ({ visible, onCancel, detail, onSuccess, pageType }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  // 一级分类
  const [categoryLevel1List, setCategoryLevel1List] = useState<Array<CategoryProps>>([])
  // 二级分类
  const [categoryLevel2List, setCategoryLevel2List] = useState<Array<CategoryProps>>([])
  const [form] = Form.useForm()

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
      return
    }
    if (pageType === 'EDIT') {
      form.setFieldsValue(detail)
    }
  }, [visible])

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
      // 新增一级分类不需要查询父级分类
      return
    }
    // 新增二、三级先查出一级列表
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

  // 提交
  const handleOk = () => {
    setConfirmLoading(true)
    form.validateFields().then(async values => {
      setConfirmLoading(false)
      // 编辑参数
      let params = {
        categoryLevel: values.categoryLevel,
        parentId: 0, // 一级分类父级ID是0
        categoryName: values.categoryName,
        categorySort: values.categorySort,
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
        params = values
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
            rules={[
              {
                required: true,
              }
            ]}
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
            shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
          >
            {({ getFieldValue }) =>
              [2, 3].includes(getFieldValue('categoryLevel')) && (
                <Form.Item
                  name="categoryId1"
                  label="一级分类"
                  rules={[{ required: true }]}
                >
                  <Select disabled={pageType === 'EDIT'} onChange={onLevel1Change} placeholder="选择一级分类">
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
                  <Select disabled={pageType === 'EDIT'} placeholder="选择二级分类">
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
            rules={[
              {
                required: true,
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categorySort"
            label="排序"
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}

export default CategoryEdit