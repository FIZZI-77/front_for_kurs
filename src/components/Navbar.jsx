import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/Navbar.css' // Подключаем CSS для Navbar

export default function Navbar() {
  const { token, setToken, role } = useContext(AuthContext)
  const navigate = useNavigate()

  const logout = () => {
    setToken(null)
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <h1 className="navbar-logo">Kurs Project</h1>
          <Link className="navbar-link" to="/">Главная</Link>
          <Link className="navbar-link" to="/notifications">Уведомления</Link>
          {(role === 'worker' || role === 'admin') && <Link className="navbar-link" to="/worker">Исполнитель</Link>}
          {role === 'admin' && <Link className="navbar-link" to="/admin">Админка</Link>}
        </div>
        <div className="navbar-right">
          {token 
            ? <button onClick={logout} className="navbar-btn logout-btn">Выйти</button>
            : <Link className="navbar-btn login-btn" to="/login">Войти</Link>
          }
        </div>
      </div>
    </header>
  )
}
