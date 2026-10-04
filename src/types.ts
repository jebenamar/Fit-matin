export type ExerciseId =
  | 'squat'
  | 'pushup'
  | 'reverse-lunge'
  | 'mountain-climber'
  | 'high-knees'
  | 'plank'
  | 'side-plank'
  | 'dead-bug'
  | 'bird-dog'
  | 'goblet-squat'
  | 'one-arm-row'
  | 'two-db-row'
  | 'rdl'
  | 'shoulder-press'
  | 'floor-press'
  | 'db-lunge'
  | 'bicep-curl'
  | 'walk'

export type SessionKind =
  | 'full-body-a'
  | 'full-body-b'
  | 'full-body-c'
  | 'cardio-core'
  | 'cardio-light'
  | 'walk'
  | 'rest'

export type LoadType = 'none' | 'per_dumbbell'

export type ExerciseCategory = 'strength' | 'core' | 'cardio' | 'recovery'

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface ExerciseDef {
  id: ExerciseId
  name: string
  cue: string
  equipment: 'none' | 'dumbbells'
  loadType: LoadType
  defaultLoadKg: number
  met: number
  category: ExerciseCategory
}

export interface WorkoutItem {
  exerciseId: ExerciseId
  sets: number
  reps?: number
  durationSec?: number
  restSec: number
  recommendedLoadKg?: number
}

export interface DailyWorkout {
  id: string
  week: number
  weekday: Weekday
  kind: SessionKind
  title: string
  subtitle: string
  focus: string
  items: WorkoutItem[]
  extraRound: boolean
}

export interface PlateStock {
  kg: number
  count: number
}

export interface Profile {
  name: string
  weightKg: number
  heightCm: number
  waistCm: number | null
  programStartDate: string
  handleKg: number
  plates: PlateStock[]
}

export interface LoadEntry {
  date: string
  kg: number
}

export interface LoadState {
  current: number
  history: LoadEntry[]
}

export interface BodyMetric {
  id: string
  date: string
  weightKg: number
  waistCm: number | null
}

export interface CompletedSession {
  id: string
  date: string
  workoutId: string
  week: number
  kind: SessionKind
  title: string
  durationSec: number
  calories: number
  completed: boolean
  skipped: boolean
}

export const SESSION_LABELS: Record<SessionKind, string> = {
  'full-body-a': 'Full Body A',
  'full-body-b': 'Full Body B',
  'full-body-c': 'Full Body C',
  'cardio-core': 'Cardio + gainage',
  'cardio-light': 'Cardio léger',
  walk: 'Marche / récup',
  rest: 'Repos',
}

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
  7: 'Dimanche',
}

export const WEEK_INTENTS: Record<number, string> = {
  1: 'Découverte des mouvements et technique',
  2: 'Plus de répétitions, même qualité',
  3: 'Charges en légère hausse',
  4: 'Intensité max, récup plus courte',
}
