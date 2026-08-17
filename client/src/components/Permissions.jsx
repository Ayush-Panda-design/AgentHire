import { useReveal } from '../hooks/useReveal.js'

const GROUPS = [
  {
    title: 'Files',
    rows: [
      { label: 'Read', allow: true },
      { label: 'Create', allow: true },
      { label: 'Modify', allow: true },
      { label: 'Delete', allow: false },
    ],
  },
  {
    title: 'Git',
    rows: [
      { label: 'Read', allow: true },
      { label: 'Create branch', allow: true },
      { label: 'Commit / PR', allow: true },
      { label: 'Merge PR', allow: false },
    ],
  },
  {
    title: 'Terminal',
    rows: [
      { label: 'Run tests', allow: true },
      { label: 'Run build', allow: true },
      { label: 'Install packages', allow: false },
      { label: 'Arbitrary shell', allow: false },
    ],
  },
  {
    title: 'Deployment',
    rows: [
      { label: 'Development', allow: true },
      { label: 'Staging', allow: true },
      { label: 'Production', allow: false },
      { label: 'Infra changes', allow: false },
    ],
  },
]

export default function Permissions() {
  const [ref, inView] = useReveal()
  return (
    <section className="tight" id="permissions">
      <div className="container">
        <div className="section-head reveal" ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow"><span className="dot" />Permissions &amp; Security</div>
            <h2>You decide what<br />the AI can touch</h2>
            <p style={{ marginTop: '16px' }}>Sensitive files — <code>.env</code>, keys, credentials — are detected automatically and blocked unless you say otherwise.</p>
          </div>
          <div style={{ flex: '0 0 auto', width: '300px', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.2)' }}>
             <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80&auto=format" alt="Security concepts" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className={`perm-grid reveal ${inView ? 'in-view' : ''}`}>
          {GROUPS.map((g) => (
            <div className="perm-card" key={g.title}>
              <h5>{g.title}</h5>
              {g.rows.map((r) => (
                <div className={`perm-row ${r.allow ? 'allow' : 'block'}`} key={r.label}>
                  <span className={r.allow ? 'tick' : 'cross'}>{r.allow ? '✓' : '×'}</span>
                  {r.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
