import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, InputNumber, message, ConfigProvider, Image } from 'antd'
import { addRecommend, updateRecommend } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import type { RecommendProps } from '../index'
import { validateMessages } from '@/config'
import GoodsModal from '../goodsModal'
import { GoodsType } from '@/types'
const { TextArea, Search } = Input

interface ModalFormProps {
  visible: boolean;
  pageType?: string;
  detail: RecommendProps,
  onCancel(): void;
  onSuccess(): void;
}

const RecommendEdit: React.FC<ModalFormProps> = ({ visible, onCancel, detail, onSuccess, pageType }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [goodsVisible, setGoodsVisable] = useState<boolean>(false)
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

  const onGoodsModalVisable = () => {
    setGoodsVisable(true)
  }

  // 提交
  const handleOk = () => {
    setConfirmLoading(true)
    form.validateFields().then(async values => {
      setConfirmLoading(false)
      let ajaxFn = addRecommend
      if (pageType === 'EDIT') {
        values.recommendId = detail.recommendId
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

  // 商品选择回显
  const handleGoodsSelected = (goods: GoodsType) => {
    form.setFieldsValue(goods);
  }

  return (
    <>
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
            <Form.Item
              name="goodsName"
              label="商品名称"
              rules={[{ required: true }]}
            >
              {
                pageType === 'ADD' ? <Search
                placeholder="请选择"
                enterButton="选择"
                readOnly
                onSearch={onGoodsModalVisable}
              /> : <Input readOnly />
              }
            </Form.Item>
            <Form.Item
              name="goodsId"
              label="商品编号"
              rules={[{ required: true }]}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="商品图片"
              shouldUpdate={(prevValues, curValues) => prevValues.goodsImage !== curValues.goodsImage}
            >
              {({ getFieldValue }) => {
                const src = getFieldValue('goodsImage')
                return (
                  <Image src={src} width={140}/>
                )
              }}
            </Form.Item>
            <Form.Item
              name="recommendDesc"
              label="推荐描述"
              rules={[{ required: true }]}
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
              <InputNumber min={0}/>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </Modal>
      {
        goodsVisible && <GoodsModal
          visible={goodsVisible}
          goodsId={form.getFieldValue("goodsId")}
          onCancel={() => setGoodsVisable(false)}
          onSuccess={handleGoodsSelected}
        />
      }
    </>
  );
}

export default RecommendEdit