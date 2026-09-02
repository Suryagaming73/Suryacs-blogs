'use client'
import { useState, useEffect } from 'react'
import { Users, Shield, Trash2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface User { id: string; email: string; username: string; role: string; createdAt: string; avatarUrl?: string | null }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/users').then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false) })
  }, [])

  async function del(id: string, username: string) {
    if (!confirm(`Delete user "${username}"? All their comments and likes will be removed.`)) return
    await fetch(`/api/dashboard/users/${id}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Users</h1>
        <p className="dashboard-subtitle">{users.length} registered users</p>
      </div>

      <div className="card-solid">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}><span className="spinner spinner-accent" style={{ margin: '0 auto' }} /></td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <span className="avatar avatar-sm">{getInitials(u.username)}</span>
                      )}
                      <span className="font-medium">{u.username}</span>
                    </div>
                  </td>
                  <td className="text-muted text-sm">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-muted'}`}>
                      {u.role === 'admin' ? <><Shield size={10} /> Admin</> : 'Viewer'}
                    </span>
                  </td>
                  <td className="text-faint text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(u.id, u.username)} id={`delete-user-${u.id}`}><Trash2 size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
