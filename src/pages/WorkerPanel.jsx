import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getAllRequests, updateRequestStatus } from '../api/requests'
import RequestCard from '../components/RequestCard'
import { toast } from 'react-toastify'

export default function WorkerPanel() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const res = await getAllRequests()
      setRequests(res.data || [])
    } catch (err) {
      toast.error('Не удалось загрузить заявки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const take = async (id) => {
    try {
      await updateRequestStatus(id, { action: 'take' })
      toast.success('Заявка принята')
      load()
    } catch (err) {
      toast.error('Ошибка')
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl mb-4">Панель исполнителя</h2>
        {loading ? <div>Загрузка...</div> :
          <div className="grid grid-cols-1 gap-4">
            {requests.map(r => (
              <div key={r.id} className="flex items-start gap-4">
                <RequestCard req={r} />
                <div className="self-center">
                  <button onClick={()=>take(r.id)} className="px-3 py-1 rounded bg-blue-600 text-white">Взять</button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}
