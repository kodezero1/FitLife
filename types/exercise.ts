import { Set } from '.'

export interface NewExercise {
  name: string
  equipment: string
  muscleGroup:
    | 'upper back'
    | 'lower back'
    | 'shoulder'
    | 'upper arm'
    | 'forearm'
    | 'chest'
    | 'hip'
    | 'upper leg'
    | 'lower leg'
    | 'core'
    | 'cardio'
    | ''
  muscleWorked: string
  metric: 'weight' | 'time' | 'distance'
  creator_id: string
  public: boolean
}
export interface Exercise extends NewExercise {
  readonly _id: string
}

// Exercise History
export type ExerciseHistory = {
  sets: Set[]
  date: string
  exercise_id: string
  metric: Exercise['metric']
}[]

export type ExerciseHistoryMap = Map<string, ExerciseHistory>

export type WorkoutGenerationDifficulty = 'light' | 'medium' | 'heavy'
export type WorkoutGenerationTime = number
export type WorkoutGenerationMuscle = 'arms' | 'legs' | 'chest' | 'back'

export type WorkoutGenerationParams = {
  difficulty: null | WorkoutGenerationDifficulty
  time: null | WorkoutGenerationTime
  muscles: null | WorkoutGenerationMuscle
}
