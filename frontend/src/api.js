const API_BASE = 'http://localhost:3001/api'

// Simple API client for the Simple Demo backend
export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.user
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/users`)
    return res.json()
  },

  async getAssignments() {
    const res = await fetch(`${API_BASE}/assignments`)
    return res.json()
  },

  async createAssignment({ title, description, dueDate, teacherId }) {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, dueDate, teacherId })
    })
    return res.json()
  },

  async deleteAssignment(id) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' })
    return res.json()
  },

  async getSubmissions() {
    const res = await fetch(`${API_BASE}/submissions`)
    return res.json()
  },

  async getSubmissionsByAssignment(assignmentId) {
    const res = await fetch(`${API_BASE}/submissions/assignment/${assignmentId}`)
    return res.json()
  },

  async getSubmissionByAssignmentAndStudent(assignmentId, studentId) {
    const res = await fetch(`${API_BASE}/submissions/assignment/${assignmentId}/student/${studentId}`)
    return res.json()
  },

  async upsertSubmission({ assignmentId, studentId, studentName, text, file }) {
    const formData = new FormData()
    formData.append('assignmentId', assignmentId)
    formData.append('studentId', studentId)
    formData.append('studentName', studentName)
    formData.append('text', text)
    if (file) {
      formData.append('file', file)
    }

    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      body: formData // Don't set Content-Type header, let browser set it with boundary
    })
    return res.json()
  },

  async downloadFile(submissionId) {
    const res = await fetch(`${API_BASE}/submissions/${submissionId}/download`)
    if (!res.ok) return null

    const blob = await res.blob()
    const contentDisposition = res.headers.get('content-disposition')
    const fileName = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : 'download'

    return { blob, fileName }
  },

  async markReviewed(submissionId, { grade, feedback }) {
    const res = await fetch(`${API_BASE}/submissions/${submissionId}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, feedback })
    })
    return res.json()
  },

  async reset() {
    const res = await fetch(`${API_BASE}/data/reset`, { method: 'DELETE' })
    return res.json()
  }
}
