import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import useAuthStore from '../stores/useAuthStore'

export default function Navbar() {
  const user = useAuthStore(s => s.user)

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="logo">
          <span className="mark" />
          AGENTHIRE
        </div>
        <div className="nav-links">
          <a href="#marketplace">Marketplace</a>
          <a href="#workspace">Workspace</a>
          <a href="#cli">CLI</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          {user ? (
            <Link to="/app/marketplace" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Start Hiring</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
