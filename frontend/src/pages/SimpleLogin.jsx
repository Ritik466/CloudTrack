import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../store.js'

export default function SimpleLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const demos = useMemo(
    () => [
      { label: 'Teacher', email: 'arjun.panuily@cloudtrack.edu', password: 'teacher123' },
      { label: 'Student (Kartik)', email: 'kartik.sharma@student.edu', password: 'student123' },
      { label: 'Student (Aryan)', email: 'aryan.thapa@student.edu', password: 'student123' },
      { label: 'Admin', email: 'admin@cloudtrack.edu', password: 'admin123' }
    ],
    []
  )

  const doLogin = async (e) => {
    e?.preventDefault?.()
    const user = await store.login(email, password)
    if (!user) {
      alert('Invalid email or password. Use a demo account.')
      return
    }
    navigate(`/${user.role}`)
  }

  const quick = async (demoEmail, demoPassword) => {
    const user = await store.login(demoEmail, demoPassword)
    if (!user) return
    navigate(`/${user.role}`)
  }

  return (
    <div>
      <div className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo">CT</div>
            <div>
              <p className="m0 title">CloudTrack</p>
              <p className="m0 subtitle">Simple Demo • 4 demo accounts</p>
            </div>
          </div>
          <button className="btn" type="button" onClick={async () => {
            if (confirm('Reset demo data?')) {
              await store.reset()
              alert('Reset done')
            }
          }}>
            Reset
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="p-24">
            <h2 className="m0">Sign in</h2>
            <p className="subtitle">Pick a demo account or enter email</p>
            <form onSubmit={doLogin} style={{ marginTop: 16 }}>
              <label className="label">Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@email.com" />
              <label className="label" style={{ marginTop: 12 }}>Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
                  Sign In
                </button>
              </div>
            </form>

            <div style={{ marginTop: 18 }}>
              <div className="small" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                Demo accounts
              </div>
              <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
                {demos.map((d) => (
                  <button key={d.email} className="btn" type="button" onClick={() => quick(d.email, d.password)} style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800 }}>{d.label}</div>
                    <div className="small">{d.email}</div>
                    <div className="small" style={{ opacity: 0.7 }}>Password: {d.password}</div>
                  </button>
                ))}
              </div>
              <div className="small" style={{ marginTop: 12, fontStyle: 'italic', color: '#6b7280' }}>
                Note: These are demo accounts for testing purposes only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
