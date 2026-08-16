import { useReveal } from '../hooks/useReveal.js'

const STEPS = [
  { n: '01', title: 'Browse & Compare', body: 'Filter AI employees by domain, price, capability and trust score.' },
  { n: '02', title: 'Hire', body: 'Pick an hour block, a task, a project, or a dedicated monthly employee.' },
  { n: '03', title: 'Connect', body: 'Run the CLI in your project and grant only the access it needs.' },
  { n: '04', title: 'Work', body: 'Collaborate in the workspace — the AI asks before anything risky.' },
  { n: '05', title: 'Review', body: 'Approve the changes, then rate the work. Its passport updates.' },
]

export default function HowItWorks() {
  const [ref, inView] = useReveal()
  return (
    <section id="how">
      <div className="container">
        <div className="section-head reveal" ref={ref}>
          <div>
            <div className="eyebrow"><span className="dot" />The Proposed Solution</div>
            <h2>One lifecycle,<br />start to finish</h2>
          </div>
          <p>The same five steps whether you&rsquo;re fixing a bug or hiring a dedicated monthly employee.</p>
        </div>

        <div className={`steps-row reveal ${inView ? 'in-view' : ''}`}>
          {STEPS.map((s) => (
            <div className="step-item" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
