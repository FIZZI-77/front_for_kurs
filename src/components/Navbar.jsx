import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { token, setToken, role } = useContext(AuthContext)
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    navigate('/login')
  }

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Kurs Project</h1>
          <Link to="/">Главная</Link>
          <Link to="/notifications">Уведомления</Link>
          {role === 'worker' || role === 'admin' ? <Link to="/worker">Исполнитель</Link> : null}
          {role === 'admin' ? <Link to="/admin">Админка</Link> : null}
        </div>
        <div>
          {token ? <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">Выйти</button> : <Link to="/login">Войти</Link>}
        </div>
      </div>
    </header>
  )
}
