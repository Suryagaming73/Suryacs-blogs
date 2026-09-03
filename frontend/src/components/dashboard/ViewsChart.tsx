'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useState, useEffect } from 'react'

export function ViewsChart({ data }: { data: { title: string; views: number }[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 0)
  }, [])

  if (!mounted) {
    return <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius)' }} />
  }

  // Format titles so they don't break the layout if too long
  const formattedData = data.map(item => ({
    name: item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title,
    fullTitle: item.title,
    Views: item.views,
  }))

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-strong)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            dy={10} 
          />
          <YAxis 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            axisLine={false} 
            tickLine={false} 
            dx={-10}
          />
          <Tooltip
            cursor={{ fill: 'var(--surface-hover)' }}
            contentStyle={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--border-strong)', 
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            labelStyle={{ color: 'var(--text-strong)', fontWeight: 600, marginBottom: '0.25rem' }}
            itemStyle={{ color: 'var(--accent)', fontWeight: 500 }}
            formatter={(value) => [value, 'Views']}
            labelFormatter={(_, payload) => {
              if (payload && payload.length > 0) {
                return payload[0].payload.fullTitle
              }
              return ''
            }}
          />
          <Bar dataKey="Views" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
