const NODES = [
  { key: 'IDENTITY',   x: 170, y: 30,  status: 'done' },
  { key: 'TRUST',      x: 291, y: 100, status: 'done' },
  { key: 'HIRING',     x: 291, y: 240, status: 'done' },
  { key: 'WORK',       x: 170, y: 310, status: 'active' },
  { key: 'REPUTATION', x: 49,  y: 240, status: 'pending' },
  { key: 'COMMERCE',   x: 49,  y: 100, status: 'pending' },
]

const COLOR = {
  done:    'var(--green)',
  active:  'var(--accent)',
  pending: 'var(--text-faint)',
}

function labelPos(node) {
  const cx = 170, cy = 170
  const dx = node.x - cx, dy = node.y - cy
  const len = Math.hypot(dx, dy) || 1
  const ox = (dx / len) * 26
  const oy = (dy / len) * 26
  let anchor = 'middle'
  if (node.x < cx - 10) anchor = 'end'
  if (node.x > cx + 10) anchor = 'start'
  return { x: node.x + ox, y: node.y + oy + 4, anchor }
}

export default function LoopDiagram() {
  return (
    <div className="loop-wrap">
      <svg viewBox="0 0 340 340">
        <defs>
          {/* radar sweep gradient: bright at leading edge, fades into a ~90° arc */}
          <linearGradient id="radarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f2a93b" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#f2a93b" stopOpacity="0.22" />
          </linearGradient>
          <clipPath id="circleClip">
            <circle cx="170" cy="170" r="140" />
          </clipPath>
        </defs>

        {/* outer dashed ring */}
        <circle className="loop-ring" cx="170" cy="170" r="140" />

        {/* radar sweep — rotates around center, clipped to the ring */}
        <g clipPath="url(#circleClip)">
          <g style={{ transformOrigin: '170px 170px', animation: 'radar-spin 4s linear infinite' }}>
            {/* ~90° wedge pie slice */}
            <path
              d="M170,170 L170,30 A140,140 0 0,1 310,170 Z"
              fill="url(#radarGrad)"
              opacity="0.7"
            />
            {/* bright leading edge spoke */}
            <line
              x1="170" y1="170" x2="170" y2="30"
              stroke="#f2a93b" strokeWidth="1.5" strokeOpacity="0.85"
            />
          </g>
        </g>

        {/* connecting spoke from center to active node */}
        <line
          x1="170" y1="170"
          x2="170" y2="310"
          stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="1"
        />

        {/* center hub */}
        <rect className="loop-center" x="130" y="130" width="80" height="80" rx="4" />
        <text className="loop-center-text" x="170" y="166" textAnchor="middle">HIRE</text>
        <text
          className="loop-node-label"
          x="170" y="182" textAnchor="middle"
          style={{ fontSize: 8, fill: 'var(--text-faint)' }}
        >
          v1.0
        </text>

        {/* orbiting dot */}
        <g className="orbit-dot">
          <circle cx="170" cy="136" r="2.6" fill="var(--accent)" />
        </g>

        {/* nodes */}
        {NODES.map((n) => {
          const lp = labelPos(n)
          return (
            <g key={n.key}>
              <circle cx={n.x} cy={n.y} r={n.status === 'active' ? 7 : 5.5} fill={COLOR[n.status]} />
              {n.status === 'active' && (
                <circle cx={n.x} cy={n.y} r="12" fill="none" stroke="var(--accent)" strokeOpacity="0.4">
                  <animate attributeName="r" values="7;16;7" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <text
                className={`loop-node-label ${n.status === 'active' ? 'current' : ''}`}
                x={lp.x} y={lp.y} textAnchor={lp.anchor}
              >
                {n.key}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
