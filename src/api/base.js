import axios from 'axios'

export const authAPI = axios.create({
  baseURL: import.meta.env.VITE_XXX || 'http://localhost:8000/',
  timeout: 10000,
})

export const profileAPI = axios.create({
  baseURL: import.meta.env.VITE_PROFILE_URL || 'http://localhost:7000/',
  timeout: 10000,
})

export const requestAPI = axios.create({
  baseURL: import.meta.env.VITE_REQUEST_URL || 'http://localhost:3000/',
  timeout: 10000,
})

// attach token if present
const attachToken = (instance) => {
  instance.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
    return cfg
  })
}

attachToken(authAPI)
attachToken(profileAPI)
attachToken(requestAPI)
