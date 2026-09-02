import { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  color: string
  trend?: string
}

export function StatsCard({ label, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="stat-card fade-in">
      <div className="stat-icon" style={{ background: `${color}18` }}>
        <Icon size={20} color={color} />
      </div>
      <div className="stat-value">
        {typeof value === 'number' ? formatNumber(value) : value}
      </div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem' }}>{trend}</div>
      )}
    </div>
  )
}
