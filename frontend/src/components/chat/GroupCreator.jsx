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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl md:max-w-2xl p-4 md:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-lg">Create Group Chat</div>
          <button onClick={onClose} className="text-xl leading-none px-2">×</button>
        </div>
        <div className="flex flex-col gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Group Chat name" className="px-3 py-2 border rounded-md" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users by name or email" className="px-3 py-2 border rounded-md" />
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 border rounded-md p-2 max-h-60 overflow-y-auto">
              <div className="font-semibold mb-2">Results</div>
              {results.map(u => (
                <div key={u._id} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-600">{u.email}</div>
                  </div>
                  <button onClick={() => addUser(u)} className="px-2 py-1 border rounded-md hover:bg-gray-50">Add</button>
                </div>
              ))}
              {!results.length && <div className="text-sm text-gray-600">Type to search users…</div>}
            </div>
            <div className="flex-1 border rounded-md p-2 max-h-60 overflow-y-auto">
              <div className="font-semibold mb-2">Selected</div>
              {selected.map(u => (
                <div key={u._id} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-gray-600">{u.email}</div>
                  </div>
                  <button onClick={() => removeUser(u._id)} className="px-2 py-1 border rounded-md hover:bg-gray-50">Remove</button>
                </div>
              ))}
              {!selected.length && <div className="text-sm text-gray-600">No users selected.</div>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded-md">Cancel</button>
            <button onClick={create} disabled={loading} className="px-3 py-2 border rounded-md bg-black text-white disabled:opacity-60">Create Group Chat</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupCreator
