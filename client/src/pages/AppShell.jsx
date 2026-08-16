import { Link, Outlet } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import ThemeToggle from '../components/ThemeToggle'

export default function AppShell() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="app-shell">
      <nav className="app-shell-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" className="auth-logo" style={{ marginBottom: 0, textDecoration: 'none' }}>
            <span className="mark" />
            AGENTHIRE
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/app/marketplace" style={{ color: 'var(--text)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
              Marketplace
            </Link>
            <Link to="/app/guidance" style={{ color: 'var(--text)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
              Guidance
            </Link>
            <Link to="/app/my-agents" style={{ color: 'var(--text)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
              My Agents
            </Link>
            <Link to="/app/cli" style={{ color: 'var(--text)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>
              CLI Connect
            </Link>
          </div>
        </div>
        <div className="app-shell-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle />
          <Link to="/app/account" style={{ color: 'var(--text)', fontSize: '13px', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>{user?.name?.[0]?.toUpperCase() || '?'}</span>
            {user?.name}
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
