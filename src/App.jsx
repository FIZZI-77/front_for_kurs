import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider, AuthContext } from './context/AuthContext'
import ProtectedRoute from './router/ProtectedRoute'
import Login from './pages/Login'
import WorkerPanel from './pages/WorkerPanel'
import AdminPanel from './pages/AdminPanel'
import Notifications from './pages/Notifications'
import Register from './pages/Register' 
import AuthCallback from './pages/AuthCallback'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Корень редиректит на профиль если авторизован, иначе на логин */}
          <Route 
            path="/" 
            element={
              <RequireAuthRedirect />
            } 
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />  
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/worker" element={<ProtectedRoute requiredRole="worker"><WorkerPanel /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          {/* Любой другой путь → редирект на "/" */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-right" />
      </div>
    </AuthProvider>
  )
}

// Компонент для редиректа с корня
function RequireAuthRedirect() {
  const { token } = React.useContext(AuthContext)
  return token ? <Navigate to="/profile" /> : <Navigate to="/login" />
}
