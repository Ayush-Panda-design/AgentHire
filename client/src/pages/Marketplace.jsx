import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Generate a random avatar from Unsplash or Dicebear based on ID
const getAvatar = (id, seed) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=transparent`

function MarketplaceCard({ employee }) {
  const STATS = [
    { label: 'Trust', end: employee.trustScore, suffix: '' },
    { label: 'Success', end: employee.successRate, suffix: '%', decimals: 1 },
    { label: 'Tasks', end: employee.tasksDone >= 1000 ? (employee.tasksDone/1000).toFixed(1) + 'k' : employee.tasksDone, suffix: '' },
    { label: 'Certs', end: employee.certifications?.length || 0, suffix: '' },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-raised)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px', transition: 'all 0.2s ease',
      boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.borderColor = 'var(--accent-line)'
      e.currentTarget.style.boxShadow = '0 12px 40px -12px rgba(0,0,0,0.1)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = 'var(--border)'
      e.currentTarget.style.boxShadow = '0 4px 20px -10px rgba(0,0,0,0.05)'
    }}>
      {/* Decorative gradient corner */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle at top right, var(--accent-soft), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ 
          width: '52px', height: '52px', borderRadius: '12px', background: 'var(--bg-panel)',
          border: '1px solid var(--border-soft)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <img src={getAvatar(employee._id, employee.name)} alt="avatar" style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{employee.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            {{'software-development': 'Software Dev', 'design': 'Design', 'cybersecurity': 'Cybersecurity'}[employee.domain] || employee.domain} · {employee.experienceYears} yrs
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '17px', fontWeight: 700, color: 'var(--accent)' }}>₹{employee.hourlyRate}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>/hour</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px dashed var(--border-soft)' }}>
        {STATS.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{s.end}{s.suffix}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
        {employee.skills.slice(0, 4).map((s) => (
          <span key={s} style={{ 
            fontFamily: 'var(--mono)', fontSize: '10px', padding: '4px 8px', 
            background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', 
            borderRadius: 'var(--radius-sm)', color: 'var(--text-dim)'
          }}>{s}</span>
        ))}
        {employee.skills.length > 4 && (
          <span style={{ 
            fontFamily: 'var(--mono)', fontSize: '10px', padding: '4px 8px', 
            background: 'transparent', color: 'var(--text-faint)'
          }}>+{employee.skills.length - 4}</span>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
        <Link to={`/app/employees/${employee._id}`} className="btn" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '12px' }}>
          Passport
        </Link>
        <Link to={`/app/hire/${employee._id}`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '12px' }}>
          Hire Agent
        </Link>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [search, setSearch] = useState('')
  const [activeDomain, setActiveDomain] = useState('software-development')

  const DOMAINS = [
    { key: 'software-development', label: '💻 Software Development' },
  ]

  const { data: employees, isLoading, isError } = useQuery({
    queryKey: ['employees', activeDomain, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeDomain) params.set('domain', activeDomain)
      if (search) params.set('q', search)

      const res = await fetch(`${API_URL}/employees?${params.toString()}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        throw new Error('Failed to load employees')
      }
      return res.json()
    }
  })

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-soft)', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '540px' }}>
            <h1 style={{ fontFamily: 'var(--mono)', fontSize: '40px', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              AI Employee Marketplace
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
              Discover, interview, and hire specialized AI agents for your engineering, design, and security teams. They work autonomously in your local environment.
            </p>
          </div>
          <div style={{ flexShrink: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.15)', transform: 'rotate(1deg)' }}>
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&h=200&q=80" 
              alt="Cyber Abstract" 
              style={{ display: 'block', width: '400px', height: '200px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Sidebar Filters */}
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ marginBottom: '24px', position: 'sticky', top: '88px' }}>
              <input 
                type="text" 
                placeholder="Search by name or skill..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="auth-input"
                style={{ width: '100%', marginBottom: '24px' }}
              />

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '12px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '16px' }}>Domains</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {DOMAINS.map(d => (
                    <button 
                      key={d.key}
                      onClick={() => setActiveDomain(d.key)}
                      style={{ 
                        textAlign: 'left', 
                        padding: '12px 16px', 
                        background: activeDomain === d.key ? 'var(--bg-raised)' : 'transparent',
                        border: '1px solid',
                        borderColor: activeDomain === d.key ? 'var(--border-strong)' : 'transparent',
                        borderRadius: 'var(--radius-md)',
                        color: activeDomain === d.key ? 'var(--text)' : 'var(--text-dim)',
                        cursor: 'pointer',
                        fontFamily: 'var(--sans)',
                        fontSize: '14px',
                        fontWeight: activeDomain === d.key ? 600 : 400,
                        transition: 'all 0.2s ease',
                        boxShadow: activeDomain === d.key ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mock Filters to fill space */}
              <div style={{ marginBottom: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-soft)' }}>
                <h3 style={{ fontSize: '12px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '16px' }}>Hourly Rate</h3>
                <input type="range" min="50" max="500" defaultValue="500" style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: '8px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)' }}>
                  <span>₹50</span>
                  <span>Up to ₹500</span>
                </div>
              </div>

              <div style={{ marginBottom: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-soft)' }}>
                <h3 style={{ fontSize: '12px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '16px' }}>Availability</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} /> Available Now
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent)' }} /> within 24 hours
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent)' }} /> within 1 week
                </label>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div style={{ flex: 1 }}>
            {isLoading && <div className="auth-spinner" style={{ margin: '60px auto' }} />}
            {isError && <div className="auth-error">Error loading marketplace.</div>}
            
            {employees && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
                {employees.length === 0 ? (
                  <div style={{ color: 'var(--text-dim)', padding: '40px', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
                    No employees found matching your criteria. Try adjusting your search.
                  </div>
                ) : (
                  employees.map(emp => (
                    <MarketplaceCard key={emp._id} employee={emp} />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
