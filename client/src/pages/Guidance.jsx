import { useState } from 'react'

// ─── AI Mentors: instant, always available, affordable ───
const AI_MENTORS = [
  { id: 'ai1', name: 'DSA Coach AI', specialty: 'Data Structures & Algorithms', rate: 50, rating: 4.9, sessions: 3200, type: 'ai' },
  { id: 'ai2', name: 'System Design Guru AI', specialty: 'HLD / LLD / Architecture', rate: 80, rating: 4.8, sessions: 1800, type: 'ai' },
  { id: 'ai3', name: 'Career Advisor AI', specialty: 'Resume Review & Interview Prep', rate: 40, rating: 4.7, sessions: 5100, type: 'ai' },
  { id: 'ai4', name: 'ML Tutor AI', specialty: 'Machine Learning & Deep Learning', rate: 60, rating: 4.8, sessions: 2400, type: 'ai' },
]

// ─── Industry Mentors: real professionals, video call, mutual scheduling ───
const INDUSTRY_MENTORS = [
  { 
    id: 'ind1', name: 'Arjun Mehta', role: 'Senior SDE', company: 'Google', 
    yearsExp: 8, specialty: 'System Design & Distributed Systems', 
    rate: 500, rating: 4.9, sessions: 340, 
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces&q=80',
    availability: ['Sat 11:00 AM', 'Sat 3:00 PM', 'Sun 10:00 AM', 'Sun 5:00 PM'],
    bio: 'Ex-Amazon. Specializes in large-scale backend architecture and mentoring students for FAANG interviews.'
  },
  { 
    id: 'ind2', name: 'Priya Sharma', role: 'Lead Designer', company: 'Flipkart',
    yearsExp: 6, specialty: 'Product Design & UX Strategy',
    rate: 400, rating: 4.8, sessions: 210,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces&q=80',
    availability: ['Sat 2:00 PM', 'Sat 6:00 PM', 'Sun 11:00 AM', 'Sun 4:00 PM'],
    bio: 'Designs for 200M+ users. Passionate about helping students build world-class design portfolios.'
  },
  {
    id: 'ind3', name: 'Vikram Rao', role: 'Security Engineer', company: 'Microsoft',
    yearsExp: 10, specialty: 'Cloud Security & Ethical Hacking',
    rate: 600, rating: 5.0, sessions: 180,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&q=80',
    availability: ['Sat 10:00 AM', 'Sun 10:00 AM', 'Sun 2:00 PM', 'Sun 6:00 PM'],
    bio: 'OSCP certified. 10+ years in offensive security. Mentors students for cybersecurity careers and CTF competitions.'
  },
  {
    id: 'ind4', name: 'Sneha Kulkarni', role: 'Engineering Manager', company: 'Razorpay',
    yearsExp: 7, specialty: 'Full Stack & Career Growth',
    rate: 450, rating: 4.9, sessions: 290,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces&q=80',
    availability: ['Sat 11:00 AM', 'Sat 4:00 PM', 'Sun 12:00 PM', 'Sun 5:00 PM'],
    bio: 'Built payments infra from scratch. Loves helping students navigate their first tech job and grow into leadership.'
  },
]

const AI_TIME_SLOTS = ['Now', '10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM', '5:30 PM', '7:00 PM']

