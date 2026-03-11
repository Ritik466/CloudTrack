import { api } from './api.js'

const LS_USER_KEY = 'simple_demo_user'

export const store = {
  getCurrentUser() {
    const raw = localStorage.getItem(LS_USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  async login(email, password) {
    const user = await api.login(email, password)
    if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user))
    return user
  },

  logout() {
    localStorage.removeItem(LS_USER_KEY)
  },

  async reset() {
    await api.reset()
    localStorage.removeItem(LS_USER_KEY)
  },

  async getUsers() {
    return api.getUsers()
  },

  async getAssignments() {
    return api.getAssignments()
  },

  async createAssignment({ title, description, dueDate, teacherId }) {
    return api.createAssignment({ title, description, dueDate, teacherId })
  },

  async deleteAssignment(id) {
    return api.deleteAssignment(id)
  },

  async getSubmissions() {
    return api.getSubmissions()
  },

  async getSubmissionsByAssignment(assignmentId) {
    return api.getSubmissionsByAssignment(assignmentId)
  },

  async getSubmissionByAssignmentAndStudent(assignmentId, studentId) {
    return api.getSubmissionByAssignmentAndStudent(assignmentId, studentId)
  },

  async upsertSubmission({ assignmentId, studentId, studentName, text, file }) {
    return api.upsertSubmission({ assignmentId, studentId, studentName, text, file })
  },

  async downloadFile(submissionId) {
    return api.downloadFile(submissionId)
  },

  async markReviewed(submissionId, { grade, feedback }) {
    return api.markReviewed(submissionId, { grade, feedback })
  }
}
