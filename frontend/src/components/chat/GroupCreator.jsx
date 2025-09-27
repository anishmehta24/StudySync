import { useEffect, useState } from 'react'
import { ChatApi } from '../../api/chatApi'

const GroupCreator = ({ onClose, onCreated }) => {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) { setResults([]); return }
      const res = await ChatApi.searchUsers(query)
      if (res.success) setResults(res.users)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const addUser = (u) => {
    if (!selected.find(x => x._id === u._id)) setSelected(prev => [...prev, u])
  }
  const removeUser = (id) => setSelected(prev => prev.filter(u => u._id !== id))

  const create = async () => {
    if (!name.trim()) return
    if (selected.length === 0) return
    setLoading(true)
    const res = await ChatApi.createGroup({ name: name.trim(), participantIds: selected.map(u => u._id) })
    setLoading(false)
    if (res.success) onCreated?.(res.conversation)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 8, width: 560, padding: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Create Group</div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20 }}>×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Group name" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users by name or email" style={{ padding: 8, border: '1px solid #ddd', borderRadius: 6 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, border: '1px solid #eee', borderRadius: 6, padding: 8, maxHeight: 240, overflowY: 'auto' }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Results</div>
              {results.map(u => (
                <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{u.email}</div>
                  </div>
                  <button onClick={() => addUser(u)} style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 6 }}>Add</button>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, border: '1px solid #eee', borderRadius: 6, padding: 8, maxHeight: 240, overflowY: 'auto' }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Selected</div>
              {selected.map(u => (
                <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #f3f3f3' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>{u.email}</div>
                  </div>
                  <button onClick={() => removeUser(u._id)} style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 6 }}>Remove</button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={onClose} style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6 }}>Cancel</button>
            <button onClick={create} disabled={loading} style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6, background: '#111', color: '#fff' }}>Create Group</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupCreator
