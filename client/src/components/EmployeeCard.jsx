import { useReveal } from '../hooks/useReveal.js'
import { useCountUp } from '../hooks/useCountUp.js'

const SKILLS = ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Authentication', 'Docker']

const STATS = [
  { label: 'Trust Score', end: 96, suffix: '' },
  { label: 'Success Rate', end: 97.8, suffix: '%', decimals: 1 },
  { label: 'Tasks Done', end: 18420, suffix: '' },
  { label: 'Certifications', end: 5, suffix: '' },
]

function StatCell({ stat, inView }) {
  const val = useCountUp(stat.end, inView, 1500, stat.decimals || 0)
  const display = stat.end >= 1000 ? Number(val).toLocaleString() : val
  return (
    <div>
      <div className="v">{display}{stat.suffix}</div>
      <div className="l">{stat.label}</div>
    </div>
  )
}

export default function EmployeeCard() {
  const [ref, inView] = useReveal()

  return (
    <section id="employees">
      <div className="container employee-section-grid">
        <div className={`employee-copy reveal ${inView ? 'in-view' : ''}`} ref={ref}>
          <div className="eyebrow"><span className="dot" />From the brief — Rahul&rsquo;s story</div>
          <h2>&ldquo;Find and fix the<br />authentication bug.&rdquo;</h2>
          <p>
            Rahul has a MERN project with a broken refresh token. Instead of opening a
            ticket for a human developer, he hires <b>FullStack Pro AI</b> for three hours
            straight from the marketplace.
          </p>
          <p>
            The AI reads the project structure, searches auth-related files, creates a
            branch, fixes the bug, runs the test suite, and hands the diff back for
            approval — all inside the permissions Rahul granted.
          </p>
          <a href="#pricing" className="btn btn-primary">Hire FullStack Pro AI →</a>
        </div>

        <div className={`employee-card reveal reveal-delay-2 ${inView ? 'in-view' : ''}`}>
          <div className="ec-top">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&q=80&auto=format" alt="AI Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div className="ec-name">FullStack Pro AI</div>
                <div className="ec-role">Software Development · 2.4 yrs experience</div>
              </div>
            </div>
            <div className="ec-price">₹200<span>per hour</span></div>
          </div>

          <div className="ec-stats">
            {STATS.map((s) => <StatCell stat={s} inView={inView} key={s.label} />)}
          </div>

          <div className="ec-skills">
            {SKILLS.map((s) => <span className="ec-skill" key={s}>{s}</span>)}
          </div>

          <div className="ec-perm">
            <div className="row allow"><span>✓</span> Read files · Modify files · Run tests · Git operations · Create PRs</div>
            <div className="row block"><span>×</span> No production access · No credential extraction · No destructive ops without approval</div>
          </div>

          <a href="#pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Hire for 3 hours →</a>
        </div>
      </div>
    </section>
  )
}
