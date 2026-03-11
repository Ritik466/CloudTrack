import React, { useMemo, useState } from 'react'
import Layout from './Layout.jsx'
import { store } from '../store.js'

export default function Teacher() {
  const [assignments, setAssignments] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: ''
  })

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')

  const selectedAssignment = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId) || null,
    [assignments, selectedAssignmentId]
  )

  const [submissions, setSubmissions] = useState([])

  React.useEffect(() => {
    const load = async () => {
      const data = await store.getAssignments()
      setAssignments(data)
      // Auto-select first assignment if none selected
      if (data.length > 0 && !selectedAssignmentId) {
        setSelectedAssignmentId(data[0].id)
      }
    }
    load()
  }, [])

  React.useEffect(() => {
    const load = async () => {
      if (!selectedAssignmentId) return
      console.log('Loading submissions for assignment:', selectedAssignmentId)
      const data = await store.getSubmissionsByAssignment(selectedAssignmentId)
      console.log('Submissions loaded:', data)
      setSubmissions(data)
    }
    load()
  }, [selectedAssignmentId])

  const selectedSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedSubmissionId) || null,
    [submissions, selectedSubmissionId]
  )

  const [stats, setStats] = useState({ totalAssignments: 0, totalSubmissions: 0, reviewed: 0 })

  React.useEffect(() => {
    const load = async () => {
      const all = await store.getSubmissions()
      setStats({
        totalAssignments: assignments.length,
        totalSubmissions: all.length,
        reviewed: all.filter((s) => s.status === 'reviewed').length
      })
    }
    load()
  }, [assignments])

  const saveReview = async () => {
    if (!selectedSubmission) return
    const g = grade.trim() ? Number(grade) : undefined
    await store.markReviewed(selectedSubmission.id, {
      grade: Number.isFinite(g) ? g : undefined,
      feedback: feedback.trim() || undefined
    })
    alert('Saved')
    // Refresh submissions to show updated status
    const updated = await store.getSubmissionsByAssignment(selectedAssignmentId)
    setSubmissions(updated)
  }

  const createAssignment = async () => {
    const currentUser = store.getCurrentUser()
    console.log('Current user:', currentUser)

    if (!currentUser || currentUser.role !== 'teacher') {
      alert('Only teachers can create assignments')
      return
    }

    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
      alert('Please fill in all the assignment details')
      return
    }

    console.log('Creating assignment:', newAssignment)

    try {
      const result = await store.createAssignment({
        title: newAssignment.title,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
        teacherId: currentUser.id
      })

      console.log('Assignment created result:', result)

      // Refresh assignments list
      const updated = await store.getAssignments()
      console.log('Updated assignments:', updated)
      setAssignments(updated)

      // Reset form
      setNewAssignment({ title: '', description: '', dueDate: '' })
      setShowCreateForm(false)
      alert('Assignment created successfully!')
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Failed to create assignment. Please try again.')
    }
  }

  const deleteAssignment = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return
    }

    try {
      await store.deleteAssignment(assignmentId)
      const updated = await store.getAssignments()
      setAssignments(updated)

      if (selectedAssignmentId === assignmentId) {
        setSelectedAssignmentId(null)
        setSelectedSubmissionId(null)
        setSubmissions([])
      }

      alert('Assignment deleted successfully!')
    } catch (error) {
      alert('Error deleting assignment')
    }
  }

  const downloadFile = async (submissionId, fileName) => {
    try {
      const result = await store.downloadFile(submissionId)
      if (result) {
        const url = window.URL.createObjectURL(result.blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('File not found')
      }
    } catch (error) {
      alert('Error downloading file')
    }
  }

  return (
    <Layout subtitle="Teacher • Review submissions">
      <div className="grid-3" style={{ marginBottom: 12 }}>
        <div className="card kpi">
          <div className="k">Assignments</div>
          <div className="v">{stats.totalAssignments}</div>
        </div>
        <div className="card kpi">
          <div className="k">Submissions</div>
          <div className="v">{stats.totalSubmissions}</div>
        </div>
        <div className="card kpi">
          <div className="k">Reviewed</div>
          <div className="v">{stats.reviewed}</div>
        </div>
      </div>

      <div className="card">
        <div className="p-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900 }}>Assignments</div>
            <div className="small">Pick an assignment and review submissions</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ New Assignment'}
            </button>
            <select
              className="select"
              value={selectedAssignmentId || ''}
              onChange={(e) => {
                setSelectedAssignmentId(e.target.value)
                setSelectedSubmissionId(null)
                setGrade('')
                setFeedback('')
              }}
              style={{ maxWidth: 320 }}
            >
              <option value="">Select assignment...</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} {new Date(a.due_date) < new Date() ? '(OVERDUE)' : ''}
                </option>
              ))}
            </select>
            {selectedAssignmentId && (
              <button
                className="btn"
                type="button"
                onClick={() => deleteAssignment(selectedAssignmentId)}
                style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <hr className="hr" />

        {showCreateForm && (
          <div className="p-16" style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 900, marginBottom: 12 }}>Create New Assignment</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <label className="label">Title</label>
                <input
                  className="input"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  rows={3}
                  placeholder="Assignment description and instructions"
                />
              </div>
              <div>
                <label className="label">Due Date</label>
                <input
                  className="input"
                  type="datetime-local"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  className="btn"
                  type="button"
                  onClick={() => {
                    setNewAssignment({ title: '', description: '', dueDate: '' })
                    setShowCreateForm(false)
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="button" onClick={createAssignment}>
                  Create Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-16 grid-2">
          <div>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Submissions</div>
            {submissions.length === 0 ? (
              <div className="small">No submissions yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {submissions.map((s) => (
                  <button
                    key={s.id}
                    className="btn"
                    type="button"
                    onClick={() => {
                      setSelectedSubmissionId(s.id)
                      setGrade(s.grade != null ? String(s.grade) : '')
                      setFeedback(s.feedback || '')
                    }}
                    style={{ textAlign: 'left', borderColor: selectedSubmissionId === s.id ? '#93c5fd' : '#e5e7eb', background: selectedSubmissionId === s.id ? '#eff6ff' : 'white' }}
                  >
                    <div style={{ fontWeight: 900 }}>{s.studentName}</div>
                    <div className="small">{new Date(s.submittedAt).toLocaleString()}</div>
                    <div style={{ marginTop: 6 }}>
                      <span className={`badge ${s.status === 'reviewed' ? 'badge-green' : 'badge-amber'}`}>{s.status}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Details</div>
            {!selectedAssignment ? (
              <div className="small">No assignment selected.</div>
            ) : !selectedSubmission ? (
              <div className="small">Select a submission to review.</div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                <div className="card p-16" style={{ background: '#f8fafc' }}>
                  <div style={{ fontWeight: 900 }}>{selectedAssignment.title}</div>
                  <div className="small" style={{ marginTop: 4 }}>{selectedAssignment.description}</div>
                </div>

                <div className="card p-16">
                  <div style={{ fontWeight: 900 }}>Student submission</div>
                  <div className="small" style={{ marginTop: 4 }}>{selectedSubmission.studentName}</div>
                  <div style={{ marginTop: 10, whiteSpace: 'pre-wrap', fontSize: 14, color: '#334155' }}>{selectedSubmission.text}</div>
                  {selectedSubmission.file_name && (
                    <div style={{ marginTop: 12, padding: 8, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6 }}>
                      <div style={{ fontWeight: 900, fontSize: 14, color: '#0369a1' }}>📎 Attached file:</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <div>
                          <div className="small" style={{ color: '#0369a1' }}>{selectedSubmission.file_name}</div>
                          <div className="small" style={{ color: '#6b7280' }}>({(selectedSubmission.file_size / 1024).toFixed(1)} KB)</div>
                        </div>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => downloadFile(selectedSubmission.id, selectedSubmission.file_name)}
                          style={{ fontSize: 12, padding: '4px 8px' }}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card p-16">
                  <div style={{ fontWeight: 900, marginBottom: 10 }}>Review</div>
                  <div className="grid-2">
                    <div>
                      <label className="label">Grade (optional)</label>
                      <input className="input" value={grade} onChange={(e) => setGrade(e.target.value)} type="number" placeholder="e.g. 90" />
                    </div>
                    <div>
                      <label className="label">Status</label>
                      <div className="input" style={{ background: '#f8fafc' }}>{selectedSubmission.status}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label className="label">Feedback (optional)</label>
                    <textarea className="textarea" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={5} placeholder="Write short feedback" />
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" type="button" onClick={saveReview}>
                      Save Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
