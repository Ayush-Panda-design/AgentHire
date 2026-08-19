import { useState } from 'react'
import { buildCliConnectCommands } from '../utils/cliConnect.js'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

const getAvatar = (seed) =>
  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

const DEFAULT_PERMS = {
  files_read: true, files_create: true, files_modify: true, files_delete: false,
  terminal_tests: true, terminal_build: true, terminal_install: false,
  git_read: true, git_branch: true, git_commit: true, git_merge: false,
  deploy_dev: true, deploy_prod: false,
}

const PERM_LABELS = {
  files_read: 'Read', files_create: 'Create', files_modify: 'Modify', files_delete: 'Delete',
  terminal_tests: 'Run tests', terminal_build: 'Run build', terminal_install: 'Install packages',
  git_read: 'Read', git_branch: 'Create branch', git_commit: 'Commit & PR', git_merge: 'Merge PR',
  deploy_dev: 'Development', deploy_prod: 'Production',
}

function PermRow({ label, checked, onChange, risky }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px 0' }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: risky ? '#ef4444' : 'var(--accent)', width: '15px', height: '15px' }} />
      <span style={{ color: checked ? 'var(--text)' : 'var(--text-faint)' }}>{label}</span>
      {risky && <span style={{ fontSize: '10px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '2px 6px', borderRadius: '3px', marginLeft: 'auto' }}>high-risk</span>}
    </label>
  )
}

export default function Hire() {
  const { id } = useParams()
  const [step, setStep] = useState(0)
  const [hours, setHours] = useState(3)
  const [taskDescription, setTaskDescription] = useState('')
  const [permissions, setPermissions] = useState({ ...DEFAULT_PERMS })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [cliToken, setCliToken] = useState('')
  const [hireId, setHireId] = useState('')
  const [copied, setCopied] = useState(false)

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/employees/${id}`, { credentials: 'include' })
      if (!res.ok) throw new Error('Employee not found')
      return res.json()
    }
  })

  if (isLoading) return <div className="auth-spinner" style={{ margin: '100px auto' }} />
  if (isError || !employee) return <div className="auth-error" style={{ margin: '40px' }}>Employee not found.</div>

  const totalAmount = employee.hourlyRate * hours

  function setPerm(key, val) {
    setPermissions((p) => ({ ...p, [key]: val }))
  }

  async function handlePay() {
    setError('')
    setIsProcessing(true)
    setStep(2)

    try {
      // Step 1: Create order server-side
      const orderRes = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee._id,
          taskDescription: taskDescription || `${hours}h session with ${employee.name}`,
          hours,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        setError(orderData.error || 'Failed to create payment order.')
        setIsProcessing(false)
        setStep(1)
        return
      }

      const { orderId, amount, keyId, hireId: newHireId, devMode } = orderData
      setHireId(newHireId)

      // DEV MODE: skip Razorpay popup, verify directly
      if (devMode) {
        const verifyRes = await fetch(`${API_URL}/payments/verify`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hireId: newHireId,
            razorpay_order_id: orderId,
            razorpay_payment_id: `dev_pay_${Date.now()}`,
            razorpay_signature: 'dev_sig',
          }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) {
          setError(verifyData.error || 'Verification failed.')
          setIsProcessing(false)
          setStep(1)
          return
        }
        setCliToken(verifyData.cliToken)
        setStep(3)
        setIsProcessing(false)
        return
      }

      // REAL MODE: open Razorpay popup
      const loaded = await loadRazorpay()
      if (!loaded) {
        setError('Failed to load Razorpay. Check your internet connection.')
        setIsProcessing(false)
        setStep(1)
        return
      }

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId || RAZORPAY_KEY_ID,
          amount,
          currency: 'INR',
          order_id: orderId,
          name: 'AgentHire',
          description: `${employee.name} — ${hours}h session`,
          image: getAvatar(employee.name),
          theme: { color: '#6366f1' },
          handler: async (response) => {
            try {
              const verifyRes = await fetch(`${API_URL}/payments/verify`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  hireId: newHireId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) {
                setError(verifyData.error || 'Payment verification failed.')
                reject(new Error(verifyData.error))
                return
              }
              setCliToken(verifyData.cliToken)
              setStep(3)
              resolve()
            } catch (err) {
              setError('Payment verification error.')
              reject(err)
            }
          },
          modal: {
            ondismiss: () => { setIsProcessing(false); setStep(1); resolve() },
          },
        })
        rzp.open()
      })
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
      setStep(1)
    } finally {
      setIsProcessing(false)
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (step === 3) {
    const connectCmd = buildCliConnectCommands(cliToken)
    return (
      <div style={{ padding: '80px 40px', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: '28px', margin: '0 0 12px', color: 'var(--text)' }}>
          {employee.name} is ready
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '15px', marginBottom: '40px', lineHeight: 1.6 }}>
          Run the command below from your project folder to connect the agent to your local environment.
        </p>

        <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '32px', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Run this in your project folder</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
            <code style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', flex: 1, wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
              {connectCmd}
            </code>
            <button onClick={() => handleCopy(connectCmd)}
              style={{ flexShrink: 0, background: copied ? 'var(--green-soft)' : 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '11px', color: copied ? 'var(--green)' : 'var(--text-dim)' }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px', textAlign: 'left' }}>
          {[
            { icon: '📁', title: 'Run from project root', desc: 'cd into the repo you want the agent to work on first' },
            { icon: '🤖', title: 'Type your instruction', desc: 'The agent reads your files and applies changes directly' },
            { icon: '👁', title: 'Review the diff', desc: 'Changes are shown inline — inspect before saving' },
          ].map((s) => (
            <div key={s.title} style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>{s.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {hireId && (
          <Link to={`/app/workspace/${hireId}`} className="btn btn-primary"
            style={{ display: 'inline-flex', padding: '12px 28px', fontSize: '13px', marginBottom: '16px' }}>
            View Activity Feed →
          </Link>
        )}
        <div style={{ marginTop: '8px' }}>
          <Link to="/app/marketplace" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  // ── Steps 0–2 ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-soft)', padding: '40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'var(--bg-raised)', border: '1px solid var(--border)', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={getAvatar(employee.name)} alt="avatar" style={{ width: '100%', height: '100%' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--mono)', fontSize: '24px', margin: '0 0 6px', color: 'var(--text)' }}>{employee.name}</h1>
            <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '14px' }}>{employee.roleTitle}</p>
          </div>
          {/* Step indicator */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {['Configure', 'Permissions', 'Pay'].map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: i <= step ? 'var(--accent)' : 'var(--bg-raised)', border: `1px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: i <= step ? '#fff' : 'var(--text-faint)', fontFamily: 'var(--mono)' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < 2 && <div style={{ width: '20px', height: '1px', background: 'var(--border)' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* Left */}
        <div style={{ flex: 1 }}>
          <Link to={`/app/employees/${id}`} style={{ display: 'inline-block', color: 'var(--text-dim)', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>← Back to profile</Link>
          <h3 style={{ fontFamily: 'var(--mono)', fontSize: '18px', margin: '0 0 16px' }}>Agent Capabilities</h3>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '24px', fontSize: '14px' }}>
            This agent connects to your local project via the AgentHire CLI, reads your files in context, and applies changes directly to your filesystem.
          </p>
          <h3 style={{ fontSize: '12px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '12px' }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {employee.skills.map((s) => (
              <span key={s} style={{ fontFamily: 'var(--mono)', fontSize: '11px', padding: '5px 10px', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-dim)' }}>{s}</span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-soft)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '22px', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 700, marginBottom: '4px' }}>{employee.successRate}%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Task success rate</div>
            </div>
            <div style={{ background: 'var(--bg-raised)', border: '1px solid var(--border-soft)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '22px', fontFamily: 'var(--mono)', color: 'var(--text)', fontWeight: 700, marginBottom: '4px' }}>{employee.tasksDone.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Tasks completed</div>
            </div>
          </div>
        </div>

        {/* Right — form card */}
        <div style={{ width: '400px', flexShrink: 0, position: 'sticky', top: '100px' }}>

          {/* Step 0: Configure */}
          {step === 0 && (
            <div className="auth-card" style={{ maxWidth: '100%', margin: 0, padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--mono)', fontSize: '17px', margin: '0 0 20px' }}>Configure session</h2>
              {error && <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Estimated hours</label>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text)' }}>{hours}h</span>
                </div>
                <input type="range" min="1" max="40" value={hours} onChange={(e) => setHours(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: '6px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>
                  <span>1h</span><span>40h</span>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-dim)', display: 'block', marginBottom: '8px' }}>Task description <span style={{ color: 'var(--text-faint)' }}>(optional)</span></label>
                <textarea className="auth-input" rows="3" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="e.g. Add input validation to the /login route…" style={{ resize: 'vertical', fontSize: '13px' }} />
              </div>

              <div style={{ background: 'var(--bg-panel)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginBottom: '2px' }}>Total</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--mono)' }}>₹{employee.hourlyRate}/hr × {hours}h</div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>₹{totalAmount.toLocaleString()}</div>
              </div>

              <button className="btn btn-primary" onClick={() => setStep(1)} style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '13px' }}>
                Continue → Set Permissions
              </button>
            </div>
          )}

          {/* Step 1: Permissions */}
          {step === 1 && (
            <div className="auth-card" style={{ maxWidth: '100%', margin: 0, padding: '24px' }}>
              <h2 style={{ fontFamily: 'var(--mono)', fontSize: '17px', margin: '0 0 4px' }}>Workspace permissions</h2>
              <p style={{ color: 'var(--text-faint)', fontSize: '12px', margin: '0 0 20px', lineHeight: 1.5 }}>Choose what this agent is allowed to do in your project.</p>

              {[
                { section: 'Files', keys: ['files_read', 'files_create', 'files_modify', 'files_delete'], risky: ['files_delete'] },
                { section: 'Terminal', keys: ['terminal_tests', 'terminal_build', 'terminal_install'], risky: ['terminal_install'] },
                { section: 'Git', keys: ['git_read', 'git_branch', 'git_commit', 'git_merge'], risky: ['git_merge'] },
                { section: 'Deployment', keys: ['deploy_dev', 'deploy_prod'], risky: ['deploy_prod'] },
              ].map(({ section, keys, risky }) => (
                <div key={section} style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border-soft)' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-faint)', marginBottom: '8px' }}>{section}</div>
                  {keys.map((k) => (
                    <PermRow key={k} label={PERM_LABELS[k]} checked={permissions[k]} risky={risky.includes(k)} onChange={(v) => setPerm(k, v)} />
                  ))}
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button onClick={() => setStep(0)} className="btn" style={{ flex: 1, justifyContent: 'center', padding: '11px', fontSize: '13px' }}>← Back</button>
                <button onClick={handlePay} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '11px', fontSize: '13px' }}>
                  Confirm & Pay ₹{totalAmount.toLocaleString()}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {step === 2 && (
            <div className="auth-card" style={{ maxWidth: '100%', margin: 0, padding: '40px 24px', textAlign: 'center' }}>
              <div className="auth-spinner" style={{ margin: '0 auto 20px' }} />
              <p style={{ color: 'var(--text-dim)', fontSize: '14px', margin: 0 }}>
                {error ? '' : 'Processing payment…'}
              </p>
              {error && (
                <>
                  <div className="auth-error" style={{ marginBottom: '16px' }}>{error}</div>
                  <button onClick={() => { setStep(1); setError('') }} className="btn" style={{ width: '100%', justifyContent: 'center' }}>← Try again</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}