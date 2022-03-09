import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, InputNumber, message } from 'antd'
import { addRecommend, updateRecommend } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import type { RecommendProps } from '../index'
const { TextArea } = Input
interface ModalFormProps {
  visible: boolean;
  pageType?: string;
  detail: RecommendProps,
  onCancel: Function;
  onSuccess: () => void;
}

const RecommendEdit: React.FC<ModalFormProps> = ({ visible, onCancel, detail, onSuccess, pageType }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
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

  // 提交
  const handleOk = () => {
    setConfirmLoading(true)
    form.validateFields().then(async values => {
      setConfirmLoading(false)
      let ajaxFn = addRecommend
      if (pageType === 'EDIT') {
        values.goodsId = detail.goodsId
        ajaxFn = updateRecommend
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
        <Form.Item
          name="goodsId"
          label="商品编号"
          rules={[
            {
              required: true,
              message: '编号不能为空'
            }
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="recommendName"
          label="推荐商品名称"
          rules={[
            {
              required: true,
              message: '名称不能为空'
            }
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          name="recommendUrl"
          label="跳转链接"
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          name="recommendSort"
          label="排序"
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RecommendEdit