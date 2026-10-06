import { EXERCISES } from './exercises'
import type {
  DailyWorkout,
  ExerciseId,
  SessionKind,
  Weekday,
  WorkoutItem,
} from '../types'

export const REST_BETWEEN_SETS_SEC = 40
export const REST_BETWEEN_EXERCISES_SEC = 120

interface TemplateItem {
  exerciseId: ExerciseId
  restSec: number
  reps?: number
  durationSec?: number
  load?: number
}

const FULL_A: TemplateItem[] = [
  { exerciseId: 'goblet-squat', reps: 8, restSec: 40, load: 8 },
  { exerciseId: 'pushup', reps: 8, restSec: 40 },
  { exerciseId: 'one-arm-row', reps: 8, restSec: 40, load: 8 },
  { exerciseId: 'reverse-lunge', reps: 8, restSec: 40 },
  { exerciseId: 'shoulder-press', reps: 8, restSec: 40, load: 6 },
  { exerciseId: 'plank', durationSec: 20, restSec: 30 },
]

const FULL_B: TemplateItem[] = [
  { exerciseId: 'rdl', reps: 8, restSec: 40, load: 10 },
  { exerciseId: 'floor-press', reps: 8, restSec: 40, load: 8 },
  { exerciseId: 'two-db-row', reps: 8, restSec: 40, load: 8 },
  { exerciseId: 'db-lunge', reps: 8, restSec: 40, load: 6 },
  { exerciseId: 'bicep-curl', reps: 8, restSec: 35, load: 6 },
  { exerciseId: 'dead-bug', reps: 8, restSec: 25 },
]

const FULL_C: TemplateItem[] = [
  { exerciseId: 'goblet-squat', reps: 8, restSec: 40, load: 8 },
  { exerciseId: 'pushup', reps: 8, restSec: 40 },
  { exerciseId: 'rdl', reps: 8, restSec: 40, load: 10 },
  { exerciseId: 'one-arm-row', reps: 8, restSec: 40, load: 8 },
  { exerciseId: 'bird-dog', reps: 8, restSec: 25 },
  { exerciseId: 'mountain-climber', durationSec: 25, restSec: 30 },
]

const CARDIO_CORE: TemplateItem[] = [
  { exerciseId: 'high-knees', durationSec: 30, restSec: 20 },
  { exerciseId: 'mountain-climber', durationSec: 25, restSec: 20 },
  { exerciseId: 'plank', durationSec: 20, restSec: 20 },
  { exerciseId: 'side-plank', durationSec: 20, restSec: 20 },
  { exerciseId: 'dead-bug', reps: 8, restSec: 20 },
  { exerciseId: 'high-knees', durationSec: 30, restSec: 20 },
]

const CARDIO_LIGHT: TemplateItem[] = [
  { exerciseId: 'walk', durationSec: 180, restSec: 15 },
  { exerciseId: 'high-knees', durationSec: 25, restSec: 20 },
  { exerciseId: 'plank', durationSec: 20, restSec: 20 },
  { exerciseId: 'side-plank', durationSec: 18, restSec: 20 },
  { exerciseId: 'bird-dog', reps: 8, restSec: 20 },
]

const WALK: TemplateItem[] = [
  { exerciseId: 'walk', durationSec: 1200, restSec: 0 },
]

interface DayTemplate {
  weekday: Weekday
  kind: SessionKind
  title: string
  subtitle: string
  focus: string
  items: TemplateItem[]
}

