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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl p-4 md:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="font-bold text-lg">Start a new chat</div>
          <button onClick={onClose} className="text-xl leading-none px-2">×</button>
        </div>
        <div className="flex flex-col gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search users by name or email" className="px-3 py-2 border rounded-md" />
          <div className="border rounded-md p-2 max-h-80 overflow-y-auto">
            {results.map(u => (
              <div key={u._id} className="flex items-center justify-between py-1.5 border-b last:border-b-0">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-gray-600">{u.email}</div>
                </div>
                <button disabled={loading} onClick={() => startChat(u._id)} className="px-2 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-60">Start</button>
              </div>
            ))}
            {!results.length && <div className="text-sm text-gray-600">Type to search for users…</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewDirectChat
