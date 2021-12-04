import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { EditorProvider } from './context/editorProvider'
import { SessionProvider } from './context/SessionProvider'

ReactDOM.render(
  <SessionProvider>
    <BrowserRouter>
      <React.StrictMode>
        <EditorProvider>
          <App />
        </EditorProvider>
      </React.StrictMode>
    </BrowserRouter>
  </SessionProvider>,
  document.getElementById('root')
)
