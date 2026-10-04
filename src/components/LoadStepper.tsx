export function LoadStepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number
  onChange: (next: number) => void
  min: number
  max: number
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        className="tap grid place-items-center rounded-full bg-card-2 text-2xl text-ink"
        aria-label="Diminuer la charge"
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <div className="min-w-24 text-center">
        <p className="display text-5xl leading-none text-ink">{value}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-mute">kg</p>
      </div>
      <button
        type="button"
        className="tap grid place-items-center rounded-full bg-card-2 text-2xl text-ink"
        aria-label="Augmenter la charge"
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  )
}
