import { NewWorkout, Workout } from '../../types'

import { getHeaderToken } from '../auth/token'

export const postNewWorkout = async (newWorkout: NewWorkout) => {
  try {
    const res = await fetch(`/api/workouts`, {
      method: 'POST',
      body: JSON.stringify(newWorkout),
      headers: { token: getHeaderToken() },
    })

    const { workout_id } = await res.json()
    const workout: Workout = { ...newWorkout, _id: workout_id }

    return workout_id ? workout : false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const updateExistingWorkout = async (workout: Workout) => {
  try {
    const res = await fetch(`/api/workouts/${workout._id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
      headers: { token: getHeaderToken() },
    })

    return res.status === 204 ? workout : false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const deleteWorkout = async (workout_id: string) => {
  try {
    const res = await fetch(`/api/workouts/${workout_id}`, {
      method: 'DELETE',
      headers: { token: getHeaderToken() },
    })

    return res.status === 204 ? workout_id : false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const getWorkoutFromId = async (workout_id: string): Promise<Workout | false> => {
  try {
    const res = await fetch(`/api/workouts/${workout_id}`)

    const workoutData = await res.json()
    return workoutData
  } catch (e) {
    console.log(e)
    return false
  }
}

// Queries
export const getWorkoutsByCreatorId = async (user_id?: string): Promise<Workout[]> => {
  if (!user_id) return []

  try {
    const res = await fetch(`/api/workouts?creator_id=${user_id}`)

    const userMadeWorkouts = await res.json()

    // Reverse to get newest to front
    return userMadeWorkouts.reverse()
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getAllPublicWorkouts = async (): Promise<Workout[]> => {
  try {
    const res = await fetch('/api/workouts?isPublic=true')

    const publicWorkouts = await res.json()

    // Reverse to get newest to front
    return publicWorkouts.reverse()
  } catch (e) {
    console.log(e)
    return []
  }
}

// Multiple
export const getWorkoutsFromIdArray = async (idArr: string[]): Promise<Workout[]> => {
  if (!Boolean(idArr.length)) return []

  try {
    const res = await fetch('/api/workouts/queryMultiple', {
      method: 'POST',
      body: JSON.stringify(idArr),
    })

    const workouts = await res.json()

    // Sort workouts to be in the same order that the irArr requests them
    workouts.sort((a: Workout, b: Workout) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString()))

    return workouts
  } catch (e) {
    console.log(e)
    return []
  }
}
