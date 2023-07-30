import dayjs from 'dayjs'
import { formatSetRepsAndWeight, round } from '.'
import { getExercisesFromIdArray } from '../api-lib/fetchers'
import {
  Routine,
  RoutineForCalendar,
  WeightSet as WeightSetType,
  Workout,
  WorkoutLog,
  WorkoutLogItem,
  Exercise,
  ExerciseHistoryMap,
  User,
  TimeSet as TimeSetType,
  Set,
} from '../types'
import { WeightSet, TimeSet, DistanceSet } from './classes/sets'

/**
 *
 * addExerciseDataToLogItem
 * addExerciseDataToWorkout
 * moveItemInArray
 * groupWorkoutLogByExercise
 * hasEnteredWeight
 * weightSetsAreComplete
 * getMuscleGroupsOfWorkout
 * getMuscleGroupsOfWorkoutLogItem
 * getSortedWorkoutLogDateArray
 * copyToClipboard
 * isTrue
 *
 */

export const addExerciseDataToLogItem = async (logItem: WorkoutLogItem) => {
  logItem = JSON.parse(JSON.stringify(logItem))
  // Grab all exercise_ids from the workout
  const idArr = logItem.exerciseData.map((each) => each.exercise_id)
  // Get all exercise information
  const exerciseData = await getExercisesFromIdArray(idArr)
  // Create exercise key in each exercise to hold exercise data
  logItem.exerciseData.map((each, i) => (each.exercise = exerciseData[i]))
  return logItem
}

export const addExerciseDataToWorkout = async (workout: Workout) => {
  workout = JSON.parse(JSON.stringify(workout))
  // Grab all the exercise_ids from the workout
  const idArr = workout.exercises.map((each) => each.exercise_id)
  // Query for exercise data using the idArr
  const exerciseData = await getExercisesFromIdArray(idArr)
  // Create exercise key in each exercise to hold exercise data
  workout.exercises.map((each, i) => (each.exercise = exerciseData[i]))
  return workout
}

export const moveItemInArray = (arr: any | undefined[], startIndex: number, endIndex: number) => {
  if (endIndex >= arr.length) {
    let k = endIndex - arr.length + 1
    while (k--) arr.push(undefined)
  }
  arr.splice(endIndex, 0, arr.splice(startIndex, 1)[0])
  return arr // for testing
}

export const formatRoutineForCalendar = (plan: Routine['workoutPlan']) => {
  const res: RoutineForCalendar = {}

  plan.map((day) => {
    res[day.isoDate.substring(0, 10)] = {
      workout_id: day.workout_id,
      workout: day.workout,
    }
  })

  return res
}

/**
 *
 * @param log User workout log
 * @returns a Map() where the keys are exercise id's and the values are arrays of all exercise sets that have been logged to the exercise and sorted by most recent date
 * @shape <string, { sets: Set[]; date: string; exercise_id: string; }[]>
 */
export const groupWorkoutLogByExercise = (log: WorkoutLog) => {
  const group: ExerciseHistoryMap = new Map()

  for (let [date, { exerciseData }] of Object.entries(log)) {
    exerciseData.forEach(({ exercise_id, sets, metric }) => {
      const curr = group.get(exercise_id)
      group.set(exercise_id, [{ date, sets, exercise_id, metric }, ...(curr || [])])
    })
  }

  // Sort all exercise history's by date (newest to oldest)
  for (let [exercise_id, exerciseHistory] of [...group.entries()]) {
    group.set(
      exercise_id,
      exerciseHistory.sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1))
    )
  }

  return group
}

export const hasEnteredWeight = (weight: string | number) => {
  return typeof weight === 'number' && weight >= 0
}

/**
 *
 * @param sets
 * @returns true if all sets in an exercise are filled in with a number, otherwise false
 */
export const weightSetsAreComplete = (sets: WeightSetType[]) => {
  return sets.every(({ weight }) => hasEnteredWeight(weight))
}

/**
 *
 * @param workout
 * @returns array of muscle group data from a workout
 * @shape [(muscle group name), { count: (number of exercises with muscle group); exerciseIds: string[];}][]
 */
export const getMuscleGroupsOfWorkout = (workout: Workout) => {
  const counts: Map<Exercise['muscleGroup'], { count: number; exerciseIds: string[] }> = new Map()

  workout.exercises.forEach(({ exercise, exercise_id }) => {
    if (!exercise) return
    const curr = counts.get(exercise.muscleGroup)
    if (curr) {
      curr.count++
      curr.exerciseIds.push(exercise_id)
      counts.set(exercise.muscleGroup, curr)
    } else {
      counts.set(exercise.muscleGroup, { count: 1, exerciseIds: [exercise_id] })
    }
  })
  return Object.entries(Object.fromEntries(counts)) as [
    Exercise['muscleGroup'],
    { count: number; exerciseIds: string[] }
  ][]
}

/**
 *
 * @param logItem
 * @returns array of muscle groups with data from a workout log item
 * @shape [ Muscle Group Name, {
 *  count: number of exercises with muscle group;
 *  exerciseIds: string[];
 * }][]
 */
export const getMuscleGroupsOfWorkoutLogItem = (
  logItem: WorkoutLogItem
): [Exercise['muscleGroup'], { count: number; exerciseIds: string[] }][] => {
  const counts: Map<Exercise['muscleGroup'], { count: number; exerciseIds: string[] }> = new Map()

  logItem.exerciseData.forEach((item) => {
    const { exercise, exercise_id } = item
    if (!exercise) return
    const curr = counts.get(exercise.muscleGroup)
    if (curr) {
      curr.count++
      curr.exerciseIds.push(exercise_id)
      counts.set(exercise.muscleGroup, curr)
    } else {
      counts.set(exercise.muscleGroup, { count: 1, exerciseIds: [exercise_id] })
    }
  })
  return Object.entries(Object.fromEntries(counts)) as [
    Exercise['muscleGroup'],
    { count: number; exerciseIds: string[] }
  ][]
}

