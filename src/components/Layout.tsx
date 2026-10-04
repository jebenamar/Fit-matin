import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { IconCalendar, IconChart, IconHome, IconUser } from './Icons'

const links = [
  { to: '/', label: 'Accueil', icon: IconHome, end: true },
  { to: '/programme', label: 'Programme', icon: IconCalendar },
  { to: '/progression', label: 'Progression', icon: IconChart },
  { to: '/profil', label: 'Profil', icon: IconUser },
]

export function Layout() {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <div className="app-scroll">
          <Outlet />
        </div>
        <nav className="app-tabbar">
          <ul className="grid grid-cols-4 gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold ${
                      isActive ? 'text-accent' : 'text-mute'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon active={isActive} />
                      {link.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export function BareShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-frame overflow-hidden">{children}</div>
    </div>
  )
}
