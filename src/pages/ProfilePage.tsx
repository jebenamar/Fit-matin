import type { ReactNode } from 'react'
import { Screen } from '../components/Icons'
import { maxDumbbellKg } from '../lib/loads'
import { useAppStore } from '../store/useAppStore'

export function ProfilePage() {
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const resetAll = useAppStore((s) => s.resetAll)
  const maxKg = maxDumbbellKg(profile.plates, profile.handleKg)

  return (
    <Screen>
      <p className="text-sm font-medium text-mute">Réglages</p>
      <h1 className="display mt-1 text-5xl">Profil</h1>
      <p className="mt-2 text-sm text-mute">
        Tout est modifiable : poids, objectifs, matériel, date de départ du programme.
      </p>

      <div className="mt-6 space-y-3">
        <Field label="Prénom">
          <input
            value={profile.name}
            placeholder="Toi"
            onChange={(e) => updateProfile({ name: e.target.value })}
            className="field"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Poids (kg)">
            <input
              inputMode="decimal"
              value={profile.weightKg}
              onChange={(e) => updateProfile({ weightKg: Number(e.target.value) || 0 })}
              className="field"
            />
          </Field>
          <Field label="Taille (cm)">
            <input
              inputMode="numeric"
              value={profile.heightCm}
              onChange={(e) => updateProfile({ heightCm: Number(e.target.value) || 0 })}
              className="field"
            />
          </Field>
        </div>
        <Field label="Tour de taille (cm)">
          <input
            inputMode="decimal"
            value={profile.waistCm ?? ''}
            onChange={(e) =>
              updateProfile({
                waistCm: e.target.value ? Number(e.target.value) : null,
              })
            }
            className="field"
          />
        </Field>
        <Field label="Début du programme">
          <input
            type="date"
            value={profile.programStartDate}
            onChange={(e) => updateProfile({ programStartDate: e.target.value })}
            className="field"
          />
        </Field>
      </div>

      <section className="mt-8 rounded-[24px] bg-card p-4">
        <h2 className="font-bold">Matériel</h2>
        <p className="mt-1 text-xs text-mute">
          Haltères modulables · poignée {profile.handleKg} kg · max {maxKg} kg / haltère
        </p>
        <ul className="mt-4 space-y-3">
          {profile.plates.map((plate, i) => (
            <li key={plate.kg} className="flex items-center justify-between">
              <span className="text-sm">Disques {plate.kg} kg</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="tap grid place-items-center rounded-full bg-bg-2 text-lg"
                  onClick={() => {
                    const plates = profile.plates.map((p, idx) =>
                      idx === i ? { ...p, count: Math.max(0, p.count - 2) } : p,
                    )
                    updateProfile({ plates })
                  }}
                >
                  −
                </button>
                <span className="w-8 text-center font-bold">{plate.count}</span>
                <button
                  type="button"
                  className="tap grid place-items-center rounded-full bg-bg-2 text-lg"
                  onClick={() => {
                    const plates = profile.plates.map((p, idx) =>
                      idx === i ? { ...p, count: p.count + 2 } : p,
                    )
                    updateProfile({ plates })
                  }}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        className="ghost-btn mt-8 w-full"
        onClick={() => {
          if (confirm('Réinitialiser profil, séances et charges ?')) resetAll()
        }}
      >
        Réinitialiser l’app
      </button>
    </Screen>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-[0.14em] text-mute">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  )
}
