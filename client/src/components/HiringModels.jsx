import { useReveal } from '../hooks/useReveal.js'

const MODELS = [
  { name: 'Hourly', example: 'Buy 5 hours of FullStack Pro AI', price: '₹200/hr → ₹1,000' },
  { name: 'Task-based', example: '"Fix 3 bugs"', price: '₹500' },
  { name: 'Project-based', example: '"Build authentication module"', price: '₹5,000' },
  { name: 'Monthly Employee', example: 'Full Stack Developer AI, dedicated', price: '₹25,000/mo' },
]

export default function HiringModels() {
  const [ref, inView] = useReveal()
  return (
    <section id="pricing">
      <div className="container">
        <div className="section-head reveal" ref={ref}>
          <div>
            <div className="eyebrow"><span className="dot" />Hiring Model</div>
            <h2>Pay for hours, a task,<br />a project, or a hire</h2>
          </div>
          <p>The monthly employee tier is the natural on-ramp into an enterprise deployment.</p>
        </div>

        <div className={`models-table reveal ${inView ? 'in-view' : ''}`}>
          <div className="models-row head">
            <div>Model</div><div>Example</div><div>Price</div>
          </div>
          {MODELS.map((m) => (
            <div className="models-row body" key={m.name}>
              <div className="m-name">{m.name}</div>
              <div className="m-example">{m.example}</div>
              <div className="m-price">{m.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
