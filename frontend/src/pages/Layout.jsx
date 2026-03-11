import React from 'react'
import { useNavigate } from 'react-router-dom'
import { store } from '../store.js'

export default function Layout({ subtitle, children }) {
  const navigate = useNavigate()
  const user = store.getCurrentUser()

  const initials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div>
      <div className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo">CT</div>
            <div>
              <p className="m0 title">CloudTrack</p>
              <p className="m0 subtitle">{subtitle}</p>
            </div>
          </div>

          <div className="row">
            <div style={{ textAlign: 'right' }} className="small">
              <div style={{ fontWeight: 800, color: '#0f172a' }}>{user?.name || 'Demo User'}</div>
              <div>{user?.email || ''}</div>
            </div>
            <div
              style={{ width: 38, height: 38, borderRadius: 999, background: '#e2e8f0', display: 'grid', placeItems: 'center', fontWeight: 800 }}
              title={user?.name || ''}
            >
              {initials(user?.name || 'User')}
            </div>
            <button
              className="btn"
              type="button"
              onClick={() => {
                store.logout()
                navigate('/')
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">{children}</div>
    </div>
  )
}
