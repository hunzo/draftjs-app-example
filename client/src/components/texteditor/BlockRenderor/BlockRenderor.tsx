import { ContentBlock, ContentState, EditorState } from 'draft-js'
import { CSSProperties, useState } from 'react'
import { useEditor } from '../../../context/editorProvider'

import './BlockRenderor.css'
interface BlockComponentProps {
  contentState: ContentState
  block: ContentBlock
}

export const myBlockRenderer = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType()
  if (type === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
    }
  }
}

export const MediaComponent: React.FC<BlockComponentProps> = (
  props: BlockComponentProps
) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))
  let media = null

  switch (entity.getType()) {
    case 'image:file':
      // media = <SimpleImageComponent {...props} />
      media = <ImageComponent {...props} />
      break
    // ex. video, embended, link
    // case 'video':
    //     console.log('video case')
    //     break
    default:
      media = null
      break
  }

  return media
}

const ImageComponent: React.FC<BlockComponentProps> = (
  props: BlockComponentProps
) => {
  const entity = props.contentState?.getEntity(props.block.getEntityAt(0))
  const { editorState, setEditorState } = useEditor()

  const { preview_url, width, file_name, file_size, file_type, alignment } =
    entity.getData()

  const [imgSize, setImgSize] = useState<number>(width)
  const [hover, setHover] = useState(false)
  const [imgAlingment, setImgAlignment] = useState(alignment)

  const info = `file_name: ${file_name} file_size: ${file_size} file_type: ${file_type}`

  const setAlignment = (alignment: string) => {
    // set for state
    const entityKey = props.block.getEntityAt(0)
    props.contentState.mergeEntityData(entityKey, { alignment })
    setEditorState(
      EditorState.forceSelection(editorState, editorState.getSelection())
    )
    //set for renderer
    setImgAlignment(alignment)
  }

  const setSize = (size: number) => {
    //set for State
    const entityKey = props.block.getEntityAt(0)
    props.contentState.mergeEntityData(entityKey, { width: size })
    setEditorState(
      EditorState.forceSelection(editorState, editorState.getSelection())
    )
    //set for renderer
    setImgSize(size)
  }

  const styled: CSSProperties = {
    textAlign: imgAlingment,
  }

  return (
    <div
      className="box"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styled}>
        <img className="image" src={preview_url} width={imgSize} alt={info} />
      </div>
      {hover ? (
        <div className="wrap-editor">
          <div className="img-editor">
            <button
              className="img-editor-btn"
              onClick={() => setAlignment('left')}
            >
              L
            </button>
            <button
              className="img-editor-btn"
              onClick={() => setAlignment('center')}
            >
              C
            </button>
            <button
              className="img-editor-btn"
              onClick={() => setAlignment('right')}
            >
              R
            </button>
            <button
              className="img-editor-btn"
              onClick={() => setSize(imgSize + 10)}
            >
              +
            </button>
            <button
              className="img-editor-btn"
              onClick={() => setSize(imgSize - 10)}
            >
              -
            </button>
            <span className="img-info">
              imgsize: {imgSize}px alignment: {alignment}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
