import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    try {
      // Регистрация пользователя в Auth Service
      const res = await register({ name, email, password })
      const token = res.data.token

      // Сохраняем токен в контекст
      setToken(token)

      toast.success('Регистрация успешна!')

      // Редирект на страницу профиля, там пользователь создаст профиль
      navigate('/profile')
    } catch (err) {
      console.error(err.response?.data || err)
      // Разделяем ошибки
      if (err.response?.data?.error === 'user already exists') {
        toast.error('Пользователь с таким email уже существует')
      } else {
        toast.error('Ошибка регистрации')
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold text-center">Регистрация</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя"
          type="text"
          className="w-full p-2 border rounded"
          required
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="w-full p-2 border rounded"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          type="password"
          className="w-full p-2 border rounded"
          required
        />

        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Повторите пароль"
          type="password"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
        >
          Зарегистрироваться
        </button>

        <div className="text-center text-sm">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </div>
      </form>
    </div>
  )
}
