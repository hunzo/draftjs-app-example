import { convertToHTML } from 'draft-convert'
import { useState } from 'react'
import Modal from 'react-modal'
import { useEditor } from '../../context/editorProvider'
import './Preview.css'
const Preview: React.FC = () => {
  const [modal, setModal] = useState(false)
  const { editorState } = useEditor()

  const PreviewHtml = convertToHTML({
    entityToHTML: (entity, text) => {
      if (entity.type === 'image:file') {
        const { preview_url, alignment, width, file_name } = entity.data
        return (
          <p style={{ textAlign: alignment }}>
            <img src={preview_url} alt={file_name} width={width} />
          </p>
        )
      }
      if (entity.type === 'LINK') {
        const { url } = entity.data
        // console.log('convert link')
        return (
          <a rel="noopener noreferrer" target="_blank" href={url}>
            {text}
          </a>
        )
      }
    },
    blockToHTML: (block) => {
      if (block.type === 'unstyled' && block.text.length === 0) {
        return <br />
      }

      if (block.type === 'unstyled') {
        return (
          <p
            style={{
              margin: '1px 0 1px 0',
              padding: '0',
              whiteSpace: 'pre-wrap',
            }}
          />
        )
      }
    },
  })(editorState.getCurrentContent())

  return (
    <>
      <button onClick={() => setModal(true)}>Preview</button>
      <Modal
        isOpen={modal}
        ariaHideApp={false}
        overlayClassName="Overlay"
        className="Modal"
      >
        <button onClick={() => setModal(false)}>close</button>
        <h2>Preview Content</h2>

        <div
          className="preview-html"
          dangerouslySetInnerHTML={{
            __html: PreviewHtml,
          }}
        />
        <p>PreviewHtml: </p>
        <p className="preview-code-html">{PreviewHtml}</p>
      </Modal>
    </>
  )
}

export default Preview
