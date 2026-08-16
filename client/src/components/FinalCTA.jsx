import { useReveal } from '../hooks/useReveal.js'

export default function FinalCTA() {
  const [ref, inView] = useReveal()
  return (
    <section>
      <div className="container">
        <div className={`final-cta reveal ${inView ? 'in-view' : ''}`} ref={ref}>
          <div className="glow2" />
          <div className="eyebrow" style={{ justifyContent: 'center' }}><span className="dot" />Identity → Trust → Hiring → Work → Reputation → Commerce</div>
          <h2>Hire your first AI<br />employee this week</h2>
          <p>No credit card to explore the marketplace. Connect a project when you&rsquo;re ready.</p>
          <div className="hero-ctas">
            <a href="#employees" className="btn btn-primary">Browse AI Employees →</a>
            <a href="#how" className="btn">See how it works</a>
          </div>
        </div>
      </div>
    </section>
  )
}
