import type { Weekday } from '../types'

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function getWeekday(date: Date): Weekday {
  const day = date.getDay()
  return (day === 0 ? 7 : day) as Weekday
}

export function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const weekday = getWeekday(copy)
  copy.setDate(copy.getDate() - (weekday - 1))
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function addDays(date: Date, amount: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + amount)
  return copy
}

export function diffDays(a: Date, b: Date): number {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime()
  return Math.round(ms / 86_400_000)
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function formatDayShort(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '')
}

export function formatPrettyDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function getProgramWeek(startISO: string, date = new Date()): number {
  const start = parseISODate(startISO)
  const days = Math.max(0, diffDays(date, start))
  return (Math.floor(days / 7) % 4) + 1
}
