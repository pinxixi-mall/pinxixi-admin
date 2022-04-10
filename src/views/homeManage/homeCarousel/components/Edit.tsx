import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, InputNumber, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { addHomeCarousel, updateHomeCarousel, commonUpload } from '@/api'
import { useResetFormOnCloseModal } from '@/utils/common'
import type { CarouselType } from '../index'
const { TextArea } = Input
interface ModalFormType {
  visible: boolean;
  pageType?: string;
  detail: CarouselType,
  onCancel: Function;
  onSuccess: () => void;
}

const CarouselEdit: React.FC<ModalFormType> = ({ visible, onCancel, detail, onSuccess, pageType }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<Array<any>>([])

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
      form.setFieldsValue(detail)
      setFileList([{
        name: 'image.png',
        status: 'done',
        url: detail.carouselImage
      }])
    }
  }, [visible])

  // 提交
  const handleOk = () => {
    setConfirmLoading(true)
    form.validateFields().then(async values => {
      setConfirmLoading(false)
      let ajaxFn = addHomeCarousel
      if (pageType === 'EDIT') {
        values.carouselId = detail.carouselId
        ajaxFn = updateHomeCarousel
      }
      await ajaxFn(values)
      message.success('操作成功')
      onSuccess()
    }, () => {
      setConfirmLoading(false)
      message.error('操作失败')
    })
  }

  const onbeforeUpload = (file: any): boolean => {
    let flag = true
    const { size, type } = file
    if (size > 2048000) {
      message.error('图片大小不能大于2M')
      flag = false
    }
    return flag
  }

  const handleUpload = async (file: any) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data: { url } } = await commonUpload(formData)
    form.setFieldsValue({
      carouselImage: url
    })
    setFileList([
      {
        name: 'image.png',
        status: 'done',
        url
      }
    ])
  }

  const uploadProps: {} = {
    listType: "picture-card",
    maxCount: 1,
    accept: '.png,.jpeg,.jpg',
    onRemove: (file: any) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
      form.setFieldsValue({
        carouselImage: ''
      })
      return false
    },
    beforeUpload: (file: any) => {
      onbeforeUpload(file) && handleUpload(file)
      return false
    },
    onPreview: async (file: any) => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        })
      }
      const image = new Image()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow && imgWindow.document.write(image.outerHTML)
    },
    fileList,
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
      <Form form={form} {...layout} name="control-ref">
        <Form.Item
          name="carouselImage"
          label="图片"
          rules={[
            {
              required: true,
              message: '请上传图片'
            }
          ]}
        >
          <Upload {...uploadProps} >
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>{fileList.length === 1 ? '重新上传' : '上传'}</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          name="carouselUrl"
          label="跳转链接"
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          name="carouselSort"
          label="排序"
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CarouselEdit