import { EditorState } from 'draft-js'
import { createContext, useContext, useState } from 'react'
import { linkDecorator } from '../components/texteditor/LinkRenderor/LinkRenderor'

interface GlobalState {
  editorState: EditorState
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
}

export const editorContext = createContext<GlobalState | undefined>(undefined)

export const EditorProvider: React.FC = ({ children }) => {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(linkDecorator)
  )
  return (
    <editorContext.Provider value={{ editorState, setEditorState }}>
      {children}
    </editorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(editorContext)
  if (!context) throw new Error('useEditor must be call inside EditorProvider')
  return context
}
