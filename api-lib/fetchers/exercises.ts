import { Exercise, NewExercise } from '../../types'
import { getHeaderToken } from '../auth/token'

export const getExercisesFromIdArray = async (idArr: string[]) => {
  if (!Boolean(idArr.length)) return []

  try {
    const res = await fetch('/api/exercises/queryMultiple', {
      method: 'POST',
      body: JSON.stringify(idArr),
    })

    const exercises: Exercise[] = await res.json()
    return exercises
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getExerciseNamesFromIdArray = async (idArr: string[]) => {
  if (!Boolean(idArr.length)) return []

  try {
    const res = await fetch('/api/exercises/names', {
      method: 'POST',
      body: JSON.stringify(idArr),
    })

    const workouts: { _id: string; name: string }[] = await res.json()

    // Sort workouts to be in the same order that the irArr requests them
    workouts.sort((a, b) => idArr.indexOf(a._id.toString()) - idArr.indexOf(b._id.toString()))

    return workouts
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getExercisesByUserId = async (user_id: string) => {
  if (!user_id) return

  try {
    const res = await fetch(`/api/exercises?creator_id=${user_id}`)
    const exercises: Exercise[] = await res.json()
    return exercises
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getNonDefaultExercises = async () => {
  try {
    const res = await fetch(`/api/exercises?default=false`)
    const exercises: Exercise[] = await res.json()
    return exercises
  } catch (e) {
    console.log(e)
    return []
  }
}

export const createExercise = async (newExercise: NewExercise) => {
  try {
    const res = await fetch('/api/exercises', {
      method: 'POST',
      body: JSON.stringify(newExercise),
      headers: { token: getHeaderToken() },
    })
    const { exercise }: { exercise: Exercise | undefined } = await res.json()
    return exercise || false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const deleteExercise = async (exercise_id: string) => {
  try {
    const res = await fetch(`/api/exercises/${exercise_id}`, {
      method: 'DELETE',
      headers: { token: getHeaderToken() },
    })
    return res.status === 204 ? exercise_id : false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const setExercisePublic = async (exercise_id: string, isPublic: boolean) => {
  try {
    const res = await fetch(`/api/exercises/${exercise_id}?public=${isPublic}`, {
      method: 'PUT',
      headers: { token: getHeaderToken() },
    })
    const { exercise }: { exercise: Exercise | undefined } = await res.json()
    return exercise || false
  } catch (e) {
    console.log(e)
    return false
  }
}
