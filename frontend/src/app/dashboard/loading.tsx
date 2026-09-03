export default function DashboardLoading() {
  return (
    <div style={{ padding: '1rem 0' }}>
      <div className="dashboard-header">
        <div className="skeleton" style={{ height: 32, width: 200, marginBottom: '0.5rem', borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton" style={{ height: 20, width: 300, borderRadius: 'var(--radius-sm)' }} />
      </div>
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius)', marginTop: '2rem' }} />
    </div>
  )
}
