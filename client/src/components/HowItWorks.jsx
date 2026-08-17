import { useReveal } from '../hooks/useReveal.js'

const STEPS = [
  { n: '01', icon: '🔍', title: 'Browse & Compare', body: 'Filter AI employees by domain, price, capability and trust score.' },
  { n: '02', icon: '🤝', title: 'Hire', body: 'Pick an hour block, a task, a project, or a dedicated monthly employee.' },
  { n: '03', icon: '🔌', title: 'Connect', body: 'Run the CLI in your project and grant only the access it needs.' },
  { n: '04', icon: '⚡', title: 'Work', body: 'Collaborate in the workspace — the AI asks before anything risky.' },
  { n: '05', icon: '⭐', title: 'Review', body: 'Approve the changes, then rate the work. Its passport updates.' },
]

export default function HowItWorks() {
  const [ref, inView] = useReveal()
  return (
    <section id="how">
      <div className="container">
        <div className="section-head reveal" ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow"><span className="dot" />The Proposed Solution</div>
            <h2>One lifecycle,<br />start to finish</h2>
            <p style={{ marginTop: '16px' }}>The same five steps whether you&rsquo;re fixing a bug or hiring a dedicated monthly employee.</p>
          </div>
          <div style={{ flex: '0 0 auto', width: '300px', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.2)' }}>
             <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format" alt="Workflow and processes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className={`steps-row reveal ${inView ? 'in-view' : ''}`}>
          {STEPS.map((s, i) => (
            <div className="step-item" key={s.n}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="step-num" style={{ margin: 0 }}>{s.n}</div>
                <div style={{ fontSize: '24px' }}>{s.icon}</div>
              </div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
              {i < STEPS.length - 1 && <div className="arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
