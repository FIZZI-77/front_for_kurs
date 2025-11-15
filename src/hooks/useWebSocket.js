import { useEffect, useRef } from 'react'
import { WS_URL } from '../api/notifications'

export default function useWebSocket(onMessage) {
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws
    ws.onopen = () => console.log('ws open')
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        onMessage && onMessage(data)
      } catch (err) {
        console.error('ws parse err', err)
      }
    }
    ws.onclose = () => console.log('ws close')
    return () => ws.close()
  }, [onMessage])

  return wsRef
}
