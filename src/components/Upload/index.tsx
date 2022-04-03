import { FC, ReactElement } from 'react'
import { message, Upload as AntUpload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { UploadProps } from '@/types'
import { IMAGE_MAX_SIZE } from '@/config'

/**
 * 目前只支持图片上传
 * @param param0 
 * @returns 
 */
const Upload: FC<UploadProps> = (props: UploadProps): ReactElement => {
  const { className, fileList, accept = '.png,.jpeg,.jpg', handleRemove, handleUpload } = props

  const onbeforeUpload = (file: any): boolean => {
    let flag = true
    const { size, type } = file
    if (size > IMAGE_MAX_SIZE) {
      message.error(`图片大小不能大于${IMAGE_MAX_SIZE / 1024 / 1000}M`)
      flag = false
    }
    return flag
  }

  const uploadProps: {} = {
    listType: "picture-card",
    maxCount: 1,
    accept,
    showUploadList: false,
    onRemove: (file: any) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)

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
    <AntUpload {...uploadProps} className={className}>
      <div>
        {fileList.length === 1 ? <img src={fileList[0].url} alt="avatar" style={{ width: '100%' }} /> : <UploadOutlined />}
      </div>
    </AntUpload>
  )
}

export default Upload