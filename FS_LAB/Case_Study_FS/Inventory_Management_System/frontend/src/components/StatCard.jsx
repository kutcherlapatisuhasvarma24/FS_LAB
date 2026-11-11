import React from 'react'

const StatCard = ({ icon, label, value, color = 'primary', prefix = '' }) => {
  // Determine if color is a preset theme or custom hex/rgb
  const isPreset = ['primary', 'success', 'warning', 'danger', 'info'].includes(color)
  const colorClass = isPreset ? `stat-${color}` : 'stat-primary'
  const customStyle = !isPreset && color ? { '--stat-accent': color } : {}

  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('en-IN')
      : value ?? '0'

  return (
    <div className={`stat-card ${colorClass}`} style={customStyle}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon">
          {icon}
        </div>
      </div>
      <div className="stat-card-value">
        {prefix && <span style={{ marginRight: '2px', opacity: 0.9 }}>{prefix}</span>}
        {formattedValue}
      </div>
    </div>
  )
}

export default StatCard
