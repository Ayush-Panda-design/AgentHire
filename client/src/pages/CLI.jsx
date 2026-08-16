import { useState, useEffect } from 'react'

export default function CLI() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800)
    const t2 = setTimeout(() => setStep(2), 2000)
    const t3 = setTimeout(() => setStep(3), 3500)
    const t4 = setTimeout(() => setStep(4), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--mono)', fontSize: '28px', margin: '0 0 12px' }}>AgentHire CLI</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          The secure bridge between our cloud AI agents and your local development environment. 
          Run agents safely on your own machine without exposing your raw source code.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Side: Explanation Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: 'var(--bg-raised)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>STEP 1</div>
            <h3 style={{ fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>Install the CLI</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
              Install the AgentHire CLI globally via npm to securely connect any local directory to an active AI hire session.
            </p>
            <div style={{ background: 'var(--bg-panel)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', border: '1px solid var(--border)', marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>npm install -g agenthire-cli</span>
              <span style={{ cursor: 'pointer', color: 'var(--text-faint)' }}>Copy</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-raised)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>STEP 2</div>
            <h3 style={{ fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>Authenticate</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
              Link your local machine to your AgentHire account. This generates a short-lived local token.
            </p>
            <div style={{ background: 'var(--bg-panel)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', border: '1px solid var(--border)', marginTop: '16px' }}>
              agenthire login
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Animated Terminal */}
          <div style={{ 
            background: 'var(--bg-raised)', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)'
          }}>
            {/* Mac window controls */}
            <div style={{ display: 'flex', gap: '8px', padding: '16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }} />
            </div>
            
            {/* Terminal content */}
            <div style={{ padding: '20px', fontFamily: 'var(--mono)', fontSize: '13px', lineHeight: 1.6, color: 'var(--text-dim)', minHeight: '340px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--green)' }}>➜</span>
                <span style={{ color: 'var(--blue)' }}>project-dir</span>
                <span style={{ color: 'var(--text)' }}>agenthire login</span>
              </div>
              
              {step >= 1 && (
                <div style={{ marginTop: '8px', color: 'var(--text-dim)' }}>
                  Opening browser for authentication...<br/>
                  <span style={{ color: 'var(--green)' }}>✔ Successfully authenticated as Demo User</span>
                </div>
              )}

              {step >= 2 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <span style={{ color: 'var(--green)' }}>➜</span>
                  <span style={{ color: 'var(--blue)' }}>project-dir</span>
                  <span style={{ color: 'var(--text)' }}>agenthire connect sess_982F3</span>
                </div>
              )}

              {step >= 3 && (
                <div style={{ marginTop: '8px', color: 'var(--text-dim)' }}>
                  Establishing secure tunnel to AgentHire Cloud...<br/>
                  Syncing local permissions configuration...<br/>
                  <span style={{ color: 'var(--accent)' }}>Sandboxing active. Agent restricted to ./project-dir</span>
                </div>
              )}

              {step >= 4 && (
                <div style={{ marginTop: '16px', color: 'var(--green)', fontWeight: 600 }}>
                  🚀 Workspace linked successfully! 
                  <div style={{ color: 'var(--text-dim)', fontWeight: 400, marginTop: '8px' }}>
                    The AI employee "FullStack Pro AI" is now connected.<br/>
                    Waiting for commands from the web dashboard...
                  </div>
                </div>
              )}
              
              {step < 4 && (
                <div style={{ marginTop: '8px', width: '8px', height: '16px', background: 'var(--text)', animation: 'blink 1s step-end infinite' }} />
              )}
            </div>
          </div>

          <div style={{ background: 'var(--bg-raised)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>STEP 3</div>
            <h3 style={{ fontFamily: 'var(--sans)', fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text)' }}>Connect Workspace</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-dim)', margin: 0, lineHeight: 1.5 }}>
              Navigate to your project folder and connect it to an active hire session ID. The AI is now sandboxed in this directory.
            </p>
            <div style={{ background: 'var(--bg-panel)', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text)', border: '1px solid var(--border)', marginTop: '16px' }}>
              agenthire connect &lt;session-id&gt;
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}} />
    </div>
  )
}
