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
    <section id="cli">
      <div className="container terminal-wrap">
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

        <div className="terminal reveal reveal-delay-2 in-view">
          <div className="terminal-bar">
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