const WEEK_TEMPLATE: DayTemplate[] = [
  {
    weekday: 1,
    kind: 'full-body-a',
    title: 'Full Body A',
    subtitle: 'Jambes, poussée, tirage',
    focus: 'Force',
    items: FULL_A,
  },
  {
    weekday: 2,
    kind: 'cardio-core',
    title: 'Cardio + gainage',
    subtitle: 'Ventre et cardio matin',
    focus: 'Cardio',
    items: CARDIO_CORE,
  },
  {
    weekday: 3,
    kind: 'full-body-b',
    title: 'Full Body B',
    subtitle: 'Chaîne postérieure et bras',
    focus: 'Force',
    items: FULL_B,
  },
  {
    weekday: 4,
    kind: 'cardio-light',
    title: 'Cardio léger + gainage',
    subtitle: 'Intensité douce, ventre',
    focus: 'Récup',
    items: CARDIO_LIGHT,
  },
  {
    weekday: 5,
    kind: 'full-body-c',
    title: 'Full Body C',
    subtitle: 'Mix force et gainage',
    focus: 'Force',
    items: FULL_C,
  },
  {
    weekday: 6,
    kind: 'walk',
    title: 'Marche active',
    subtitle: 'Récupération, 20 minutes',
    focus: 'Récup',
    items: WALK,
  },
  {
    weekday: 7,
    kind: 'rest',
    title: 'Repos',
    subtitle: 'Récupération complète',
    focus: 'Repos',
    items: [],
  },
]

function progressTemplate(week: number, item: TemplateItem): WorkoutItem {
  const extraRound = week === 4
  const sets = extraRound ? 4 : 3
  let reps = item.reps
  let durationSec = item.durationSec
  let restSec = item.restSec
  let load = item.load

  if (week === 2) {
    if (reps) reps = Math.min(reps + 2, 12)
    if (durationSec && durationSec < 120) durationSec += 8
  }

  if (week === 3) {
    if (reps) reps = Math.min(reps + 2, 12)
    if (durationSec && durationSec < 120) durationSec += 10
    if (load) load += 2
  }

  if (week === 4) {
    if (reps) reps = 12
    if (durationSec && durationSec < 120) durationSec += 15
    if (load) load += 2
  }

  if (item.exerciseId === 'walk' && item.durationSec && item.durationSec >= 180) {
    durationSec = week === 1 ? 1200 : week === 2 ? 1320 : week === 3 ? 1440 : 1500
    restSec = 0
  }

  return {
    exerciseId: item.exerciseId,
    sets: item.exerciseId === 'walk' && (item.durationSec ?? 0) >= 180 ? 1 : sets,
    reps,
    durationSec,
    restSec,
    recommendedLoadKg: load,
  }
}

export function buildProgram(): DailyWorkout[] {
  const workouts: DailyWorkout[] = []
  for (let week = 1; week <= 4; week += 1) {
    for (const day of WEEK_TEMPLATE) {
      workouts.push({
        id: `w${week}-d${day.weekday}`,
        week,
        weekday: day.weekday,
        kind: day.kind,
        title: day.title,
        subtitle: day.subtitle,
        focus: day.focus,
        extraRound: week === 4 && day.kind.startsWith('full-body'),
        items: day.items.map((item) => progressTemplate(week, item)),
      })
    }
  }
  return workouts
}

export const PROGRAM = buildProgram()

export function getWorkout(week: number, weekday: Weekday): DailyWorkout {
  const found = PROGRAM.find((w) => w.week === week && w.weekday === weekday)
  return found ?? PROGRAM[0]
}

export function estimateWorkoutMinutes(workout: DailyWorkout): number {
  if (workout.kind === 'rest') return 0
  let seconds = 0
  workout.items.forEach((item, i) => {
    const work = item.durationSec ?? Math.round((item.reps ?? 10) * 2.4)
    seconds += item.sets * work
    seconds += Math.max(0, item.sets - 1) * REST_BETWEEN_SETS_SEC
    if (i < workout.items.length - 1) seconds += REST_BETWEEN_EXERCISES_SEC
  })
  return Math.max(8, Math.round(seconds / 60))
}

export function estimateWorkoutCalories(
  workout: DailyWorkout,
  weightKg: number,
): number {
  if (workout.kind === 'rest') return 0
  let kcal = 0
  for (const item of workout.items) {
    const def = EXERCISES[item.exerciseId]
    const workSec = item.durationSec ?? Math.round((item.reps ?? 10) * 2.4)
    const minutes = (item.sets * workSec) / 60
    kcal += def.met * 3.5 * weightKg * minutes * 0.005
  }
  return Math.round(kcal)
}