// ─── AI Mentor Booking (instant) ───
function AIMentorTab() {
  const [selected, setSelected] = useState(null)
  const [slot, setSlot] = useState(null)
  const [booked, setBooked] = useState(false)

  if (booked) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontFamily: 'var(--mono)', fontSize: '20px', marginBottom: '10px' }}>Session Started!</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '6px' }}>
          Your session with <strong style={{ color: 'var(--text)' }}>{selected.name}</strong> is live.
        </p>
        <p style={{ color: 'var(--text-faint)', fontSize: '13px', marginBottom: '24px' }}>You'll be redirected to the AI workspace chat.</p>
        <button onClick={() => { setBooked(false); setSelected(null); setSlot(null) }} className="btn">Book Another</button>
      </div>
    )
  }

  return (
    <div>
      <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
        AI mentors are available <strong style={{ color: 'var(--accent)' }}>24/7</strong> for instant sessions. No scheduling needed — start learning immediately.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '36px' }}>
        {AI_MENTORS.map(m => (
          <button key={m.id} onClick={() => setSelected(m)} style={{
            textAlign: 'left', padding: '24px 20px',
            background: selected?.id === m.id ? 'var(--accent-soft)' : 'var(--bg-raised)',
            border: '1px solid', borderColor: selected?.id === m.id ? 'var(--accent-line)' : 'var(--border)',
            borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: selected?.id === m.id ? '0 10px 30px -10px rgba(200, 90, 54, 0.15)' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--accent)', fontWeight: 700 }}>AI</div>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>{m.specialty}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px dashed var(--border-soft)' }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '15px', color: 'var(--accent)', fontWeight: 600 }}>₹{m.rate}<span style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 400 }}>/session</span></span>
              <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>⭐ {m.rating} · {m.sessions.toLocaleString()} sessions</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginBottom: '24px', animation: 'fade-up 0.3s ease' }}>
          <h4 style={{ fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: '12px' }}>Start Time</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {AI_TIME_SLOTS.map(s => (
              <button key={s} onClick={() => setSlot(s)} style={{
                padding: '10px 18px', fontFamily: 'var(--mono)', fontSize: '12px',
                background: slot === s ? 'var(--accent)' : 'var(--bg-raised)',
                color: slot === s ? '#fff' : 'var(--text-dim)',
                border: '1px solid', borderColor: slot === s ? 'var(--accent)' : 'var(--border)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s',
                fontWeight: s === 'Now' ? 700 : 400,
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {selected && slot && (
        <div style={{ padding: '24px', background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fade-up 0.3s ease' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '4px' }}>Ready to start</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text)' }}>{selected.name} · {slot}</div>
          </div>
          <button onClick={() => setBooked(true)} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '14px' }}>
            Start Session · ₹{selected.rate}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Industry Mentor Booking (video call, mutual scheduling) ───
function IndustryMentorTab() {
  const [expanded, setExpanded] = useState(null)
  const [selectedSlots, setSelectedSlots] = useState([])
  const [topic, setTopic] = useState('')
  const [requestState, setRequestState] = useState(null) // null | 'sending' | 'pending' | 'confirmed'
  const [confirmedSlot, setConfirmedSlot] = useState(null)

  function toggleSlot(slot) {
    setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot])
  }

  function handleRequest() {
    if (selectedSlots.length === 0) return
    setRequestState('sending')
    setTimeout(() => setRequestState('pending'), 1200)
    setTimeout(() => {
      const picked = selectedSlots[Math.floor(Math.random() * selectedSlots.length)]
      setConfirmedSlot(picked)
      setRequestState('confirmed')
    }, 3500)
  }

  function resetBooking() {
    setExpanded(null); setSelectedSlots([]); setTopic(''); setRequestState(null); setConfirmedSlot(null)
  }

  return (
    <div>
      <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.6 }}>
        Book a <strong style={{ color: 'var(--accent)' }}>1-on-1 video call</strong> with professionals from top companies. 
        Pick your preferred time slots and they'll confirm one that works for both.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {INDUSTRY_MENTORS.map(m => {
          const isExpanded = expanded === m.id
          return (
            <div key={m.id} style={{
              background: 'var(--bg-raised)', border: '1px solid',
              borderColor: isExpanded ? 'var(--accent-line)' : 'var(--border)',
              borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'all 0.2s',
              boxShadow: isExpanded ? '0 12px 40px -12px rgba(0,0,0,0.05)' : 'none'
            }}>
              {/* Mentor Header */}
              <button onClick={() => { resetBooking(); setExpanded(isExpanded ? null : m.id) }} style={{
                width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px',
                background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                  <img src={m.avatar} alt={m.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-soft)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>{m.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{m.role} at <strong style={{ color: 'var(--text)' }}>{m.company}</strong></div>
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: 'var(--text-faint)', lineHeight: 1.5 }}>
                   Specializes in {m.specialty} · {m.yearsExp} yrs exp
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid var(--border-soft)', paddingTop: '16px', marginTop: '4px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>⭐ {m.rating} · {m.sessions} calls</div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '18px', fontWeight: 700, color: 'var(--accent)' }}>₹{m.rate}<span style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}> / session</span></div>
                  </div>
                </div>
              </button>

              {/* Expanded Booking Panel */}
              {isExpanded && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)', animation: 'fade-up 0.3s ease' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6, margin: '20px 0' }}>{m.bio}</p>
                  
                  {requestState === 'confirmed' ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', background: 'var(--bg-panel)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>Session Confirmed!</div>
                      <p style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '6px' }}>
                        <strong style={{ color: 'var(--accent)' }}>{confirmedSlot}</strong> with {m.name}
                      </p>
                      <p style={{ color: 'var(--text-faint)', fontSize: '12px', marginBottom: '20px' }}>A Google Meet link will be sent to your email 30 minutes before the session.</p>
                      <div style={{ display: 'inline-flex', gap: '10px', padding: '10px 16px', background: 'var(--green-soft)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--green)' }}>
                        📹 Video Call · 45 minutes
                      </div>
                    </div>
                  ) : requestState === 'pending' || requestState === 'sending' ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div className="auth-spinner" style={{ margin: '0 auto 16px', borderColor: 'var(--border-strong)', borderTopColor: 'var(--accent)' }} />
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--text-dim)' }}>
                        {requestState === 'sending' ? 'Sending request securely...' : 'Waiting for mentor confirmation...'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '8px' }}>
                        {requestState === 'pending' && 'This usually takes a few seconds in the demo ✨'}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Preferred Time Slots */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: '12px' }}>
                          Select Preferred Times <span style={{ color: 'var(--text-faint)', fontWeight: 400, textTransform: 'none' }}>(pick multiple)</span>
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {m.availability.map(slot => (
                            <button key={slot} onClick={() => toggleSlot(slot)} style={{
                              padding: '10px 16px', fontFamily: 'var(--mono)', fontSize: '12px',
                              background: selectedSlots.includes(slot) ? 'var(--accent)' : 'var(--bg-panel)',
                              color: selectedSlots.includes(slot) ? '#fff' : 'var(--text-dim)',
                              border: '1px solid', borderColor: selectedSlots.includes(slot) ? 'var(--accent)' : 'var(--border)',
                              borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s',
                            }}>{slot}</button>
                          ))}
                        </div>
                      </div>

                      {/* Topic */}
                      <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-faint)', marginBottom: '10px' }}>What do you want to discuss?</h4>
                        <textarea
                          value={topic}
                          onChange={e => setTopic(e.target.value)}
                          placeholder="E.g. I'm preparing for SDE-1 interviews and need help with system design concepts..."
                          rows={3}
                          style={{
                            width: '100%', padding: '14px', resize: 'vertical',
                            background: 'var(--bg)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)', color: 'var(--text)',
                            fontFamily: 'var(--sans)', fontSize: '14px', outline: 'none',
                            transition: 'border-color 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                      </div>

                      <button
                        onClick={handleRequest}
                        disabled={selectedSlots.length === 0}
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '14px', opacity: selectedSlots.length === 0 ? 0.4 : 1 }}
                      >
                        Request Video Call · ₹{m.rate}
                      </button>
                      <div style={{ fontSize: '12px', color: 'var(--text-faint)', textAlign: 'center', marginTop: '12px' }}>
                        The mentor will review your topic and confirm a mutually convenient time slot
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Guidance Page ───
export default function Guidance() {
  const [tab, setTab] = useState('industry') // 'ai' | 'industry'

  return (
    <div>
      {/* Hero Banner with Aesthetic Illustration */}
      <div style={{ background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-soft)', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '480px' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Student Exclusive
            </div>
            <h1 style={{ fontFamily: 'var(--mono)', fontSize: '36px', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              1-on-1 Guidance Sessions
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
              Level up your career with focused mentorship. Learn instantly from AI tutors or book deep-dive video calls with industry experts from top tech companies.
            </p>
          </div>
          <div style={{ flexShrink: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.1)' }}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&h=300&q=80" 
              alt="Mentorship and Collaboration" 
              style={{ display: 'block', width: '400px', height: '240px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '860px', margin: '0 auto' }}>
        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '36px', borderBottom: '1px solid var(--border)', position: 'sticky', top: '68px', background: 'var(--bg)', zIndex: 10, paddingTop: '10px' }}>
          <button onClick={() => setTab('industry')} style={{
            padding: '16px 24px', fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 600,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: tab === 'industry' ? 'var(--accent)' : 'var(--text-faint)',
            borderBottom: tab === 'industry' ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.2s', marginBottom: '-1px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ color: 'var(--border-strong)', fontWeight: 400 }}>{'<'}</span> Industry Experts <span style={{ color: 'var(--border-strong)', fontWeight: 400 }}>{'>'}</span>
          </button>
          <button onClick={() => setTab('ai')} style={{
            padding: '16px 24px', fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: 600,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: tab === 'ai' ? 'var(--accent)' : 'var(--text-faint)',
            borderBottom: tab === 'ai' ? '2px solid var(--accent)' : '2px solid transparent',
            transition: 'all 0.2s', marginBottom: '-1px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ color: 'var(--border-strong)', fontWeight: 400 }}>{'['}</span> AI Mentors <span style={{ color: 'var(--border-strong)', fontWeight: 400 }}>{']'}</span>
          </button>
        </div>

        {tab === 'ai' ? <AIMentorTab /> : <IndustryMentorTab />}
      </div>
    </div>
  )
}
