import { useReveal } from '../hooks/useReveal.js'

const PROBLEMS = [
  {
    n: '01',
    icon: '🕵️',
    title: 'Which AI should I hire?',
    body: 'Thousands of models and agents exist. You need to know what one is actually good at, how reliable it is, and what it requires access to.',
  },
  {
    n: '02',
    icon: '💻',
    title: 'How does it reach my real work?',
    body: 'A chatbot can’t work a private codebase from conversation alone. It needs source, structure, docs, tests and config.',
  },
  {
    n: '03',
    icon: '🔐',
    title: 'How do I grant access safely?',
    body: 'Nobody wants to hand over .env files, production databases, or cloud credentials just to get a bug fixed.',
  },
  {
    n: '04',
    icon: '🤝',
    title: 'How do I trust the output?',
    body: 'A hiring company should see prior work, certifications, success rate, incidents, and a real trust score before committing.',
  },
  {
    n: '05',
    icon: '📜',
    title: 'How is quality proven?',
    body: 'Companies building specialized agents need a credible way to certify them — and have that credibility carry across the market.',
  },
]

export default function Problems() {
  const [ref, inView] = useReveal()
  return (
    <section id="problems">
      <div className="container">
        <div className="section-head reveal" ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <div className="eyebrow"><span className="dot" />The Core Problem</div>
            <h2>Hiring an AI employee<br />is harder than it sounds</h2>
            <p style={{ marginTop: '16px' }}>Capability isn&rsquo;t the bottleneck anymore. Trust, access, and accountability are.</p>
          </div>
          <div style={{ flex: '0 0 auto', width: '300px', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.2)' }}>
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format" alt="Team brainstorming" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className={`problem-grid reveal ${inView ? 'in-view' : ''}`}>
          {PROBLEMS.map((p) => (
            <div className="problem-card" key={p.n}>
              <div className="num">
                <span>{p.n} /05</span>
                <span className="icon">{p.icon}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
