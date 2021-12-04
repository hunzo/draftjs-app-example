import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { AttachementFile, UserSession } from '../models/models'

interface SessionContextType {
  auth: boolean
  setAuth: React.Dispatch<React.SetStateAction<boolean>>
  user: UserSession
  setUser: React.Dispatch<React.SetStateAction<UserSession>>
  attachements: AttachementFile[]
  setAttachements: React.Dispatch<React.SetStateAction<AttachementFile[]>>
  draft: string
  setDraft: React.Dispatch<React.SetStateAction<string>>
  subject: string
  setSubject: React.Dispatch<React.SetStateAction<string>>
  recipient: string[]
  setReipient: React.Dispatch<React.SetStateAction<string[]>>
}

const sessionContext = createContext<SessionContextType>(
  {} as SessionContextType
)

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [auth, setAuth] = useLocalStorage('auth', false)
  const [draft, setDraft] = useLocalStorage('draft', '')
  const [subject, setSubject] = useLocalStorage('subject', '')
  const [recipient, setReipient] = useLocalStorage<string[]>('recipient', [])
  const [user, setUser] = useLocalStorage<UserSession>(
    'user_session',
    {} as UserSession
  )
  const [attachements, setAttachements] = useLocalStorage<AttachementFile[]>(
    'attachement_files',
    []
  )

  const value = {
    auth,
    setAuth,
    user,
    setUser,
    attachements,
    setAttachements,
    draft,
    setDraft,
    subject,
    setSubject,
    recipient,
    setReipient,
  }
  return (
    <sessionContext.Provider value={value}>{children}</sessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(sessionContext)
  if (!context)
    throw new Error('useSession must be call inside SessionProvider')
  return context
}
