import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import useWebSocket from '../hooks/useWebSocket'
import { toast } from 'react-toastify'

export default function Notifications() {
  const [events, setEvents] = useState([])

  useWebSocket((data) => {
    setEvents(prev => [data, ...prev].slice(0,50))
    toast.info(data.message || JSON.stringify(data))
  })

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl mb-4">Уведомления</h2>
        <div className="space-y-2">
          {events.map((e, i) => (
            <div key={i} className="bg-white p-3 rounded shadow">
              <pre className="text-sm">{JSON.stringify(e)}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
