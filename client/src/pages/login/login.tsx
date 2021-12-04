import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../../context/SessionProvider'
import { Authentication } from '../../services/Api'
import './login.css'
const Login: React.FC = () => {
  const { auth, setAuth, setUser } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth) {
      navigate('/', { replace: true })
    }
  }, [auth, navigate])

  const handleLogin = () => {
    Authentication('username', 'password')
      .then((rs) => {
        console.log(rs.data)
        setUser({
          username: 'Setsuna F. Seiei',
          token: rs.data.token as string,
        })
        setAuth(true)
        navigate('/', { replace: true })
      })
      .catch((e) => {
        alert(e)
      })
  }
  return (
    <div className="login-container">
      <h1>Click To Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
