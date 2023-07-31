import { Exercise, Workout, Set } from '.'

export type User = {
  readonly _id: string
  readonly username: string
  email?: string
  savedWorkouts?: Array<string>
  workoutLog: WorkoutLog
  weight?: { weight: number; date: string }[]
  following?: Array<string>
  followers?: Array<string>
  bio?: string
  isAdmin?: boolean
  teamsJoined?: Array<string>
  preferences?: {
    weightUnit: 'lb' | 'kg'
    distanceUnit: 'mi' | 'km'
    showDateBarInLog: boolean
    showMuscleIconsInLog: boolean
    showExerciseChartsInLog: boolean
    showProfileBio: boolean
    showDupesInWorkoutNameSearch: boolean
    setPresets: string[]
  }
  profileImgUrl?: string
  password?: string
  recentlyViewedUsers?: string[]
  lastLoggedIn: string
  accountCreated: string
  subscription: {
    active: boolean
    plan: 'free' | 'month' | 'year' | 'infinite'
    currentPeriodEnd: number
    currentPeriodStart: number
    customerId: string
  }
}

export interface ShortUser {
  readonly _id: string
  readonly username: string
  profileImgUrl: string | undefined
}

export interface WorkoutLog {
  [isoDate: string]: WorkoutLogItem
}

export interface WorkoutLogItem {
  completed: boolean
  exerciseData: {
    exercise_id: string
    metric: Exercise['metric']
    sets: Set[]
    exercise?: Exercise
  }[]
  workoutNote: string
  workout_id?: string
  workoutName: string
  workout?: Workout
  isoDate?: string
}
