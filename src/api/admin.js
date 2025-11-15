import axios from 'axios'

const API_URL = import.meta.env.VITE_AUTH_URL

export async function getUserList(params = {}) {
  return axios.get(`${API_URL}/admin/users`, { params })
}

export async function banUser(userId) {
  return axios.put(`${API_URL}/admin/ban`, { user_id: userId })
}

export async function unbanUser(userId) {
  return axios.put(`${API_URL}/admin/unban`, { user_id: userId })
}

export async function assignWorker(userId) {
  return axios.put(`${API_URL}/admin/assign-worker`, { user_id: userId })
}

export async function deleteWorker(userId) {
  return axios.delete(`${API_URL}/admin/worker`, { data: { user_id: userId } })
}

export async function createSkill(name) {
  return axios.post(`${API_URL}/admin/skills`, { name })
}
