import { convertFromRaw, convertToRaw, EditorState, RichUtils } from 'draft-js'
import { useEditor } from '../../context/editorProvider'
import { useSession } from '../../context/SessionProvider'
import { ClearImage } from '../../services/Api'
import Preview from '../Preview/Preview'
import SendMail from '../SendMail/SendMail'
import { linkDecorator } from '../texteditor/LinkRenderor/LinkRenderor'
import Upload from '../Upload/Upload'
import './toolbar.css'

const ToolBar: React.FC = () => {
  const { editorState, setEditorState } = useEditor()
  // save and load
  const { draft, setDraft } = useSession()
  const saveState = () => {
    const content = editorState.getCurrentContent()
    setDraft(JSON.stringify(convertToRaw(content)))
  }

  const loadState = () => {
    setEditorState(
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(draft)),
        linkDecorator
      )
    )
  }
  // text decoration
  const handleBlockClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault()
    setEditorState(RichUtils.toggleBlockType(editorState, inlineStyle))
  }

  const handleToggleClick = (e: React.MouseEvent, inlineStyle: string) => {
    e.preventDefault()
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle))
  }

  const handleAddLink = () => {
    const selection = editorState.getSelection()
    const link = prompt('please insert image link')
    if (!link) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null))
      return
    }
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {
        url: link,
      }
    )
    const newEditorState = EditorState.push(
      editorState,
      contentStateWithEntity,
      'apply-entity'
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey))
  }

  const handleRemoveLink = () => {
    const selection = editorState.getSelection()
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null))
    }
  }

  const handleClearImage = () => {
    ClearImage()
      .then((r) => {
        alert(JSON.stringify(r.data, null, 2))
      })
      .catch((e) => {
        alert(JSON.stringify(e))
      })
  }

  const BLOCK_BUTTON = [
    { style: 'header-one', name: 'H1' },
    { style: 'header-two', name: 'H2' },
    { style: 'header-three', name: 'H3' },
    { style: 'header-four', name: 'H4' },
    { style: 'header-five', name: 'H5' },
    { style: 'header-six', name: 'H6' },
    { style: 'ordered-list-item', name: 'Ordered List' },
    { style: 'unordered-list-item', name: 'Unordered List' },
    // { style: 'code-block', name: 'Code Block' },
    { style: 'blockquote', name: 'Blockquote' },
    { style: 'text-align-left', name: 'AL' },
    { style: 'text-align-center', name: 'AC' },
    { style: 'text-align-right', name: 'AR' },
  ]
  const INLINE_BUTTON = [
    { style: 'unstyled', name: 'normal' },
    { style: 'BOLD', name: 'B' },
    { style: 'ITALIC', name: 'I' },
    { style: 'UNDERLINE', name: 'U' },
    { style: 'STRIKETHROUGH', name: 'Strike-throught' },
    { style: 'CODE', name: 'Mono space' },
  ]

  return (
    <div className="toolbar">
      <div className="toolbar-inline-top">
        {BLOCK_BUTTON.map((i) => (
          <button
            key={i.style}
            onMouseDown={(e) => handleBlockClick(e, i.style)}
          >
            {i.name}
          </button>
        ))}
      </div>
      <div className="toolbar-inline-center">
        {INLINE_BUTTON.map((i) => (
          <button
            key={i.style}
            onMouseDown={(e) => handleToggleClick(e, i.style)}
          >
            {i.name}
          </button>
        ))}
        <button
          disabled={editorState.getSelection().isCollapsed()}
          onMouseDown={(e) => {
            e.preventDefault()
            handleAddLink()
          }}
        >
          Link
        </button>
        <button
          disabled={editorState.getSelection().isCollapsed()}
          onMouseDown={(e) => {
            e.preventDefault()
            handleRemoveLink()
          }}
        >
          removeLink
        </button>
      </div>
      <div className="toolbar-inline-bottom">
        <Upload />
        <Preview />
        <button onClick={saveState}>Save to LocalStorage</button>
        <button onClick={loadState}>Load from LocalStorage</button>
        <SendMail />
        <button onClick={handleClearImage}>ClearImage</button>
      </div>
    </div>
  )
}

export default ToolBar
