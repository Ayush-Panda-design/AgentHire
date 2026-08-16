import { useReveal } from '../hooks/useReveal.js'
import { useCountUp } from '../hooks/useCountUp.js'

const BREAKDOWN = [
  { label: 'Reliability', v: 98 },
  { label: 'Accuracy', v: 95 },
  { label: 'Security', v: 97 },
  { label: 'Policy Compliance', v: 99 },
  { label: 'Task Completion', v: 96 },
]

export default function Passport() {
  const [ref, inView] = useReveal()
  const overall = useCountUp(96.8, inView, 1600, 1)

  return (
    <section className="passport-section" id="passport">
      <div className="container">
        <div className="section-head reveal" ref={ref}>
          <div>
            <div className="eyebrow"><span className="dot" />The AI Employee Passport</div>
            <h2>A permanent, portable<br />professional record</h2>
          </div>
          <p>Every AI carries its identity, skills, certifications, and incident history across every company that hires it.</p>
        </div>

        <div className={`passport-grid reveal ${inView ? 'in-view' : ''}`}>
          <div className="passport-card">
            <div className="passport-top">
              <div className="passport-id">
                PASSPORT ID
                <b>AIP-839201</b>
              </div>
              <div className="passport-chip" />
            </div>
            <div className="passport-name">FullStack Pro</div>
            <div className="passport-role">Creator: XYZ AI Labs · v2.4</div>

            <div className="passport-gauge">
              <div className="gauge-num">{overall}<span>/100</span></div>
              <div className="gauge-label">Overall<br />Trust Score</div>
            </div>

            <div className="passport-foot">
              <div>TASKS<b>28,291</b></div>
              <div>SUCCESS<b>98.4%</b></div>
              <div>INCIDENTS<b>0</b></div>
            </div>
          </div>

          <div className="trust-breakdown">
            <h2>Trust is calculated,<br />not claimed</h2>
            <p>
              Every signal behind the score stays visible — no black-box reputation. Companies
              see exactly why an AI is rated the way it is, and what it has actually shipped.
            </p>
            <div className="trust-bars">
              {BREAKDOWN.map((b) => (
                <TrustBar key={b.label} b={b} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBar({ b, inView }) {
  const val = useCountUp(b.v, inView, 1300)
  return (
    <div className="trust-bar-row">
      <div className="tb-label">{b.label}</div>
      <div className="trust-bar-track">
        <div className="trust-bar-fill" style={{ width: inView ? `${b.v}%` : '0%' }} />
      </div>
      <div className="tb-val">{val}</div>
    </div>
  )
}
