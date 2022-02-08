
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { FC } from 'react'
import { RichTextProps } from '@/types'

const RichText: FC<RichTextProps> = ({ value = '', onChange }) => {

  const handleEditorChange = (text: any) => {
    onChange(text)
  }

  return (
    <>
      <div>
        <BraftEditor
          style={{border:"1px solid #d9d9d9",height:"500px"}}
          value={BraftEditor.createEditorState(value)}
          onChange={handleEditorChange}
        />
      </div>
    </>
  )
}

export default RichText