'use client'
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    twitterUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
    contactEmail: '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setSettings(prev => ({ ...prev, ...data }))
        }
      })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error occurred.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-subtitle">Manage your blog configuration and global site settings.</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} mb-4`}>
          {message.text}
        </div>
      )}

      <form className="card-solid" style={{ padding: '2rem' }} onSubmit={handleSave}>
        <h3 className="font-heading mb-4 text-xl">General Settings</h3>
        
        <div className="input-wrap mb-4">
          <label className="input-label" htmlFor="siteName">Site Name</label>
          <input className="input" id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} placeholder="e.g. My Awesome Blog" />
        </div>

        <div className="input-wrap mb-6">
          <label className="input-label" htmlFor="siteDescription">Site Description</label>
          <textarea className="input" id="siteDescription" name="siteDescription" rows={3} value={settings.siteDescription} onChange={handleChange} placeholder="A short description of your site..." />
        </div>

        <h3 className="font-heading mb-4 text-xl">Social & Contact Links</h3>

        <div className="input-wrap mb-4">
          <label className="input-label" htmlFor="contactEmail">Public Contact Email</label>
          <input className="input" type="email" id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} placeholder="hello@example.com" />
        </div>

        <div className="input-wrap mb-4">
          <label className="input-label" htmlFor="twitterUrl">Twitter URL</label>
          <input className="input" id="twitterUrl" name="twitterUrl" value={settings.twitterUrl} onChange={handleChange} placeholder="https://twitter.com/..." />
        </div>

        <div className="input-wrap mb-4">
          <label className="input-label" htmlFor="githubUrl">GitHub URL</label>
          <input className="input" id="githubUrl" name="githubUrl" value={settings.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
        </div>

        <div className="input-wrap mb-6">
          <label className="input-label" htmlFor="linkedinUrl">LinkedIn URL</label>
          <input className="input" id="linkedinUrl" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
        </div>

        <div className="input-wrap mb-4">
          <label className="input-label" htmlFor="facebookUrl">Facebook URL</label>
          <input className="input" id="facebookUrl" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
        </div>

        <div className="input-wrap mb-6">
          <label className="input-label" htmlFor="youtubeUrl">YouTube URL</label>
          <input className="input" id="youtubeUrl" name="youtubeUrl" value={settings.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/..." />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="spinner" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
