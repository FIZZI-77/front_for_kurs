import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import {
  getUserList,
  banUser,
  unbanUser,
  assignWorker,
  deleteWorker,
  createSkill
} from '../api/admin'
import { toast } from 'react-toastify'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [skillName, setSkillName] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await getUserList({ page, limit, role, search })
      setUsers(res.data.users || [])
    } catch (err) {
      toast.error('Ошибка загрузки пользователей')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page, role])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  const action = async (fn, userId, msgSuccess) => {
    try {
      await fn(userId)
      toast.success(msgSuccess)
      load()
    } catch (err) {
      toast.error('Ошибка')
    }
  }

  const submitSkill = async (e) => {
    e.preventDefault()
    try {
      await createSkill(skillName)
      setSkillName('')
      toast.success('Навык создан')
    } catch (err) {
      toast.error('Не удалось создать навык')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Админская панель</h2>

        {/* Filters */}
        <form onSubmit={handleSearch} className="flex space-x-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по email / имени"
            className="p-2 border rounded flex-1"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Все роли</option>
            <option value="user">User</option>
            <option value="contractor">Contractor</option>
            <option value="admin">Admin</option>
          </select>

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Поиск
          </button>
        </form>

        {/* Create Skill */}
        <form onSubmit={submitSkill} className="bg-white shadow p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">Создание нового навыка</h3>
          <div className="flex space-x-4">
            <input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Название"
              className="p-2 border rounded flex-1"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Создать
            </button>
          </div>
        </form>

        {/* Users */}
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <div className="bg-white shadow rounded p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Email</th>
                  <th className="p-2">Имя</th>
                  <th className="p-2">Телефон</th>
                  <th className="p-2">Роль</th>
                  <th className="p-2">Статус</th>
                  <th className="p-2">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.full_name}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2">
                      {u.is_banned ? 'Забанен' : 'Активен'}
                    </td>

                    <td className="p-2 space-x-2">
                      {!u.is_banned ? (
                        <button
                          onClick={() => action(banUser, u.id, 'Пользователь забанен')}
                          className="px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Бан
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            action(unbanUser, u.id, 'Пользователь разбанен')
                          }
                          className="px-2 py-1 bg-yellow-500 text-white rounded"
                        >
                          Разбан
                        </button>
                      )}

                      {u.role === 'user' && (
                        <button
                          onClick={() =>
                            action(assignWorker, u.id, 'Назначен рабочим')
                          }
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          Сделать worker
                        </button>
                      )}

                      {u.role === 'contractor' && (
                        <button
                          onClick={() =>
                            action(deleteWorker, u.id, 'Рабочий удалён')
                          }
                          className="px-2 py-1 bg-gray-600 text-white rounded"
                        >
                          Удалить worker
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Назад
              </button>

              <button
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Далее
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
