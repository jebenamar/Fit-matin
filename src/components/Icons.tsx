import type { ReactNode } from 'react'

export function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke={active ? '#FF5A1F' : 'currentColor'}
        strokeWidth="1.8"
        fill={active ? 'rgba(255,90,31,0.18)' : 'none'}
      />
    </svg>
  )
}

export function IconCalendar({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="3"
        stroke={active ? '#FF5A1F' : 'currentColor'}
        strokeWidth="1.8"
        fill={active ? 'rgba(255,90,31,0.18)' : 'none'}
      />
      <path d="M3.5 10h17M8 3v4M16 3v4" stroke={active ? '#FF5A1F' : 'currentColor'} strokeWidth="1.8" />
    </svg>
  )
}

export function IconChart({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 19h16M7 16v-5M12 16V7M17 16v-8"
        stroke={active ? '#FF5A1F' : 'currentColor'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconUser({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="8"
        r="3.2"
        stroke={active ? '#FF5A1F' : 'currentColor'}
        strokeWidth="1.8"
        fill={active ? 'rgba(255,90,31,0.18)' : 'none'}
      />
      <path
        d="M5 19c1.4-3.2 3.8-4.8 7-4.8S17.6 15.8 19 19"
        stroke={active ? '#FF5A1F' : 'currentColor'}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconPause() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="5" width="4.5" height="14" rx="1.5" fill="currentColor" />
      <rect x="13.5" y="5" width="4.5" height="14" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 6.5v11l10-5.5L8 6.5Z" fill="currentColor" />
    </svg>
  )
}

export function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`safe-bottom px-5 pt-[calc(18px+env(safe-area-inset-top))] ${className}`}>
      {children}
    </div>
  )
}