/**
 *
 * @param workoutLog
 * @returns sorted date keys from workout log
 */
export const getSortedWorkoutLogDateArray = (workoutLog: WorkoutLog) => {
  return Object.keys(workoutLog).sort((a, b) => a.localeCompare(b))
}

/**
 *
 * @param text
 * @returns
 */
export const copyToClipboard = (text: string) => {
  var textarea = document.createElement('textarea')
  textarea.textContent = text
  textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in Microsoft Edge.
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy') // Security exception may be thrown by some browsers.
  } catch (e) {
    console.warn('Copy to clipboard failed.', e)
    return prompt('Copy to clipboard: Ctrl+C, Enter', text) || false
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 *
 * @param val any Boolean or Undefiend value
 * @returns If val is undefined, default to true, otherwise return val
 */
export const isTrue = (val: boolean | undefined, defaultVal: boolean = true) => {
  return val === undefined ? defaultVal : val
}

/**
 *
 * @param user
 */
export const getRecentUserWorkouts = (user?: User) => {
  if (!user) return []

  const seenNames = new Map()

  return getSortedWorkoutLogDateArray(user.workoutLog || {})
    .reverse()
    .map((date) => {
      return {
        workoutName: user.workoutLog[date].workoutName || '',
        date,
      }
    })
    .filter(
      (w) =>
        (isTrue(user.preferences?.showDupesInWorkoutNameSearch, false)
          ? true
          : seenNames.get(user.workoutLog[w.date].workoutName)
          ? false
          : seenNames.set(user.workoutLog[w.date].workoutName, true)) &&
        w.workoutName &&
        w.workoutName.toLowerCase() !== 'on the fly'
    )
}

export const initWorkoutLogItem = (): WorkoutLogItem => ({
  completed: false,
  exerciseData: [],
  workoutNote: '',
  workoutName: 'On the Fly',
})

// const ok = "on the fly|id:1=w/12-10-10,id:2=w/12-10-10";
export const compressWorkout = (logItem: WorkoutLogItem) => {
  const { exerciseData, workoutName } = logItem
  let res = `${workoutName}|`

  exerciseData.forEach((exercise, i) => {
    res += exercise.exercise_id + '=' + compressExercise(exercise) + (exerciseData[i + 1] ? ',' : '')
  })

  return res
}

export const parseWorkout = (workout: string): WorkoutLogItem => {
  const split = workout.split('|')

  const workoutName = split[0]

  const exerciseData = split[1].split(',').map((exercise) => ({
    exercise_id: exercise.split('=')[0],
    ...parseExercise(exercise.split('=')[1]),
  }))

  return { ...initWorkoutLogItem(), workoutName, exerciseData }
}

export const compressExercise = (exerciseData: WorkoutLogItem['exerciseData'][0]) => {
  const { metric } = exerciseData
  let res = ''

  switch (metric) {
    case 'weight':
      res += 'w/'
      exerciseData.sets.forEach((set: WeightSetType, i) => {
        const reps = formatSetRepsAndWeight(set.reps)
        const weight = formatSetRepsAndWeight(set.weight)
        res += reps
        if (weight) res += 'x' + weight
        if (exerciseData.sets[i + 1]) res += '-'
      })
      break
    case 'time':
      res += 't/'
      exerciseData.sets.forEach((set: TimeSetType, i) => {
        res +=
          set.duration > 10 * 60 * 60
            ? round(set.duration / 10 / 60 / 60, 2) + 'h'
            : set.duration > 10 * 60
            ? round(set.duration / 10 / 60, 2) + 'm'
            : round(set.duration / 10, 2) + 's'
        if (i < exerciseData.sets.length - 1) res += '-'
      })
      break
    case 'distance':
      res += 'd/'
      break
    default:
      break
  }
  return res
}

/**
 *
 * @param exerciseData String representation of set data.
 * @examples
 *  w/10-10-10 -> Three sets of 10 reps
 *
 *  w/8x5-8x5-8x5 -> Three sets of 8 reps and weight of 5
 *
 *  t/1h-20m-30s -> Three sets with respective durations
 */
export const parseExercise = (exerciseData: string): { sets: Set[]; metric: Exercise['metric'] } => {
  const exerciseSplit = exerciseData.split('/')
  const metric = exerciseSplit[0]
  const sets = exerciseSplit[1]?.split('-')

  if (!sets || !metric) throw new Error('Invalid stringified exercise data')

  let newSets: Set[] = []

  sets.forEach((set) => {
    switch (metric) {
      case 'w':
        const [reps, weight] = set.split('x')
        newSets.push(new WeightSet({ reps, weight, type: '1' }))
        break
      case 't':
        const duration = parseFloat(set.slice(0, -1))
        const timeMetric = set.slice(-1)
        let durationMs = 0

        switch (timeMetric) {
          case 'h':
            durationMs = duration * 10 * 60 * 60
            break
          case 'm':
            durationMs = duration * 10 * 60
            break
          case 's':
            durationMs = duration * 10
            break
          default:
            throw new Error('Invalid time metric')
        }
        newSets.push(new TimeSet({ duration: durationMs, startedAt: 0, ongoing: false, type: '1' }))
        break
      case 'd':
        newSets.push(new DistanceSet())
        break
      default:
        throw new Error('Invalid set metric type')
    }
  })

  return {
    sets: newSets,
    metric: metric === 'w' ? 'weight' : metric === 't' ? 'time' : 'distance',
  }
}
