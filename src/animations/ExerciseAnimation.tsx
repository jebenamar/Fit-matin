import type { ExerciseId } from '../types'
import { getExercise } from '../data/exercises'
import './exercise.css'

import squatA from '../assets/exercises/ex-squat-a.jpg'
import squatB from '../assets/exercises/ex-squat-b.jpg'
import gobletA from '../assets/exercises/ex-goblet-squat-a.jpg'
import gobletB from '../assets/exercises/ex-goblet-squat-b.jpg'
import pushupA from '../assets/exercises/ex-pushup-a.jpg'
import pushupB from '../assets/exercises/ex-pushup-b.jpg'
import lungeA from '../assets/exercises/ex-reverse-lunge-a.jpg'
import lungeB from '../assets/exercises/ex-reverse-lunge-b.jpg'
import climberA from '../assets/exercises/ex-mountain-climber-a.jpg'
import climberB from '../assets/exercises/ex-mountain-climber-b.jpg'
import kneesA from '../assets/exercises/ex-high-knees-a.jpg'
import kneesB from '../assets/exercises/ex-high-knees-b.jpg'
import plankA from '../assets/exercises/ex-plank-a.jpg'
import plankB from '../assets/exercises/ex-plank-b.jpg'
import sidePlankA from '../assets/exercises/ex-side-plank-a.jpg'
import sidePlankB from '../assets/exercises/ex-side-plank-b.jpg'
import deadBugA from '../assets/exercises/ex-dead-bug-a.jpg'
import deadBugB from '../assets/exercises/ex-dead-bug-b.jpg'
import birdDogA from '../assets/exercises/ex-bird-dog-a.jpg'
import birdDogB from '../assets/exercises/ex-bird-dog-b.jpg'
import oneRowA from '../assets/exercises/ex-one-arm-row-a.jpg'
import oneRowB from '../assets/exercises/ex-one-arm-row-b.jpg'
import twoRowA from '../assets/exercises/ex-two-db-row-a.jpg'
import twoRowB from '../assets/exercises/ex-two-db-row-b.jpg'
import rdlA from '../assets/exercises/ex-rdl-a.jpg'
import rdlB from '../assets/exercises/ex-rdl-b.jpg'
import pressA from '../assets/exercises/ex-shoulder-press-a.jpg'
import pressB from '../assets/exercises/ex-shoulder-press-b.jpg'
import floorA from '../assets/exercises/ex-floor-press-a.jpg'
import floorB from '../assets/exercises/ex-floor-press-b.jpg'
import dbLungeA from '../assets/exercises/ex-db-lunge-a.jpg'
import dbLungeB from '../assets/exercises/ex-db-lunge-b.jpg'
import curlA from '../assets/exercises/ex-bicep-curl-a.jpg'
import curlB from '../assets/exercises/ex-bicep-curl-b.jpg'
import walkA from '../assets/exercises/ex-walk-a.jpg'
import walkB from '../assets/exercises/ex-walk-b.jpg'

type Pace = 'strength' | 'cardio' | 'hold'

const FRAMES: Record<ExerciseId, { a: string; b: string; pace: Pace }> = {
  squat: { a: squatA, b: squatB, pace: 'strength' },
  'goblet-squat': { a: gobletA, b: gobletB, pace: 'strength' },
  pushup: { a: pushupA, b: pushupB, pace: 'strength' },
  'reverse-lunge': { a: lungeA, b: lungeB, pace: 'strength' },
  'mountain-climber': { a: climberA, b: climberB, pace: 'cardio' },
  'high-knees': { a: kneesA, b: kneesB, pace: 'cardio' },
  plank: { a: plankA, b: plankB, pace: 'hold' },
  'side-plank': { a: sidePlankA, b: sidePlankB, pace: 'hold' },
  'dead-bug': { a: deadBugA, b: deadBugB, pace: 'strength' },
  'bird-dog': { a: birdDogA, b: birdDogB, pace: 'strength' },
  'one-arm-row': { a: oneRowA, b: oneRowB, pace: 'strength' },
  'two-db-row': { a: twoRowA, b: twoRowB, pace: 'strength' },
  rdl: { a: rdlA, b: rdlB, pace: 'strength' },
  'shoulder-press': { a: pressA, b: pressB, pace: 'strength' },
  'floor-press': { a: floorA, b: floorB, pace: 'strength' },
  'db-lunge': { a: dbLungeA, b: dbLungeB, pace: 'strength' },
  'bicep-curl': { a: curlA, b: curlB, pace: 'strength' },
  walk: { a: walkA, b: walkB, pace: 'cardio' },
}

const ACTION: Record<ExerciseId, string> = {
  squat: 'Descendre comme pour s’asseoir',
  'goblet-squat': 'Haltère à la poitrine, descendre',
  'reverse-lunge': 'Grand pas en arrière',
  'db-lunge': 'Fente contrôlée, buste droit',
  rdl: 'Hanche en arrière, dos plat',
  'one-arm-row': 'Tirer l’haltère vers la hanche',
  'two-db-row': 'Tirer les deux haltères',
  walk: 'Marcher, bras relâchés',
  'high-knees': 'Genoux hauts, rythme régulier',
  pushup: 'Poitrine vers le sol, corps gainé',
  plank: 'Corps aligné, bassin stable',
  'mountain-climber': 'Genou vers la poitrine, alterner',
  'shoulder-press': 'Pousser les haltères au ciel',
  'bicep-curl': 'Monter sans se balancer',
  'floor-press': 'Pousser au-dessus de la poitrine',
  'dead-bug': 'Bras et jambe opposés s’éloignent',
  'bird-dog': 'Bras et jambe opposés s’allongent',
  'side-plank': 'Hanche haute, épaules empilées',
}

export function ExerciseAnimation({
  id,
  compact = false,
}: {
  id: ExerciseId
  compact?: boolean
}) {
  const exercise = getExercise(id)
  const frames = FRAMES[id]

  return (
    <div className={`ex-block${compact ? ' is-compact' : ''}`}>
      <div
        className={`ex-photo pace-${frames.pace}`}
        role="img"
        aria-label={`${exercise.name}. ${exercise.cue}`}
      >
        <img src={frames.a} alt="" className="ex-frame ex-frame-a" />
        <img src={frames.b} alt="" className="ex-frame ex-frame-b" />
      </div>
      {!compact ? <p className="ex-action">{ACTION[id]}</p> : null}
    </div>
  )
}
