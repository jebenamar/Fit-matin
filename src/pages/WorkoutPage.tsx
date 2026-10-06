import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ExerciseAnimation } from '../animations/ExerciseAnimation'
import { LoadStepper } from '../components/LoadStepper'
import { BareShell } from '../components/Layout'
import { IconCheck, IconClose, IconPause, IconPlay } from '../components/Icons'
import { getExercise } from '../data/exercises'
import { PROGRAM, REST_BETWEEN_EXERCISES_SEC, REST_BETWEEN_SETS_SEC } from '../data/program'
import { formatDuration } from '../lib/dates'
import { maxDumbbellKg } from '../lib/loads'
import { useAppStore, useTodayWorkout } from '../store/useAppStore'

type Phase = 'work' | 'rest' | 'done'

export function WorkoutPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const todayWorkout = useTodayWorkout()
  const workout = PROGRAM.find((w) => w.id === params.get('id')) ?? todayWorkout
  const profile = useAppStore((s) => s.profile)
  const loads = useAppStore((s) => s.loads)
  const setLoad = useAppStore((s) => s.setLoad)
  const completeSession = useAppStore((s) => s.completeSession)

  const items = workout.items
  const [index, setIndex] = useState(0)
  const [setNo, setSetNo] = useState(1)
  const [phase, setPhase] = useState<Phase>(items.length ? 'work' : 'done')
  const [running, setRunning] = useState(true)
  const [startedAt] = useState(() => Date.now())
  const item = items[index]
  const exercise = item ? getExercise(item.exerciseId) : null
  const nextAfterRest = setNo < (item?.sets ?? 1) ? item : items[index + 1]
  const nextExercise = nextAfterRest ? getExercise(nextAfterRest.exerciseId) : null

  const timed = Boolean(item?.durationSec)
  const workSec = item?.durationSec ?? 0
  const [left, setLeft] = useState(workSec)
  const doneRef = useRef(false)
  const handlingZero = useRef(false)

  useEffect(() => {
    const timerNeeded = phase === 'rest' || (phase === 'work' && timed)
    if (phase === 'done' || !running || !timerNeeded || left <= 0) return
    const id = window.setInterval(() => {
      setLeft((v) => Math.max(0, v - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [phase, timed, running, left])

  useEffect(() => {
    let lock: WakeLockSentinel | undefined
    void navigator.wakeLock
      ?.request('screen')
      .then((sent) => {
        lock = sent
      })
      .catch(() => undefined)
    return () => {
      void lock?.release()
    }
  }, [])

  const currentLoad = useMemo(() => {
    if (!exercise || exercise.loadType === 'none') return 0
    return (
      loads[exercise.id]?.current ??
      item?.recommendedLoadKg ??
      exercise.defaultLoadKg
    )
  }, [exercise, loads, item])

  const maxKg = maxDumbbellKg(profile.plates, profile.handleKg)

  function finishWorkout(skipped = false) {
    if (doneRef.current) return
    doneRef.current = true
    completeSession({
      workout,
      durationSec: Math.round((Date.now() - startedAt) / 1000),
      skipped,
    })
    setPhase('done')
  }

  function advanceAfterRest() {
    if (!item) {
      finishWorkout(false)
      return
    }
    if (setNo < item.sets) {
      setSetNo((n) => n + 1)
      setPhase('work')
      setLeft(item.durationSec ?? 0)
      setRunning(true)
      return
    }
    if (index < items.length - 1) {
      const next = items[index + 1]
      setIndex((i) => i + 1)
      setSetNo(1)
      setPhase('work')
      setLeft(next.durationSec ?? 0)
      setRunning(true)
      return
    }
    finishWorkout(false)
  }

  function goCompleteSet() {
    if (!item || !exercise) return
    if (exercise.loadType !== 'none') setLoad(exercise.id, currentLoad, true)
    const lastSet = setNo >= item.sets
    const lastExercise = index >= items.length - 1
    if (lastSet && lastExercise) {
      finishWorkout(false)
      return
    }
    setPhase('rest')
    setLeft(lastSet ? REST_BETWEEN_EXERCISES_SEC : REST_BETWEEN_SETS_SEC)
    setRunning(true)
  }

  function skipExercise() {
    if (index < items.length - 1) {
      const next = items[index + 1]
      setIndex((i) => i + 1)
      setSetNo(1)
      setPhase('work')
      setLeft(next.durationSec ?? 0)
      setRunning(true)
      return
    }
    finishWorkout(false)
  }

  useEffect(() => {
    if (left !== 0 || phase === 'done') {
      handlingZero.current = false
      return
    }
    if (handlingZero.current) return
    handlingZero.current = true
    if (phase === 'work' && timed) goCompleteSet()
    if (phase === 'rest') advanceAfterRest()
  }, [left, phase, timed])

  if (workout.kind === 'rest' || items.length === 0) {
    return (
      <BareShell>
        <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="display text-6xl">Repos</p>
          <p className="mt-3 text-mute">Pas de séance aujourd’hui. Reviens demain.</p>
          <Link to="/" className="cta mt-8 flex items-center justify-center px-8">
            Retour
          </Link>
        </div>
      </BareShell>
    )
  }

  if (phase === 'done' || !item || !exercise) {
    const minutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000))
    return (
      <BareShell>
        <div className="flex min-h-full flex-1 flex-col px-6 pb-10 pt-[calc(24px+env(safe-area-inset-top))]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent-2">Séance terminée</p>
          <h1 className="display mt-3 text-6xl leading-[0.9]">
            Bien
            <br />
            joué.
          </h1>
          <p className="mt-4 text-mute">Le plus dur, c’était de commencer.</p>
          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-card p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-mute">Durée</p>
              <p className="display mt-1 text-4xl">{minutes} min</p>
            </div>
            <div className="rounded-3xl bg-card p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-mute">Exercices</p>
              <p className="display mt-1 text-4xl">{items.length}</p>
            </div>
          </div>
          <button type="button" className="cta mt-auto" onClick={() => navigate('/')}>
            Terminer
          </button>
        </div>
      </BareShell>
    )
  }

  const betweenSets = setNo < item.sets
  const restTotal = betweenSets ? REST_BETWEEN_SETS_SEC : REST_BETWEEN_EXERCISES_SEC
  const lastSet = setNo >= item.sets
  const lastExercise = index >= items.length - 1
  const nextLabel =
    betweenSets
      ? `${exercise.name} × ${item.reps ?? `${item.durationSec}s`} · série ${setNo + 1}/${item.sets}`
      : nextExercise
        ? `${nextExercise.name}${nextAfterRest?.reps ? ` × ${nextAfterRest.reps}` : nextAfterRest?.durationSec ? ` · ${nextAfterRest.durationSec}s` : ''}`
        : 'Fin de séance'

  return (
    <BareShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-[calc(18px+env(safe-area-inset-bottom))] pt-[calc(12px+env(safe-area-inset-top))]">
        <header className="flex shrink-0 items-center justify-between">
          <button
            type="button"
            className="tap grid place-items-center rounded-full bg-card"
            aria-label="Fermer"
            onClick={() => navigate('/')}
          >
            <IconClose />
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mute">
            {index + 1} / {items.length}
          </p>
          <span className="w-12" />
        </header>

        {phase === 'rest' ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-mute">
                {betweenSets ? 'Récupération série' : 'Récupération exercice'}
              </p>
              <p className="mt-1 text-sm text-mute">
                {betweenSets
                  ? `${REST_BETWEEN_SETS_SEC} secondes avant la série suivante`
                  : `${REST_BETWEEN_EXERCISES_SEC / 60} minutes avant le prochain exercice`}
              </p>
              <RestTimer left={left} total={restTotal} />
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-2">
                Passage automatique à 00:00
              </p>
              <div className="mt-6 w-full rounded-3xl bg-card p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-mute">
                  {betweenSets ? 'Prochaine série' : 'Prochain exercice'}
                </p>
                <p className="mt-1 text-lg font-bold">{nextLabel}</p>
                {nextAfterRest ? (
                  <div className="mx-auto mt-2 max-w-[160px]">
                    <ExerciseAnimation id={nextAfterRest.exerciseId} compact />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex shrink-0 gap-3">
              <button type="button" className="ghost-btn flex-1" onClick={() => setRunning((v) => !v)}>
                {running ? 'Pause' : 'Reprendre'}
              </button>
              <button type="button" className="cta flex-1" onClick={advanceAfterRest}>
                Passer
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto pb-2">
              <div className="-mx-2 mt-1">
                <ExerciseAnimation id={exercise.id} />
              </div>
              <h1 className="display text-center text-5xl leading-none">{exercise.name}</h1>
              <p className="mt-2 text-center text-sm text-mute">{exercise.cue}</p>
              {item.reps ? (
                <p className="display mt-5 text-center text-4xl text-accent-2">{item.reps} répétitions</p>
              ) : null}
              <p className="mt-2 text-center text-sm font-semibold text-mute">
                Série {setNo} / {item.sets}
              </p>
              {!lastSet || !lastExercise ? (
                <p className="mt-1 text-center text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                  {lastSet
                    ? `Ensuite : ${REST_BETWEEN_EXERCISES_SEC / 60} min de récup`
                    : `Ensuite : ${REST_BETWEEN_SETS_SEC} s de récup`}
                </p>
              ) : null}

              {exercise.loadType !== 'none' && (
                <div className="mt-5 rounded-3xl bg-card px-4 py-4">
                  <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-mute">
                    Charge {item.recommendedLoadKg ? `· recommandé ${item.recommendedLoadKg} kg` : ''}
                  </p>
                  <LoadStepper
                    value={currentLoad}
                    min={profile.handleKg}
                    max={maxKg}
                    onChange={(kg) => setLoad(exercise.id, kg)}
                  />
                </div>
              )}

              {timed && (
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="tap grid place-items-center rounded-full bg-card"
                    onClick={() => setRunning((v) => !v)}
                    aria-label={running ? 'Pause' : 'Reprendre'}
                  >
                    {running ? <IconPause /> : <IconPlay />}
                  </button>
                  <p className="display text-5xl">{formatDuration(left)}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex shrink-0 gap-3">
              <button type="button" className="ghost-btn flex-1" onClick={skipExercise}>
                Passer
              </button>
              <button
                type="button"
                className="cta flex-[1.4] inline-flex items-center justify-center gap-2"
                onClick={goCompleteSet}
              >
                Terminé <IconCheck />
              </button>
            </div>
          </>
        )}
      </div>
    </BareShell>
  )
}

function RestTimer({ left, total }: { left: number; total: number }) {
  const size = 220
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? left / total : 0

  return (
    <div className="relative mt-4 grid place-items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ff5a1f"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <p className="absolute display text-[72px] leading-none text-accent" aria-live="polite">
        {formatDuration(left)}
      </p>
    </div>
  )
}
