import { FC, ReactElement } from 'react'
import { Form, Input, Modal, InputNumber, message, Upload as AntUpload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadProps } from '@/types'

const Upload: FC<UploadProps> = ({ fileList, handleRemove, handleUpload }): ReactElement => {

  const onbeforeUpload = (file: any): boolean => {
    let flag = true
    const { size, type } = file
    if (size > 2048000) {
      message.error('图片大小不能大于2M')
      flag = false
    }
    return flag
  }

  const uploadProps: {} = {
    listType: "picture-card",
    maxCount: 1,
    accept: '.png,.jpeg,.jpg',
    onRemove: (file: any) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)

      // setFileList(newFileList)
      // form.setFieldsValue({
      //   imageUrl: ''
      // })

      handleRemove && handleRemove(newFileList)

      return false
    },
    beforeUpload: (file: any) => {
      onbeforeUpload(file) && handleUpload && handleUpload(file)
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
    <>
      <AntUpload {...uploadProps} >
        <div>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>{fileList.length === 1 ? '重新上传' : '上传'}</div>
        </div>
      </AntUpload>
    </>
  )
}

export default Upload