import { Link } from 'react-router-dom'
import { useSession } from '../../context/SessionProvider'
import './navbar.css'

const Navbar = () => {
  const { setAuth } = useSession()
  return (
    <nav>
      <div className="navbar-links">
        <ul>
          <li>
            <Link to="/">TextEditor</Link>
          </li>
        </ul>
      </div>
      <button style={{ marginRight: '10px' }} onClick={() => setAuth(false)}>
        LogOut
      </button>
    </nav>
  )
}

export default Navbar
