import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Select, TreeSelect } from 'antd'
import { addGoodsCategory, updateGoodsCategory, getGoodsCategoryByLevel } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import type { CategoryProps } from '../index'
import { goodsCategoryLevelList } from '@/config/dataList'
const { TextArea } = Input
const { Option } = Select
const { TreeNode } = TreeSelect;

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
    //TODO 清空一二级
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
    //TODO 清空二级
    const { data: list2 } = await getGoodsCategoryByLevel({ parentId: categoryId })
    setCategoryLevel2List(list2)
  }

  // 提交
  const handleOk = () => {
    setConfirmLoading(true)
    form.validateFields().then(async values => {
      setConfirmLoading(false)
      let ajaxFn = addGoodsCategory
      if (pageType === 'EDIT') {
        values.categoryId = detail.categoryId
        ajaxFn = updateGoodsCategory
      }
      await ajaxFn(values)
      message.success('操作成功')
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
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => onCancel()}
    >
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
        {/* <Form.Item
          name="categoryLevel"
          label="分类级别"
          rules={[
            {
              required: true,
              message: '分类级别不能为空'
            }
          ]}
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="选择分类级别"
            allowClear
          >
            <TreeNode value="parent 1" title="parent 1">
              <TreeNode value="parent 1-0" title="parent 1-0">
                <TreeNode value="leaf1" title="my leaf" />
                <TreeNode value="leaf2" title="your leaf" />
              </TreeNode>
              <TreeNode value="parent 1-1" title="parent 1-1">
                <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
              </TreeNode>
            </TreeNode>
          </TreeSelect>
        </Form.Item> */}
        <Form.Item
          name="categoryLevel"
          label="分类级别"
          rules={[
            {
              required: true,
              message: '分类级别不能为空'
            }
          ]}
        >
          <Select disabled={pageType === 'EDIT'} onChange={onLevelChange}>
            {
              goodsCategoryLevelList.map(c => (
                <Option value={c.value}>{c.label}</Option>
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
                <Select disabled={pageType === 'EDIT'} onChange={onLevel1Change}>
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
                <Select disabled={pageType === 'EDIT'}>
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
        {/* <Form.Item
          name="parentId"
          label="二级分类"
          rules={[
            {
              required: true,
              message: '二级分类不能为空'
            }
          ]}
        >
          <Select disabled={pageType === 'EDIT'}>
            {
              categoryLevel2List.map(c => (
                <Option value={c.categoryId}>{c.categoryName}</Option>
              ))
            }
          </Select>
        </Form.Item> */}
        <Form.Item
          name="categoryName"
          label="分类名称"
          rules={[
            {
              required: true,
              message: '分类名称不能为空'
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
    </Modal>
  );
}

export default CategoryEdit