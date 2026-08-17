import { useEffect, useState } from 'react'
import { useReveal } from '../hooks/useReveal.js'

const SCRIPT = [
  { type: 'cmd', text: '$ npx agenthire connect', delay: 0.0 },
  { type: 'out', text: '→ Authenticating workspace...', delay: 1.1 },
  { type: 'out', text: '→ Browser: "Connect this project?" — Approved', delay: 1.8 },
  { type: 'ok', text: '✓ Session SES-82193 connected · 5 hrs allocated', delay: 2.6 },
  { type: 'cmd', text: '$ agenthire run "fix the JWT refresh bug"', delay: 3.6 },
  { type: 'out', text: '→ Indexing 214 files across 6 modules...', delay: 4.9 },
  { type: 'out', text: '→ Found src/middleware/authMiddleware.js', delay: 5.6 },
  { type: 'out', text: '→ Branch created: fix/jwt-refresh', delay: 6.3 },
  { type: 'ok', text: '✓ Tests passed 14/14 — awaiting your approval', delay: 7.0 },
]

const CYCLE_MS = 11000

export default function CLIDemo() {
  const [ref, inView] = useReveal()
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setRunId((r) => r + 1), CYCLE_MS)
    return () => clearInterval(id)
  }, [inView])

  return (
    <section id="cli" style={{ position: 'relative' }}>
      {/* Background Image Overlay */}
      <div style={{
        position: 'absolute',
        top: '10%',
        bottom: '10%',
        left: 0,
        right: 0,
        background: 'url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80&auto=format) center/cover no-repeat',
        opacity: 0.1,
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div className="container terminal-wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className={`terminal-copy reveal ${inView ? 'in-view' : ''}`} ref={ref}>
          <div className="eyebrow"><span className="dot" />The Agent CLI</div>
          <h2>Your project, connected —<br />nothing exposed by default</h2>
          <p>
            The CLI scans structure, languages, and dependencies before the AI ever sees a
            line of code, and automatically blocks <code>.env</code>, credentials and private
            keys unless you explicitly allow them.
          </p>
          <div className="tool-pills">
            {['read_file()', 'search_code()', 'modify_file()', 'run_test()', 'create_branch()', 'create_pull_request()'].map((t) => (
              <span className="tool-pill" key={t}>{t}</span>
            ))}
          </div>
        </div>

        <div className="terminal reveal reveal-delay-2 in-view" style={{ background: 'rgba(20, 20, 20, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 24px 48px -12px rgba(0,0,0,0.4)', border: '1px solid var(--border-strong)' }}>
          <div className="terminal-bar" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="tb-title">zsh — rahul-project — agenthire</span>
          </div>
          <div className="terminal-body" key={runId}>
            {SCRIPT.map((line, i) => (
              <div
                key={i}
                className={line.type === 'cmd' ? 'line typed-line' : `line terminal-out ${line.type === 'ok' ? 'ok' : ''}`}
                style={
                  line.type === 'cmd'
                    ? {
                        '--tw': `${line.text.length}ch`,
                        animation: `typing 0.55s steps(${line.text.length}, end) ${line.delay}s forwards`,
                        color: 'var(--accent)',
                      }
                    : { animationDelay: `${line.delay}s` }
                }
              >
                {line.text}
              </div>
            ))}
            <span className="cursor" style={{ animationDelay: `${SCRIPT[SCRIPT.length - 1].delay + 0.6}s` }} />
          </div>
        </div>
      </div>
    </section>
  )
}
