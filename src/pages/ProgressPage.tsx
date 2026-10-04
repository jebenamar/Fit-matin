import { useState } from 'react'
import { Screen } from '../components/Icons'
import { Sparkline } from '../components/Sparkline'
import { EXERCISE_LIST } from '../data/exercises'
import { formatPrettyDate } from '../lib/dates'
import { bmi } from '../lib/loads'
import { useAppStore } from '../store/useAppStore'

export function ProgressPage() {
  const profile = useAppStore((s) => s.profile)
  const metrics = useAppStore((s) => s.metrics)
  const sessions = useAppStore((s) => s.sessions)
  const loads = useAppStore((s) => s.loads)
  const addMetric = useAppStore((s) => s.addMetric)

  const [weight, setWeight] = useState(String(profile.weightKg))
  const [waist, setWaist] = useState(profile.waistCm ? String(profile.waistCm) : '')

  const weights = metrics.map((m) => m.weightKg)
  const startWeight = metrics[0]?.weightKg ?? profile.weightKg
  const currentWeight = metrics[metrics.length - 1]?.weightKg ?? profile.weightKg
  const delta = Math.round((currentWeight - startWeight) * 10) / 10
  const waists = metrics.map((m) => m.waistCm).filter((v): v is number => v != null)
  const waistDelta =
    waists.length >= 2 ? Math.round((waists[waists.length - 1] - waists[0]) * 10) / 10 : null
  const done = sessions.filter((s) => s.completed)
  const calories = done.reduce((sum, s) => sum + s.calories, 0)
  const loadEntries = EXERCISE_LIST.filter((ex) => ex.loadType !== 'none' && loads[ex.id])

  return (
    <Screen>
      <p className="text-sm font-medium text-mute">Suivi</p>
      <h1 className="display mt-1 text-5xl">Progression</h1>

      <section className="mt-6 rounded-[28px] bg-card p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mute">Poids</p>
        <div className="mt-2 flex items-end justify-between">
          <p className="display text-6xl leading-none">{currentWeight}<span className="text-2xl text-mute"> kg</span></p>
          <p className={`text-sm font-bold ${delta <= 0 ? 'text-ok' : 'text-accent'}`}>
            {delta > 0 ? '+' : ''}
            {delta} kg
          </p>
        </div>
        <Sparkline values={weights.length ? weights : [currentWeight, currentWeight]} />
        <p className="text-xs text-mute">IMC {bmi(currentWeight, profile.heightCm)} · départ {startWeight} kg</p>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-[24px] bg-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">Tour de taille</p>
          <p className="display mt-2 text-4xl">
            {profile.waistCm ?? '—'}
            <span className="text-lg text-mute"> cm</span>
          </p>
          {waistDelta != null && (
            <p className={`text-xs font-bold ${waistDelta <= 0 ? 'text-ok' : 'text-accent'}`}>
              {waistDelta > 0 ? '+' : ''}
              {waistDelta} cm
            </p>
          )}
        </div>
        <div className="rounded-[24px] bg-card p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-mute">Séances</p>
          <p className="display mt-2 text-4xl">{done.length}</p>
          <p className="text-xs text-mute">{calories} kcal estimées</p>
        </div>
      </section>

      <form
        className="mt-5 rounded-[24px] bg-card p-4"
        onSubmit={(e) => {
          e.preventDefault()
          const w = Number(weight.replace(',', '.'))
          const t = waist ? Number(waist.replace(',', '.')) : null
          if (!w) return
          addMetric(w, t)
        }}
      >
        <p className="text-sm font-bold">Nouveau relevé</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-xs text-mute">
            Poids (kg)
            <input
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 min-h-12 w-full rounded-2xl bg-bg-2 px-3 text-ink outline-none"
            />
          </label>
          <label className="text-xs text-mute">
            Tour de taille (cm)
            <input
              inputMode="decimal"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="mt-1 min-h-12 w-full rounded-2xl bg-bg-2 px-3 text-ink outline-none"
            />
          </label>
        </div>
        <button type="submit" className="cta mt-4 w-full">
          Enregistrer
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-mute">Historique poids</h2>
        <ul className="mt-3 space-y-2">
          {metrics
            .slice()
            .reverse()
            .slice(0, 8)
            .map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3">
                <span className="text-sm text-mute">{formatPrettyDate(m.date)}</span>
                <span className="font-semibold">
                  {m.weightKg} kg
                  {m.waistCm ? ` · ${m.waistCm} cm` : ''}
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-mute">Charges</h2>
        <ul className="mt-3 space-y-2">
          {loadEntries.length === 0 && (
            <li className="rounded-2xl bg-card px-4 py-3 text-sm text-mute">
              Les charges apparaîtront après ta première séance avec haltères.
            </li>
          )}
          {loadEntries.map((ex) => {
            const state = loads[ex.id]
            const first = state.history[0]?.kg
            const last = state.current
            const gain = first != null ? last - first : 0
            return (
              <li key={ex.id} className="rounded-2xl bg-card px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{ex.name}</p>
                  <p className="display text-2xl">{last} kg</p>
                </div>
                <p className="text-xs text-mute">
                  {state.history.length} relevé{state.history.length > 1 ? 's' : ''}
                  {gain ? ` · ${gain > 0 ? '+' : ''}${gain} kg` : ''}
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-mute">Séances réalisées</h2>
        <ul className="mt-3 space-y-2">
          {done.length === 0 && (
            <li className="rounded-2xl bg-card px-4 py-3 text-sm text-mute">
              Termine ta première séance pour voir l’historique ici.
            </li>
          )}
          {done
            .slice()
            .reverse()
            .slice(0, 12)
            .map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-xs text-mute">
                    {formatPrettyDate(s.date)} · semaine {s.week} · {Math.round(s.durationSec / 60)} min
                  </p>
                </div>
                <span className="text-xs font-bold text-accent-2">{s.calories} kcal</span>
              </li>
            ))}
        </ul>
      </section>
    </Screen>
  )
}
