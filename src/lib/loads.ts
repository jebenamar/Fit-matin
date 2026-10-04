import type { PlateStock } from '../types'

export function maxDumbbellKg(plates: PlateStock[], handleKg: number): number {
  const half: Record<number, number> = {}
  for (const plate of plates) {
    half[plate.kg] = Math.floor(plate.count / 2)
  }
  let extra = 0
  for (const [kg, count] of Object.entries(half)) {
    extra += Number(kg) * count
  }
  return handleKg + extra
}

export function clampLoad(
  kg: number,
  plates: PlateStock[],
  handleKg: number,
): number {
  const max = maxDumbbellKg(plates, handleKg)
  const stepped = Math.round(kg)
  return Math.min(max, Math.max(handleKg, stepped))
}

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100
  return Math.round((weightKg / (m * m)) * 10) / 10
}
