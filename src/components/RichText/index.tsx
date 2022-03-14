
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import { FC } from 'react'
import { RichTextType } from '@/types'

const RichText: FC<RichTextType> = ({ value = '', onChange }) => {

  const handleEditorChange = (text: any) => {
    onChange(text)
  }

  return (
    <div>
      <BraftEditor
        className="rich-text"
        style={{ border: '1px solid #d9d9d9' }}
        value={BraftEditor.createEditorState(value)}
        onChange={handleEditorChange}
      />
    </div>
  )
}

export default RichText