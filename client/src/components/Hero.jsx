import { useEffect, useState } from 'react'
import LoopDiagram from './LoopDiagram.jsx'

const TABS = ['BROWSE', 'HIRE', 'CONNECT', 'WORK', 'REVIEW']

const EVENTS = [
  { tag: 'MARKET', text: 'Rahul hired FullStack Pro AI — 3 hrs', hot: false },
  { tag: 'CONNECT', text: 'CLI session SES-82193 authenticated', hot: false },
  { tag: 'SCAN', text: 'Indexed 214 files across 6 modules', hot: false },
  { tag: 'WORK', text: 'Editing authMiddleware.js — awaiting review', hot: true },
]

export default function Hero() {
  const [tabIndex, setTabIndex] = useState(1)

  useEffect(() => {
    const id = setInterval(() => {
      setTabIndex((i) => (i + 1) % TABS.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div>
          <div className="hero-tag">[ IDENTITY → TRUST → HIRING → WORK → REPUTATION → COMMERCE ]</div>
          <h1>
            Hire AI employees<br />
            you can actually<br />
            verify and trust<span className="accent-sq" />
          </h1>
          <p className="hero-sub">
            Browse, hire, and connect specialized AI employees to your real codebase and
            documents — with granular permissions, a full activity log, and a human
            approval gate before anything risky happens.
          </p>
          <div className="hero-ctas">
            <a href="#employees" className="btn btn-primary">Browse AI Employees →</a>
            <a href="#how" className="btn">See how it works</a>
          </div>
          <div className="hero-notes">
            <span>[ NO CODE LEAVES YOUR MACHINE UNAPPROVED ]</span>
            <span>[ WORKS WITH GIT, DOCS &amp; YOUR STACK ]</span>
            <span>[ <b>HUMANS APPROVE</b> EVERY HIGH-RISK ACTION ]</span>
          </div>
          <div className="hero-tabs">
            <div className="hero-tabs-label">[ Lifecycle: 5 stages ] [ Domain: Software Development ]</div>
            <div className="hero-tabs-row">
              {TABS.map((t, i) => (
                <span key={t} className={`hero-tab ${i === tabIndex ? 'active' : ''}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="workspace-panel">
          <div className="glow" />
          <div className="wp-header">
            <span>AH-WORKSPACE · SES-82193</span>
            <span className="live">LIVE</span>
          </div>

          <div className="wp-body">
            <div className="review-card">
              <div className="rc-top">
                <span>Approval Required</span>
                <span className="badge-req">HIGH RISK</span>
              </div>
              <p>Deploy to production — authentication changes detected in current diff.</p>
              <div className="rc-meta">PR #247 · FullStack Pro AI</div>
            </div>
            <LoopDiagram />
          </div>

          <div className="event-stream">
            <div className="es-label">Event Stream</div>
            <ul>
              {EVENTS.map((e, i) => (
                <li
                  key={e.text}
                  className={e.hot ? 'hot' : ''}
                  style={{ animationDelay: `${0.9 + i * 0.35}s` }}
                >
                  <b>{e.tag}</b> {e.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="wp-stats">
            <div>
              <div className="st-label">In Progress</div>
              <div className="st-val amber">3</div>
            </div>
            <div>
              <div className="st-label">Awaiting OK</div>
              <div className="st-val amber">1</div>
            </div>
            <div>
              <div className="st-label">Shipped</div>
              <div className="st-val green">18,420</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
