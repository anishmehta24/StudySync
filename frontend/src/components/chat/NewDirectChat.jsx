import { useEffect, useState } from 'react'
import { ChatApi } from '../../api/chatApi'

const NewDirectChat = ({ onClose, onCreated }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return }
      const res = await ChatApi.searchUsers(query)
      if (res.success) setResults(res.users)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const startChat = async (userId) => {
    setLoading(true)
    const res = await ChatApi.createOrGetDirect(userId)
    setLoading(false)
    if (res.success) onCreated?.(res.conversation)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 8, width: 520, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Start a new chat</div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users by name or email" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
          <div style={{ border: '1px solid #eee', borderRadius: 6, padding: 8, maxHeight: 320, overflowY: 'auto' }}>
            {results.map(u => (
              <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>{u.email}</div>
                </div>
                <button disabled={loading} onClick={() => startChat(u._id)} style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 6 }}>Start</button>
              </div>
            ))}
            {!results.length && <div style={{ color: '#666', fontSize: 13 }}>Type to search for users…</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewDirectChat
