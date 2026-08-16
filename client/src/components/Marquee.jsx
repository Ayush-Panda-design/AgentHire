const DOMAINS = [
  'Software Development',
  'Cybersecurity',
  'Data',
  'Marketing',
  'Finance',
  'Design',
]

export default function Marquee() {
  const items = [...DOMAINS, ...DOMAINS]
  return (
    <div className="marquee-outer">
      <div className="marquee-track">
        {items.map((d, i) => (
          <span key={i} className={i % DOMAINS.length === 0 ? 'emph' : ''}>{d}</span>
        ))}
      </div>
    </div>
  )
}
