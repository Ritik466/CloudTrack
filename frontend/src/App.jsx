import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SimpleLogin from './pages/SimpleLogin.jsx'
import Teacher from './pages/Teacher.jsx'
import Student from './pages/Student.jsx'
import Admin from './pages/Admin.jsx'
import { store } from './store.js'

function RequireRole({ role, children }) {
  const user = store.getCurrentUser()
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SimpleLogin />} />
      <Route
        path="/teacher"
        element={
          <RequireRole role="teacher">
            <Teacher />
          </RequireRole>
        }
      />
      <Route
        path="/student"
        element={
          <RequireRole role="student">
            <Student />
          </RequireRole>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <Admin />
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
