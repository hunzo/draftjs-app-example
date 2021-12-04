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

  return (
    <div className="toolbar">
      <div className="toolbar-inline-top">
        <button onMouseDown={(e) => handleBlockClick(e, 'header-one')}>
          H1
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'header-two')}>
          H2
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'header-three')}>
          H3
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'header-four')}>
          H4
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'header-five')}>
          H5
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'header-six')}>
          H6
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'ordered-list-item')}>
          ordered list
        </button>
        <button onMouseDown={(e) => handleBlockClick(e, 'unordered-list-item')}>
          unordered list
        </button>
      </div>
      <div className="toolbar-inline-center">
        <button onMouseDown={(e) => handleToggleClick(e, 'unstyled')}>
          Normal
        </button>
        <button onMouseDown={(e) => handleToggleClick(e, 'BOLD')}>
          <b>B</b>
        </button>
        <button onMouseDown={(e) => handleToggleClick(e, 'UNDERLINE')}>
          <u>U</u>
        </button>
        <button onMouseDown={(e) => handleToggleClick(e, 'ITALIC')}>
          <i>I</i>
        </button>
        <button onMouseDown={(e) => handleToggleClick(e, 'STRIKETHROUGH')}>
          strikethrough
        </button>
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
