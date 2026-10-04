import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExerciseAnimation } from '../animations/ExerciseAnimation'
import { Screen } from '../components/Icons'
import { getExercise } from '../data/exercises'
import { PROGRAM, estimateWorkoutMinutes, getWorkout } from '../data/program'
import { getProgramWeek, getWeekday } from '../lib/dates'
import { useAppStore } from '../store/useAppStore'
import { SESSION_LABELS, WEEK_INTENTS, WEEKDAY_LABELS, type Weekday } from '../types'

export function ProgramPage() {
  const start = useAppStore((s) => s.profile.programStartDate)
  const currentWeek = getProgramWeek(start)
  const [week, setWeek] = useState(currentWeek)
  const todayWeekday = getWeekday(new Date())
  const days = ( [1, 2, 3, 4, 5, 6, 7] as Weekday[] ).map((weekday) =>
    getWorkout(week, weekday),
  )

  return (
    <Screen>
      <p className="text-sm font-medium text-mute">Cycle de 4 semaines</p>
      <h1 className="display mt-1 text-5xl">Programme</h1>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWeek(w)}
            className={`min-h-12 rounded-2xl text-sm font-bold ${
              week === w ? 'bg-accent text-black' : 'bg-card text-ink'
            }`}
          >
            S{w}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-mute">{WEEK_INTENTS[week]}</p>

      <ul className="mt-6 space-y-3">
        {days.map((day) => {
          const isToday = week === currentWeek && day.weekday === todayWeekday
          return (
            <li key={day.id} className="overflow-hidden rounded-[24px] bg-card">
              <div className="flex items-center justify-between px-4 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
                    {WEEKDAY_LABELS[day.weekday]}
                    {isToday ? ' · aujourd’hui' : ''}
                  </p>
                  <p className="mt-1 text-lg font-bold">{day.title}</p>
                  <p className="text-xs text-mute">
                    {day.kind === 'rest'
                      ? 'Récupération complète'
                      : `${estimateWorkoutMinutes(day)} min · ${day.items.length} exercice${day.items.length > 1 ? 's' : ''} · ${SESSION_LABELS[day.kind]}`}
                  </p>
                </div>
                {day.kind !== 'rest' ? (
                  <Link to={`/seance?id=${day.id}`} className="rounded-full bg-accent px-3 py-2 text-xs font-extrabold uppercase text-black">
                    {isToday ? 'Go' : 'Voir'}
                  </Link>
                ) : (
                  <span className="rounded-full bg-card-2 px-3 py-2 text-xs font-bold text-mute">
                    {day.focus}
                  </span>
                )}
              </div>
              {day.items.length > 0 && (
                <div className="flex gap-2 overflow-x-auto px-4 pb-4">
                  {day.items.map((item, i) => (
                    <div
                      key={`${day.id}-${item.exerciseId}-${i}`}
                      className="min-w-[92px] rounded-2xl bg-bg-2 p-2 text-center"
                    >
                      <ExerciseAnimation id={item.exerciseId} compact />
                      <p className="mt-1 truncate text-[11px] font-semibold">
                        {getExercise(item.exerciseId).name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-center text-xs text-mute">
        {PROGRAM.length} séances dans le cycle · difficulté progressive
      </p>
    </Screen>
  )
}
