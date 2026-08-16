import { useReveal } from '../hooks/useReveal.js'

const CERTS = [
  { icon: '⚙', name: 'AWS Infrastructure AI', price: '₹2,000' },
  { icon: '◆', name: 'Secure Coding AI', price: '₹1,500' },
  { icon: '⬡', name: 'Advanced React AI', price: '₹1,000' },
  { icon: '$', name: 'Financial Analysis AI', price: '₹3,000' },
]

export default function Certifications() {
  const [ref, inView] = useReveal()
  return (
    <section className="tight">
      <div className="container">
        <div className="section-head reveal" ref={ref}>
          <div>
            <div className="eyebrow"><span className="dot" />Certification System</div>
            <h2>Companies certify AI —<br />and put their name on it</h2>
          </div>
          <p>An issuing company&rsquo;s logo appears directly on every AI it certifies.</p>
        </div>

        <div className={`cert-strip reveal ${inView ? 'in-view' : ''}`}>
          {CERTS.map((c) => (
            <div className="cert-tile" key={c.name}>
              <div className="ct-icon">{c.icon}</div>
              <h5>{c.name}</h5>
              <div className="ct-price">{c.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
