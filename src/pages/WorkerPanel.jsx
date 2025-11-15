import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import { getAvailableRequests, acceptRequest } from '../api/workerRequests'
import { getWorkerProfile, getWorkerSkills, createWorkerProfile, addWorkerSkills } from '../api/worker'
import { getAllSkills } from '../api/skills'
import { toast } from 'react-toastify'
import AccessDenied from './AccessDenied'
import '../styles/WorkerPanel.css'
import { AuthContext } from '../context/AuthContext'

export default function WorkerPanel() {
  const { role } = useContext(AuthContext)

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [accessDenied, setAccessDenied] = useState(false)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState('')
  const [allSkills, setAllSkills] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])

  useEffect(() => {
    if (role !== 'contractor') {
      setAccessDenied(true)
    } else {
      load()
      loadAllSkills()
    }
  }, [role])

  const load = async () => {
    setLoading(true)
    try {
      const [reqRes, profileRes, skillRes] = await Promise.all([
        getAvailableRequests(),
        getWorkerProfile().catch(() => null),
        getWorkerSkills().catch(() => []),
      ])
      // Здесь берём данные прямо из data.data
      setRequests(Array.isArray(reqRes.data.data) ? reqRes.data.data : [])
      setProfile(profileRes?.data || null)
      setSkills(Array.isArray(skillRes?.data) ? skillRes.data : [])
    } catch (err) {
      if (err.response?.status === 403) {
        setAccessDenied(true)
      } else {
        toast.error('Ошибка загрузки данных')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadAllSkills = async () => {
    try {
      const res = await getAllSkills()
      setAllSkills(res.data || [])
    } catch (err) {
      toast.error('Ошибка загрузки навыков')
    }
  }

  const take = async (id) => {
    setBusyId(id)
    try {
      await acceptRequest(id)
      toast.success('Заявка принята')
      load()
    } catch (err) {
      toast.error('Ошибка при принятии заявки')
    } finally {
      setBusyId(null)
    }
  }

  const handleCreateProfile = async () => {
    if (!newSpecialty.trim()) {
      toast.error('Укажите специальность')
      return
    }
    try {
      await createWorkerProfile({
        specialty: newSpecialty,
        skills: selectedSkills,
      })
      toast.success('Профиль создан')
      setShowCreateForm(false)
      load()
    } catch (err) {
      toast.error('Ошибка при создании профиля')
    }
  }

  const handleAddSkills = async () => {
    if (!selectedSkills.length) {
      toast.error('Выберите хотя бы один навык')
      return
    }
    try {
      await addWorkerSkills(selectedSkills)
      toast.success('Навыки добавлены')
      setSelectedSkills([])
      load()
    } catch (err) {
      toast.error('Ошибка при добавлении навыков')
    }
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AccessDenied />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Панель исполнителя</h2>

        {!profile ? (
          <div className="p-4 mb-6 bg-yellow-100 border border-yellow-300 rounded">
            У вас нет профиля исполнителя.
            <span className="font-semibold"> Создайте его!</span>
            {!showCreateForm ? (
              <div className="mt-2">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Создать профиль
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  placeholder="Специальность"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <select
                  multiple
                  value={selectedSkills}
                  onChange={(e) =>
                    setSelectedSkills(Array.from(e.target.selectedOptions, (o) => Number(o.value)))
                  }
                  className="w-full p-2 border rounded h-40"
                >
                  {allSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 mb-6 bg-green-50 border border-green-300 rounded">
            <div>
              <strong>Специальность:</strong> {profile.specialty}
            </div>
            <div className="mt-1">
              <strong>Навыки:</strong> {skills.length ? skills.map((s) => s.name).join(', ') : 'нет'}
            </div>
          </div>
        )}

        <h3 className="text-xl mb-4 font-medium">Доступные заявки</h3>

        {loading ? (
          <div className="text-gray-500">Загрузка...</div>
        ) : requests.length === 0 ? (
          <div className="text-gray-500 text-lg">Нет доступных заявок</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm bg-white"
              >
                {/* Выводим данные с сервера прямо */}
                <pre className="text-sm text-gray-600">{JSON.stringify(r, null, 2)}</pre>

                {!r.worker_id && profile && (
                  <div className="self-center mt-2">
                    <button
                      onClick={() => take(r.id)}
                      disabled={busyId === r.id}
                      className={`px-3 py-1 rounded text-white ${
                        busyId === r.id ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {busyId === r.id ? '...' : 'Взять'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
