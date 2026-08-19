/**
 * Workspace.jsx — /app/workspace/:sessionId
 *
 * Shows the real activityLog from the Hire doc (Phase 4 + 5a data),
 * document upload UI (Phase 5b — visual, no real RAG), and the
 * "Connect via CLI" panel with the hire's key info.
 */

import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return String(ts)
  }
}

function LogEntry({ entry, isLast }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = entry.agentReply && entry.agentReply.length > 200
  const replyContent = (isLong && !isExpanded) ? entry.agentReply.slice(0, 200) + '...' : entry.agentReply

  return (
    <div style={{ display: 'flex', gap: '16px', paddingBottom: '20px', position: 'relative' }}>
      {/* Timeline line */}
      {!isLast && (
        <div style={{ position: 'absolute', left: '15px', top: '32px', bottom: 0, width: '1px', background: 'var(--border-soft)' }} />
      )}
      {/* Dot */}
      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-soft)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
        <span style={{ fontSize: '12px' }}>✓</span>
      </div>

      <div style={{ flex: 1, background: 'var(--bg-raised)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginTop: '2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>
            {entry.instruction}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--mono)', flexShrink: 0, marginLeft: '12px' }}>
            {formatTime(entry.timestamp)}
          </div>
        </div>

        {entry.agentReply && (
          <div style={{ padding: '12px', background: 'var(--bg-panel)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-soft)', marginBottom: '12px', fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
            {replyContent}
            {isLong && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '6px 0 0', display: 'block', fontSize: '12px', fontWeight: 500 }}
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {entry.filesChanged?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {entry.filesChanged.map((f) => (
              <span key={f} style={{ fontFamily: 'var(--mono)', fontSize: '11px', padding: '3px 8px', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--green)' }}>
                ✎ {f}
              </span>
            ))}
          </div>
        )}
        {(!entry.filesChanged || entry.filesChanged.length === 0) && (
          <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>No files changed</div>
        )}
      </div>
    </div>
  )
}

export default function Workspace() {
  const { sessionId } = useParams()

  // Doc upload state (Phase 5b — visual only, no real RAG)
  const [docs, setDocs] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('activity')
  const fileInputRef = useRef(null)

  // Poll the hire every 8 s so the activity feed updates as the CLI works
  const { data: hire, isLoading, isError, refetch } = useQuery({
    queryKey: ['hire', sessionId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/hires/${sessionId}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Could not load hire')
      return res.json()
    },
    refetchInterval: 8000,
  })

  function handleFileDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer?.files || e.target?.files || [])
    indexFakeFiles(files)
  }

  function indexFakeFiles(files) {
    if (!files.length) return
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setDocs((prev) => [
        ...prev,
        ...files.map((f) => ({ name: f.name, date: new Date().toLocaleDateString() })),
      ])
    }, 1800)
  }

  if (isLoading) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <div className="auth-spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Loading workspace…</p>
      </div>
    )
  }

  if (isError || !hire) {
    return (
      <div style={{ padding: '60px 40px' }}>
        <div className="auth-error">Could not load workspace. Make sure you are the owner of this hire.</div>
        <Link to="/app/marketplace" style={{ color: 'var(--text-dim)', fontSize: '13px', display: 'inline-block', marginTop: '16px' }}>← Marketplace</Link>
      </div>
    )
  }

  const employee = hire.employee || {}
  const log = hire.activityLog || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)', background: 'var(--bg-panel-2)' }}>

      {/* ── Header ── */}
      <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: '0 0 3px', fontSize: '15px', fontFamily: 'var(--mono)', color: 'var(--text)' }}>
            {employee.name || 'Agent'} · Workspace
          </h2>
          <div style={{ fontSize: '12px', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>
            Hire {hire._id} · {hire.status === 'paid' ? '🟢 Active' : '⚪ ' + hire.status}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['activity', 'docs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn btn-primary' : 'btn'}
              style={{ padding: '7px 16px', fontSize: '12px' }}
            >
              {tab === 'activity' ? '📋 Activity Feed' : '📂 Knowledge Base'}
            </button>
          ))}
        </div>

        <button onClick={() => refetch()} className="btn" style={{ padding: '7px 14px', fontSize: '12px' }}>
          ↻ Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left sidebar: connect instructions ── */}
        <div style={{ width: '280px', flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--bg-raised)', display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '14px' }}>CLI Connection</div>

          <div style={{ marginBottom: '20px', padding: '14px', background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>1. Install the CLI</div>
            <code style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', display: 'block', wordBreak: 'break-all' }}>
              cd path/to/agenthire-demo-v2/cli{'\n'}
              npm install && npm install -g .
            </code>
          </div>

          <div style={{ marginBottom: '20px', padding: '14px', background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>2. cd into your project folder and connect</div>
            <code style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--accent)', display: 'block', wordBreak: 'break-all', lineHeight: 1.6 }}>
              agenthire connect \<br />
              {'  '}--token &lt;your-cli-token&gt;
            </code>
          </div>

          <div style={{ padding: '14px', background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '10px' }}>Session info</div>
            {[
              { label: 'Employee', value: employee.name },
              { label: 'Status', value: hire.status },
              { label: 'Amount', value: hire.amount ? `₹${(hire.amount / 100).toLocaleString()}` : '—' },
            ].map((r) => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>{r.label}</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text)' }}>{r.value || '—'}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-faint)', lineHeight: 1.6 }}>
            The CLI reads your project files locally and sends instructions to the Gemini-powered agent. Files are written back to your disk directly.
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* Activity feed tab */}
          {activeTab === 'activity' && (
            <div style={{ maxWidth: '760px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--mono)', fontSize: '16px', margin: 0 }}>
                  Activity Log
                  <span style={{ fontSize: '12px', color: 'var(--text-faint)', marginLeft: '10px', fontWeight: 400 }}>
                    ({log.length} entr{log.length === 1 ? 'y' : 'ies'})
                  </span>
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Auto-refreshes every 8s</div>
              </div>

              {log.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center', background: 'var(--bg-raised)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⌛</div>
                  <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: 0 }}>
                    No activity yet. Connect via the CLI and type your first instruction to see it appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[...log].reverse().map((entry, i) => (
                    <LogEntry key={i} entry={entry} isLast={i === log.length - 1} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Knowledge Base / doc upload tab (Phase 5b) */}
          {activeTab === 'docs' && (
            <div style={{ maxWidth: '600px' }}>
              <h3 style={{ fontFamily: 'var(--mono)', fontSize: '16px', marginBottom: '8px' }}>Knowledge Base</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.6 }}>
                Upload docs, API specs, or READMEs. Files are marked as indexed and available for future agent context.
              </p>

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `1px dashed ${isDragging ? 'var(--accent)' : 'var(--border-strong)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '48px',
                  textAlign: 'center',
                  background: isDragging ? 'var(--accent-soft)' : 'var(--bg-raised)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '24px',
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.md,.txt,.docx"
                  style={{ display: 'none' }}
                  onChange={handleFileDrop}
                />
                {isUploading ? (
                  <div>
                    <div className="auth-spinner" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', margin: 0, fontSize: '13px' }}>Chunking and indexing…</p>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
                    <div style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '6px' }}>
                      Drop files here or click to browse
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>PDF · MD · TXT · DOCX</div>
                  </>
                )}
              </div>

              {/* Indexed docs list */}
              {docs.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '12px' }}>
                    Indexed documents
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {docs.map((d, i) => (
                      <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-raised)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '16px' }}>📎</span>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>{d.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{d.date}</span>
                          <span style={{ fontSize: '11px', background: 'var(--green-soft)', color: 'var(--green)', padding: '3px 8px', borderRadius: '4px', fontFamily: 'var(--mono)' }}>✓ Indexed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
