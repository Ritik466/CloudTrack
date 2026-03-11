import React, { useMemo, useState, useEffect } from 'react'
import Layout from './Layout.jsx'
import { store } from '../store.js'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const load = async () => {
      const [u, a, s] = await Promise.all([
        store.getUsers(),
        store.getAssignments(),
        store.getSubmissions()
      ])
      setUsers(u)
      setAssignments(a)
      setSubmissions(s)
    }
    load()
  }, [])

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      teachers: users.filter((u) => u.role === 'teacher').length,
      students: users.filter((u) => u.role === 'student').length,
      admins: users.filter((u) => u.role === 'admin').length,
      assignments: assignments.length,
      submissions: submissions.length,
      reviewed: submissions.filter((s) => s.status === 'reviewed').length
    }
  }, [users, assignments, submissions])

  return (
    <Layout subtitle="Admin • Quick overview">
      <div className="grid-3" style={{ marginBottom: 12 }}>
        <div className="card kpi">
          <div className="k">Users</div>
          <div className="v">{stats.totalUsers}</div>
          <div className="small" style={{ marginTop: 4 }}>{stats.teachers} teachers • {stats.students} students • {stats.admins} admins</div>
        </div>
        <div className="card kpi">
          <div className="k">Assignments</div>
          <div className="v">{stats.assignments}</div>
        </div>
        <div className="card kpi">
          <div className="k">Submissions</div>
          <div className="v">{stats.submissions}</div>
          <div className="small" style={{ marginTop: 4 }}>{stats.reviewed} reviewed</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="p-16">
            <div style={{ fontWeight: 900 }}>Users</div>
            <div className="small">Demo accounts</div>
          </div>
          <hr className="hr" />
          <div className="p-16" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td style={{ color: '#475569' }}>{u.email}</td>
                    <td>
                      <span className="badge">{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="p-16">
            <div style={{ fontWeight: 900 }}>System</div>
            <div className="small">Assignments + submissions status</div>
          </div>
          <hr className="hr" />
          <div className="p-16" style={{ display: 'grid', gap: 10 }}>
            {assignments.map((a) => {
              const subs = submissions.filter((s) => s.assignmentId === a.id)
              const reviewed = subs.filter((s) => s.status === 'reviewed').length
              return (
                <div key={a.id} className="card p-16" style={{ borderRadius: 14, background: '#ffffff' }}>
                  <div style={{ fontWeight: 900 }}>{a.title}</div>
                  <div className="small" style={{ marginTop: 4 }}>{subs.length} submissions • {reviewed} reviewed</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
