import React, { useMemo, useState } from 'react'
import Layout from './Layout.jsx'
import { store } from '../store.js'

export default function Student() {
  const user = store.getCurrentUser()
  const [assignments, setAssignments] = useState([])
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('')
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [submissionsMap, setSubmissionsMap] = useState({})

  React.useEffect(() => {
    const load = async () => {
      const data = await store.getAssignments()
      setAssignments(data)
      if (data.length > 0 && !selectedAssignmentId) {
        setSelectedAssignmentId(data[0].id)
      }

      // Load all submissions for this student
      const allSubmissions = await store.getSubmissions()
      const studentSubmissions = allSubmissions.filter(s => s.student_id === user.id)
      const submissionMap = {}
      studentSubmissions.forEach(s => {
        submissionMap[s.assignment_id] = s
      })
      setSubmissionsMap(submissionMap)
    }
    load()
  }, [user])

  const selectedAssignment = useMemo(
    () => assignments.find((a) => a.id === selectedAssignmentId) || null,
    [assignments, selectedAssignmentId]
  )

  const [existing, setExisting] = useState(null)

  React.useEffect(() => {
    const load = async () => {
      if (!user || !selectedAssignmentId) return
      const data = await store.getSubmissionByAssignmentAndStudent(selectedAssignmentId, user.id)
      setExisting(data)
    }
    load()
  }, [selectedAssignmentId, user])

  const getAssignmentStatus = (assignment) => {
    const submission = submissionsMap[assignment.id]
    const now = new Date()
    const dueDate = new Date(assignment.due_date)
    const isOverdue = now > dueDate

    if (submission) {
      return {
        status: submission.status,
        isOverdue,
        hasSubmitted: true,
        grade: submission.grade,
        feedback: submission.feedback
      }
    } else {
      return {
        status: isOverdue ? 'overdue' : 'pending',
        isOverdue,
        hasSubmitted: false
      }
    }
  }

  const getStatusBadge = (statusInfo) => {
    if (statusInfo.hasSubmitted) {
      if (statusInfo.status === 'reviewed') {
        return <span className="badge badge-green">✓ Reviewed</span>
      } else {
        return <span className="badge badge-amber">⏳ Submitted</span>
      }
    } else if (statusInfo.isOverdue) {
      return <span className="badge" style={{ background: '#fef2f2', color: '#dc2626' }}>⚠️ Overdue</span>
    } else {
      return <span className="badge" style={{ background: '#f3f4f6', color: '#6b7280' }}>📝 Not Started</span>
    }
  }

  const submit = async () => {
    if (!user || !selectedAssignment) return
    if (!text.trim() && !selectedFile) {
      alert('Please write something or attach a file before submitting')
      return
    }

    console.log('Submitting assignment:', {
      assignmentId: selectedAssignment.id,
      studentId: user.id,
      studentName: user.name,
      text: text.trim(),
      file: selectedFile ? selectedFile.name : 'none'
    })

    try {
      const result = await store.upsertSubmission({
        assignmentId: selectedAssignment.id,
        studentId: user.id,
        studentName: user.name,
        text: text.trim(),
        file: selectedFile
      })

      console.log('Submission result:', result)

      alert('Assignment submitted successfully!')
      // Refresh existing submission
      const updated = await store.getSubmissionByAssignmentAndStudent(selectedAssignmentId, user.id)
      console.log('Updated submission:', updated)
      setExisting(updated)
      // Reset form
      setText('')
      setSelectedFile(null)
      // Reset file input
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
    } catch (error) {
      console.error('Submission error:', error)
      alert('Oops! Something went wrong while submitting. Please try again.')
    }
  }

  return (
    <Layout subtitle="Student • Submit assignment">
      {/* Summary Card */}
      <div className="grid-3" style={{ marginBottom: 12 }}>
        <div className="card kpi">
          <div className="k">Total Assignments</div>
          <div className="v">{assignments.length}</div>
        </div>
        <div className="card kpi">
          <div className="k">Submitted</div>
          <div className="v">{Object.values(submissionsMap).filter(s => s).length}</div>
        </div>
        <div className="card kpi">
          <div className="k">Reviewed</div>
          <div className="v">{Object.values(submissionsMap).filter(s => s && s.status === 'reviewed').length}</div>
        </div>
      </div>

      <div className="card">
        <div className="p-16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 900 }}>Assignments</div>
            <div className="small">Pick one and submit text</div>
          </div>
          <select
            className="select"
            value={selectedAssignmentId || ''}
            onChange={(e) => {
              setSelectedAssignmentId(e.target.value)
              setText('')
              setSelectedFile(null)
            }}
            style={{ maxWidth: 400 }}
          >
            {assignments.map((a) => {
              const statusInfo = getAssignmentStatus(a)
              return (
                <option key={a.id} value={a.id}>
                  {a.title} {statusInfo.isOverdue && !statusInfo.hasSubmitted ? '(OVERDUE)' : ''}
                </option>
              )
            })}
          </select>
          {selectedAssignmentId && (
            <div style={{ fontSize: 12 }}>
              {getStatusBadge(getAssignmentStatus(assignments.find(a => a.id === selectedAssignmentId)))}
            </div>
          )}
        </div>
        <hr className="hr" />

        <div className="p-16" style={{ display: 'grid', gap: 12 }}>
          {!selectedAssignment ? (
            <div className="small">No assignment selected.</div>
          ) : (
            <>
              <div className="card p-16" style={{ background: '#f8fafc' }}>
                <div style={{ fontWeight: 900 }}>{selectedAssignment.title}</div>
                <div className="small" style={{ marginTop: 4 }}>{selectedAssignment.description}</div>
                <div className="small" style={{ marginTop: 8 }}>Due {new Date(selectedAssignment.due_date).toLocaleString()}</div>
                <div style={{ marginTop: 8 }}>
                  {getStatusBadge(getAssignmentStatus(selectedAssignment))}
                </div>
              </div>

              {existing && (
                <div className="card p-16">
                  <div style={{ fontWeight: 900 }}>Your submission</div>
                  <div className="small" style={{ marginTop: 4 }}>{new Date(existing.submittedAt).toLocaleString()}</div>
                  <div style={{ marginTop: 8 }}>
                    {getStatusBadge({
                      hasSubmitted: true,
                      status: existing.status,
                      isOverdue: false,
                      grade: existing.grade,
                      feedback: existing.feedback
                    })}
                  </div>
                  {existing.text && (
                    <div style={{ marginTop: 10, whiteSpace: 'pre-wrap', fontSize: 14, color: '#334155' }}>{existing.text}</div>
                  )}
                  {existing.file_name && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontWeight: 900, fontSize: 14 }}>📎 Attached file:</div>
                      <div className="small" style={{ color: '#3b82f6' }}>{existing.file_name}</div>
                      <div className="small" style={{ color: '#6b7280' }}>({(existing.file_size / 1024).toFixed(1)} KB)</div>
                    </div>
                  )}
                  {existing.grade != null && (
                    <div style={{ marginTop: 10, fontSize: 14, fontWeight: 900, color: '#059669' }}>
                      Grade: {existing.grade}
                    </div>
                  )}
                  {existing.feedback && (
                    <div style={{ marginTop: 10, fontSize: 14, color: '#334155' }}>
                      <span style={{ fontWeight: 900 }}>Feedback:</span> {existing.feedback}
                    </div>
                  )}
                </div>
              )}

              <div className="card p-16">
                <label className="label">Submission text (optional if file attached)</label>
                <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Write your answer here" />

                <div style={{ marginTop: 12 }}>
                  <label className="label">Attach file (optional)</label>
                  <input
                    id="file-input"
                    className="input"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  {selectedFile && (
                    <div className="small" style={{ marginTop: 4, color: '#059669' }}>
                      📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" type="button" onClick={submit}>
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
