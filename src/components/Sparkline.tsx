export function Sparkline({ values, className = '' }: { values: number[]; className?: string }) {
  if (values.length < 2) {
    return <div className={`h-24 rounded-2xl bg-card-2 ${className}`} />
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(1, max - min)
  const w = 320
  const h = 96
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - 12 - ((v - min) / span) * (h - 24)
    return `${x},${y}`
  })
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`h-24 w-full ${className}`} aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill="url(#spark)" />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="#FF5A1F"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
