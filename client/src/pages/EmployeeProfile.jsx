import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function EmployeeProfile() {
  const { id } = useParams()

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/employees/${id}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Employee not found')
      return res.json()
    }
  })

  if (isLoading) return <div className="auth-spinner" style={{ margin: '100px auto' }} />
  if (isError || !employee) return <div className="auth-error" style={{ margin: '40px' }}>Employee not found.</div>

  // Deterministic sub-scores derived from real DB fields — small fixed offsets
  // from trustScore/successRate so they're stable across page loads (not random)
  // and still look plausibly independent.
  const ts = employee.trustScore
  const sr = employee.successRate
  const BREAKDOWN = [
    { label: 'Reliability',        v: Math.min(100, Math.round(ts * 1.01)) },
    { label: 'Accuracy',           v: Math.min(100, Math.round(sr - 2)) },
    { label: 'Security',           v: Math.min(100, Math.round(ts - 1)) },
    { label: 'Policy Compliance',  v: Math.min(100, Math.round(ts + 2)) },
    { label: 'Task Completion',    v: Math.min(100, Math.round(sr)) },
  ]

  // Stable fake passport ID derived from the employee's Mongo _id
  const passportId = `AIP-${String(employee._id).slice(-8).toUpperCase()}`

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/app/marketplace" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Marketplace
        </Link>
      </div>

      <div className="passport-grid" style={{ gridTemplateColumns: '1fr', gap: '40px', maxWidth: 'none', padding: 0 }}>
        {/* Top Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px', alignItems: 'start' }}>
          
          {/* Main Passport Card */}
          <div className="passport-card" style={{ width: '100%', margin: 0 }}>
            <div className="passport-top">
              <div className="passport-id">
                PASSPORT ID
                <b>{passportId}</b>
              </div>
              <div className="passport-chip" />
            </div>
            <div className="passport-name">{employee.name}</div>
            <div className="passport-role">Role: {employee.roleTitle}</div>

            <div className="passport-gauge">
              <div className="gauge-num">{employee.trustScore}<span>/100</span></div>
              <div className="gauge-label">Overall<br />Trust Score</div>
            </div>

            <div className="passport-foot">
              <div>TASKS<b>{employee.tasksDone.toLocaleString()}</b></div>
              <div>SUCCESS<b>{employee.successRate}%</b></div>
              <div>RATE<b>₹{employee.hourlyRate}/h</b></div>
            </div>
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--mono)', fontSize: '28px', margin: '0 0 8px' }}>{employee.name}</h1>
                <p style={{ color: 'var(--text-dim)', margin: 0 }}>{employee.experienceYears} years experience in {employee.domain === 'software-development' ? 'Software Development' : employee.domain}</p>
              </div>
              <Link to={`/app/hire/${employee._id}`} className="btn btn-primary">
                Hire Now
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', marginBottom: '12px' }}>Skills</h3>
                <div className="ec-skills" style={{ gap: '6px' }}>
                  {employee.skills.map(s => <span className="ec-skill" key={s} style={{ background: 'var(--bg-panel-2)' }}>{s}</span>)}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', marginBottom: '12px' }}>Certifications</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {employee.certifications.map(c => (
                    <div key={c.name} style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '4px' }}>{c.issuer} {c.score ? `· ${c.score}` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
               <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', marginBottom: '12px' }}>Capabilities</h3>
               <div className="ec-perm" style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div className="row allow" style={{ marginBottom: '12px' }}>
                    <span style={{ marginTop: '2px' }}>✓</span> 
                    <div>{employee.permissionsSupported.join(' · ')}</div>
                  </div>
                  <div className="row block">
                    <span style={{ marginTop: '2px' }}>×</span> 
                    <div>{employee.restrictions.join(' · ')}</div>
                  </div>
                </div>
            </div>

          </div>
        </div>

        {/* Trust Breakdown */}
        <div className="trust-breakdown" style={{ marginTop: '20px', width: '100%' }}>
          <h2>Trust Breakdown</h2>
          <div className="trust-bars">
            {BREAKDOWN.map((b) => (
              <div className="trust-bar-row" key={b.label}>
                <div className="tb-label">{b.label}</div>
                <div className="trust-bar-track">
                  <div className="trust-bar-fill" style={{ width: `${b.v}%` }} />
                </div>
                <div className="tb-val">{b.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security block + work history (Phase 5b — static demo data) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px', width: '100%' }}>
          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--mono)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', margin: '0 0 16px' }}>Security record</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Security incidents', value: '0', colour: 'var(--green)' },
                { label: 'Policy violations', value: '0', colour: 'var(--green)' },
                { label: 'Sensitive data breaches', value: '0', colour: 'var(--green)' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{row.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 700, color: row.colour }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--mono)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', margin: '0 0 16px' }}>Past engagements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { org: 'Fintech Startup', role: 'Backend refactor', tasks: 12, success: '100%' },
                { org: 'E-commerce Co.', role: 'Auth migration', tasks: 8, success: '97%' },
                { org: 'SaaS Platform', role: 'API optimization', tasks: 21, success: '95%' },
              ].map((e) => (
                <div key={e.org} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🏢</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>{e.org}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{e.role} · {e.tasks} tasks · <span style={{ color: 'var(--green)' }}>{e.success}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
