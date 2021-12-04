import { Navigate, useLocation } from 'react-router-dom'
import { useSession } from './context/SessionProvider'

const RequiredAuth = ({ children }: { children: JSX.Element }) => {
  console.log('call RequiredAuth...')
  const location = useLocation()
  const { auth } = useSession()
  if (!auth) return <Navigate to="/login" state={{ from: location }} />
  return children
}

export default RequiredAuth
