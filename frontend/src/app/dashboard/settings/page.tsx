export default function SettingsPage() {
  return (
    <div>
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-subtitle">Manage your blog configuration and global site settings.</p>
      </div>

      <div className="card-solid" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-muted">Global site settings are currently managed via environment variables.</p>
      </div>
    </div>
  )
}
