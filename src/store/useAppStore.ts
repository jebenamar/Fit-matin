import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getExercise } from '../data/exercises'
import { estimateWorkoutCalories, getWorkout } from '../data/program'
import { getProgramWeek, getWeekday, todayISO } from '../lib/dates'
import { clampLoad } from '../lib/loads'
import type {
  BodyMetric,
  CompletedSession,
  DailyWorkout,
  ExerciseId,
  LoadState,
  Profile,
} from '../types'

const DEFAULT_PROFILE: Profile = {
  name: '',
  weightKg: 86,
  heightCm: 178,
  waistCm: null,
  programStartDate: todayISO(),
  handleKg: 2,
  plates: [
    { kg: 5, count: 4 },
    { kg: 2, count: 8 },
    { kg: 1, count: 8 },
  ],
}

interface AppState {
  profile: Profile
  loads: Record<string, LoadState>
  metrics: BodyMetric[]
  sessions: CompletedSession[]
  updateProfile: (patch: Partial<Profile>) => void
  setLoad: (exerciseId: ExerciseId, kg: number, commit?: boolean) => void
  addMetric: (weightKg: number, waistCm: number | null) => void
  completeSession: (input: {
    workout: DailyWorkout
    durationSec: number
    skipped?: boolean
  }) => void
  resetAll: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      loads: {},
      metrics: [
        {
          id: 'start',
          date: todayISO(),
          weightKg: DEFAULT_PROFILE.weightKg,
          waistCm: null,
        },
      ],
      sessions: [],
      updateProfile: (patch) =>
        set((state) => ({
          profile: { ...state.profile, ...patch },
        })),
      setLoad: (exerciseId, kg, commit = false) =>
        set((state) => {
          const clamped = clampLoad(
            kg,
            state.profile.plates,
            state.profile.handleKg,
          )
          const prev = state.loads[exerciseId]
          return {
            loads: {
              ...state.loads,
              [exerciseId]: {
                current: clamped,
                history: commit
                  ? [...(prev?.history ?? []), { date: todayISO(), kg: clamped }].slice(-40)
                  : (prev?.history ?? []),
              },
            },
          }
        }),
      addMetric: (weightKg, waistCm) =>
        set((state) => ({
          profile: {
            ...state.profile,
            weightKg,
            waistCm: waistCm ?? state.profile.waistCm,
          },
          metrics: [
            ...state.metrics,
            {
              id: crypto.randomUUID(),
              date: todayISO(),
              weightKg,
              waistCm,
            },
          ],
        })),
      completeSession: ({ workout, durationSec, skipped = false }) =>
        set((state) => {
          const date = todayISO()
          const calories = skipped
            ? 0
            : estimateWorkoutCalories(workout, state.profile.weightKg)
          const next: CompletedSession = {
            id: crypto.randomUUID(),
            date,
            workoutId: workout.id,
            week: workout.week,
            kind: workout.kind,
            title: workout.title,
            durationSec,
            calories,
            completed: !skipped,
            skipped,
          }
          const sessions = state.sessions.filter(
            (s) => !(s.date === date && s.workoutId === workout.id),
          )
          return { sessions: [...sessions, next] }
        }),
      resetAll: () =>
        set({
          profile: { ...DEFAULT_PROFILE, programStartDate: todayISO() },
          loads: {},
          metrics: [
            {
              id: 'start',
              date: todayISO(),
              weightKg: DEFAULT_PROFILE.weightKg,
              waistCm: null,
            },
          ],
          sessions: [],
        }),
    }),
    { name: 'fit-matin-v1' },
  ),
)

export function useTodayWorkout(): DailyWorkout {
  const start = useAppStore((s) => s.profile.programStartDate)
  const week = getProgramWeek(start)
  const weekday = getWeekday(new Date())
  return getWorkout(week, weekday)
}

export function useRecommendedLoad(exerciseId: ExerciseId, fallback?: number) {
  return useAppStore((s) => {
    const saved = s.loads[exerciseId]?.current
    if (saved) return saved
    const def = getExercise(exerciseId)
    return fallback ?? def.defaultLoadKg
  })
}
