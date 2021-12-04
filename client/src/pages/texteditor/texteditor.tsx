import {
  convertToRaw,
  DraftEditorCommand,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  Modifier,
  RichUtils,
} from 'draft-js'
import SubjectRecipient from '../../components/SubjectRecipient/SubjectRecipient'
import { myBlockRenderer } from '../../components/texteditor/BlockRenderor/BlockRenderor'
import ToolBar from '../../components/toolbar/toolbar'
import { useEditor } from '../../context/editorProvider'

import './texteditor.css'

const TextEdtor: React.FC = () => {
  const { editorState, setEditorState } = useEditor()

  const _handleKeyCommand = (command: DraftEditorCommand) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      setEditorState(newState)
      return 'handled'
    } else {
      return 'not-handled'
    }
  }

  const _handleKeyBindingFn = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      // const tabCharactor = '    '
      const tabCharactor = '\t'
      const newContentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        tabCharactor
      )
      setEditorState(
        EditorState.push(editorState, newContentState, 'change-inline-style')
      )
      const blockType = RichUtils.getCurrentBlockType(editorState)
      console.log(blockType)

      if (
        blockType === 'ordered-list-item' ||
        blockType === 'unordered-list-item'
      ) {
        console.log('hey')
        const newState = RichUtils.onTab(e, editorState, 4)
        console.log(newState)
        setEditorState(newState)
        return getDefaultKeyBinding(e)
      }

      return 'Tab'
    }
    return getDefaultKeyBinding(e)
  }

  return (
    <div className="wrap-editor">
      <SubjectRecipient />
      <ToolBar />
      <div className="editor">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={_handleKeyCommand}
          blockRendererFn={myBlockRenderer}
          keyBindingFn={_handleKeyBindingFn}
          placeholder="Start here . . ."
        />
      </div>
      <DebugPreview />
    </div>
  )
}

const DebugPreview = () => {
  const { editorState } = useEditor()
  return (
    <>
      <pre className="preview">
        entityMap:
        {JSON.stringify(
          convertToRaw(editorState.getCurrentContent()).entityMap,
          null,
          2
        )}
      </pre>
      <pre className="preview">
        blocks:
        {JSON.stringify(
          convertToRaw(editorState.getCurrentContent()).blocks,
          null,
          2
        )}
      </pre>
    </>
  )
}

export default TextEdtor
