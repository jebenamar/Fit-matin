import { Link } from 'react-router-dom'
import { ExerciseAnimation } from '../animations/ExerciseAnimation'
import { Screen } from '../components/Icons'
import {
  estimateWorkoutCalories,
  estimateWorkoutMinutes,
} from '../data/program'
import { getExercise } from '../data/exercises'
import {
  addDays,
  formatDayShort,
  getWeekday,
  parseISODate,
  startOfWeek,
  todayISO,
  toISODate,
} from '../lib/dates'
import { useAppStore, useTodayWorkout } from '../store/useAppStore'
import { SESSION_LABELS, WEEK_INTENTS, type Weekday } from '../types'

export function HomePage() {
  const workout = useTodayWorkout()
  const profile = useAppStore((s) => s.profile)
  const sessions = useAppStore((s) => s.sessions)
  const today = todayISO()
  const minutes = estimateWorkoutMinutes(workout)
  const calories = estimateWorkoutCalories(workout, profile.weightKg)
  const weekStart = startOfWeek(new Date())
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const doneThisWeek = sessions.filter((s) => {
    const d = parseISODate(s.date)
    return d >= weekStart && s.completed
  })
  const todayDone = sessions.some((s) => s.date === today && s.completed)
  const previewId = workout.items[0]?.exerciseId ?? 'squat'
  const weekday = getWeekday(new Date())

  return (
    <Screen>
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-mute">
            Bonjour{profile.name ? ` ${profile.name}` : ''} 👋
          </p>
          <h1 className="display mt-1 text-[42px] leading-[0.9] text-ink">
            Prêt pour
            <br />
            ta séance ?
          </h1>
        </div>
        <div className="rounded-2xl bg-card px-3 py-2 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mute">Semaine</p>
          <p className="display text-3xl text-accent">{workout.week}</p>
        </div>
      </header>

      <p className="mt-4 text-sm text-mute">{WEEK_INTENTS[workout.week]}</p>

      <section className="mt-6 overflow-hidden rounded-[28px] bg-card">
        <div className="relative px-5 pt-5">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              {SESSION_LABELS[workout.kind]}
            </span>
            <span className="text-xs font-semibold text-mute">{WEEKDAY_SHORT[weekday]}</span>
          </div>
          <h2 className="display mt-3 text-[34px] leading-none">{workout.title}</h2>
          <p className="mt-1 text-sm text-mute">{workout.subtitle}</p>
          <div className="mx-auto max-w-[220px]">
            <ExerciseAnimation id={previewId} compact />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-px bg-line">
          <Stat label="Durée" value={`${minutes} min`} />
          <Stat
            label="Exercices"
            value={workout.kind === 'rest' ? '—' : String(workout.items.length)}
          />
          <Stat label="Calories" value={workout.kind === 'rest' ? '—' : `~${calories}`} />
        </div>
      </section>

      {workout.kind === 'rest' ? (
        <div className="mt-5 rounded-[24px] border border-line bg-card px-5 py-5">
          <p className="display text-3xl">Jour off</p>
          <p className="mt-1 text-sm text-mute">
            Récupère. Tu peux marcher un peu si tu te sens bien, sinon repose-toi vraiment.
          </p>
        </div>
      ) : (
        <Link
          to="/seance"
          className="cta mt-5 flex items-center justify-center"
        >
          {todayDone ? 'Refaire la séance' : 'Commencer la séance'}
        </Link>
      )}

      <section className="mt-8">
        <div className="flex items-end justify-between">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-mute">Cette semaine</h3>
          <p className="text-sm font-semibold text-accent-2">
            {doneThisWeek.length}/6 séances
          </p>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {weekDays.map((date) => {
            const iso = toISODate(date)
            const isToday = iso === today
            const done = sessions.some((s) => s.date === iso && s.completed)
            const rest = getWeekday(date) === 7
            return (
              <div key={iso} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-mute">
                  {formatDayShort(date)}
                </span>
                <div
                  className={`grid h-11 w-11 place-items-center rounded-full text-xs font-bold ${
                    done
                      ? 'bg-accent text-black'
                      : rest
                        ? 'bg-card text-mute'
                        : isToday
                          ? 'border border-accent text-accent'
                          : 'bg-card text-ink'
                  }`}
                >
                  {done ? '✓' : date.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {doneThisWeek.length > 0 && (
        <section className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-mute">
            Déjà réalisé
          </h3>
          <ul className="mt-3 space-y-2">
            {doneThisWeek
              .slice()
              .reverse()
              .map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-2xl bg-card px-4 py-3"
                >
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-xs text-mute">
                      {s.date} · {Math.round(s.durationSec / 60)} min · {s.calories} kcal
                    </p>
                  </div>
                  <span className="text-ok">✓</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {workout.items.length > 0 && (
        <section className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-mute">
            Au programme
          </h3>
          <ul className="mt-3 space-y-2">
            {workout.items.map((item, i) => {
              const ex = getExercise(item.exerciseId)
              return (
                <li
                  key={`${item.exerciseId}-${i}`}
                  className="flex items-center gap-3 rounded-2xl bg-card px-3 py-2"
                >
                  <div className="w-16">
                    <ExerciseAnimation id={item.exerciseId} compact />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{ex.name}</p>
                    <p className="text-xs text-mute">
                      {item.sets} × {item.reps ? `${item.reps} reps` : `${item.durationSec}s`}
                      {item.recommendedLoadKg ? ` · ${item.recommendedLoadKg} kg` : ''}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </Screen>
  )
}

const WEEKDAY_SHORT: Record<Weekday, string> = {
  1: 'Lun',
  2: 'Mar',
  3: 'Mer',
  4: 'Jeu',
  5: 'Ven',
  6: 'Sam',
  7: 'Dim',
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card-2 px-3 py-4 text-center">
      <p className="display text-2xl leading-none">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mute">{label}</p>
    </div>
  )
}
