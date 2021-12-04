import React from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/navbar/navbar'
import { useSession } from './context/SessionProvider'
import Login from './pages/login/login'
import TextEditor from './pages/texteditor/texteditor'
import RequiredAuth from './RequiredAuth'

const Private = () => {
  return (
    <Routes>
      <Route path="/" element={<TextEditor />} />
    </Routes>
  )
}

const App: React.FC = () => {
  const { auth } = useSession()
  return (
    <div className="App">
      {auth ? <Navbar /> : null}

      <Routes>
        <Route
          path="//*"
          element={
            <RequiredAuth>
              <Private />
            </RequiredAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
