import dayjs from 'dayjs'
import { getHeaderToken, removeAuthToken, setAuthToken } from '../../api-lib/auth/token'
import { WorkoutLogItem } from '../../types'
import { dateCompare } from '../../utils'

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @returns Boolean for the outcome of login request
 */
export const loginWithToken = async (dispatch: any, token: string, shortLog: boolean = false) => {
  try {
    const res = await fetch(`/api/users/loginWithToken${shortLog ? '?short=true' : ''}`, {
      method: 'POST',
      headers: { token },
    })
    const response = await res.json()

    const { userData } = response

    if (!userData) return response

    const isBeforeEndOfSucscription = dateCompare(
      dayjs().toISOString(),
      dayjs.unix(userData.subscription?.currentPeriodEnd || 0).toISOString()
    )

    const canAccessApp =
      userData.subscription?.plan === 'free' ||
      userData.subscription?.plan === 'infinite' ||
      userData.subscription?.active ||
      isBeforeEndOfSucscription

    if (canAccessApp) {
      setAuthToken(token)
      dispatch({ type: 'SET_USER', payload: { userData } })
      return response
    } else {
      dispatch({ type: 'LOGOUT' })
      removeAuthToken()
      return {
        ...response,
        success: false,
        message: 'Your subscription has expired.',
        subscriptionExpired: true,
      }
    }
  } catch (e) {
    console.log(e)
    return { ...e, success: false }
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param username Username from login form
 * @param password Password from login form
 * @returns Boolean for success
 */
export const authLogin = async (dispatch: any, username: string, password: string) => {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const response = await res.json()

    const { userData, token } = response

    if (!userData || !token) return response

    const isBeforeEndOfSucscription = dateCompare(
      dayjs().toISOString(),
      dayjs.unix(userData?.subscription?.currentPeriodEnd || 0).toISOString()
    )

    const canAccessApp =
      userData?.subscription?.plan === 'free' ||
      userData?.subscription?.plan === 'infinite' ||
      userData?.subscription?.active ||
      isBeforeEndOfSucscription

    if (canAccessApp) {
      setAuthToken(token)
      dispatch({ type: 'SET_USER', payload: { userData } })
      return response
    } else {
      dispatch({ type: 'LOGOUT' })
      removeAuthToken()
      return {
        ...response,
        success: false,
        message: 'Your subscription has expired.',
        subscriptionExpired: true,
      }
    }
  } catch (e) {
    console.log(e)
    return { ...e, success: false }
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @returns If successful login, returns test user data, else returns false
 */
export const demoLogin = async (dispatch: any) => {
  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Demo', password: '123' }),
    })
    const { userData } = await res.json()

    dispatch({ type: 'SET_USER', payload: { userData } })
    return userData
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param userDispatch Dispatch function from useUserDispatch()
 */
export const logoutUser = async (userDispatch: any) => {
  userDispatch({ type: 'LOGOUT' })
  removeAuthToken()
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param username Username from create account form
 * @param password Password from create account from
 * @param email Email from Stripe checkout session
 * @returns If successful account creation, returns user data, else returns false
 */
export const assignUsernameAndPassword = async (dispatch: any, username: string, password: string, email: string) => {
  try {
    const res = await fetch('/api/users/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email }),
    })
    const response = await res.json()

    if (response.success) {
      const { userData, token } = response
      localStorage.setItem('authToken', token)
      dispatch({ type: 'SET_USER', payload: { userData } })
    }

    return response
  } catch (e) {
    console.log(e)
    return false
  }
}

export const initializeFreeAccount = async (email: string) => {
  try {
    const res = await fetch('/api/users/initialize-free-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const response = await res.json()
    return response
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 */
export const setIsUsingPWA = (dispatch: any) => {
  dispatch({ type: 'USING_PWA' })
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 */

export const setPlatformToiOS = (dispatch: any) => {
  dispatch({ type: 'USING_iOS_PWA' })
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param logValue An object with workout log data
 * @param logKey Date string (ex: 2021-07-22)
 * @returns Boolean for the success of the api call
 */
export const addDayToWorkoutLog = async (dispatch: any, user_id: string, logValue: WorkoutLogItem, logKey: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}?workoutLogKey=${logKey}&fieldToUpdate=ADD_WORKOUT_TO_WORKOUT_LOG`, {
      method: 'PUT',
      body: JSON.stringify(logValue),
      headers: { token: getHeaderToken() },
    })

    dispatch({
      type: 'ADD_DAY_TO_WORKOUT_LOG',
      payload: { key: logKey, value: logValue },
    })

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param logKey Date string (ex: 2021-07-22)
 * @returns Boolean for the success of the api call
 */
export const deleteDayFromWorkoutLog = async (dispatch: any, user_id: string, logKey: string) => {
  try {
    const res = await fetch(
      `/api/users/${user_id}?workoutLogKey=${logKey}&fieldToUpdate=DELETE_WORKOUT_FROM_WORKOUT_LOG`,
      { method: 'DELETE', headers: { token: getHeaderToken() } }
    )

    dispatch({ type: 'DELETE_DAY_FROM_WORKOUT_LOG', payload: { key: logKey } })

    return res.status === 204
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param target_id id of the user to be followed
 * @returns Boolean for the success of the api call
 */
export const addUserFollow = async (dispatch, user_id: string, target_id: string) => {
  try {
    dispatch({ type: 'ADD_ID_TO_FOLLOWING', payload: { id: target_id } })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ follow: target_id }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201) {
      dispatch({
        type: 'REMOVE_ID_FROM_FOLLOWING',
        payload: { id: target_id },
      })
    }

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param target_id id of the user to be unfollowed
 * @returns Boolean for the success of the api call
 */
export const removeUserFollow = async (dispatch, user_id: string, target_id: string) => {
  try {
    dispatch({ type: 'REMOVE_ID_FROM_FOLLOWING', payload: { id: target_id } })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ unfollow: target_id }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201) {
      dispatch({ type: 'ADD_ID_TO_FOLLOWING', payload: { id: target_id } })
    }

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param team_id Team id string
 * @returns Boolean for the success of the api call
 */
export const userJoiningTeam = async (dispatch, user_id: string, team_id: string) => {
  try {
    dispatch({ type: 'ADD_ID_TO_TEAMS_JOINED', payload: { id: team_id } })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ joinTeam: team_id }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201) {
      dispatch({
        type: 'REMOVE_ID_FROM_TEAMS_JOINED',
        payload: { id: team_id },
      })
    }

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param team_id Team id string
 * @returns Boolean for the success of the api call
 */
export const userLeavingTeam = async (dispatch, user_id: string, team_id: string) => {
  try {
    dispatch({ type: 'REMOVE_ID_FROM_TEAMS_JOINED', payload: { id: team_id } })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ leaveTeam: team_id }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201) {
      dispatch({ type: 'ADD_ID_TO_TEAMS_JOINED', payload: { id: team_id } })
    }

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param workout_id Workout id string
 * @returns Boolean for the success of the api call
 */
export const addSavedWorkout = async (dispatch, user_id: string, workout_id: string) => {
  try {
    dispatch({ type: 'ADD_ID_TO_SAVED_WORKOUTS', payload: { id: workout_id } })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ addSavedWorkout: workout_id }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201) {
      dispatch({
        type: 'REMOVE_ID_FROM_SAVED_WORKOUTS',
        payload: { id: workout_id },
      })
    }

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param workout_id Workout id string
 * @returns Boolean for the success of the api call
 */
export const removeSavedWorkout = async (dispatch, user_id: string, workout_id: string) => {
  try {
    dispatch({
      type: 'REMOVE_ID_FROM_SAVED_WORKOUTS',
      payload: { id: workout_id },
    })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ removeSavedWorkout: workout_id }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201) {
      dispatch({
        type: 'ADD_ID_TO_SAVED_WORKOUTS',
        payload: { id: workout_id },
      })
    }

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param viewed_id User if string
 * @returns Boolean for the success of api call
 */
export const addToRecentlyViewedUsers = async (dispatch, user_id: string, viewed_id: string) => {
  try {
    dispatch({
      type: 'ADD_ID_TO_RECENTLY_VIEWED_USERS',
      payload: { id: viewed_id },
    })

    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ addToRecentlyViewedUsers: viewed_id }),
      headers: { token: getHeaderToken() },
    })

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param profileImgUrl full url string for source of user img in aws s3 bucket
 * @returns Boolean for the success of api call
 */
export const saveProfileImgUrl = async (dispatch, user_id: string, profileImgUrl: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ profileImgUrl }),
      headers: { token: getHeaderToken() },
    })

    dispatch({ type: 'UPDATE_PROFILE_IMG_URL', payload: { profileImgUrl } })

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from useUserDispatch()
 * @param user_id User id string
 * @param weight any number
 * @returns Boolean for the success of the api call
 */
export const saveUserWeight = async (dispatch, user_id: string, weight: { weight: number; date: string }) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ weight }),
      headers: { token: getHeaderToken() },
    })

    dispatch({ type: 'ADD_NEW_WEIGHT', payload: { weight } })

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from userDispatch()
 * @param user_id User id string
 * @param bio String user bio
 * @returns Boolean for the success of the api call
 */
export const saveUserBio = async (dispatch, user_id: string, bio: string) => {
  try {
    const res = await fetch(`/api/users/${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ bio }),
      headers: { token: getHeaderToken() },
    })

    dispatch({ type: 'UPDATE_BIO', payload: { bio } })

    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 *
 * @param dispatch Dispatch function from userDispatch()
 * @param date Workout log date string key
 * @param logItem Workout log item value
 */
export const cacheWorkoutLogItem = (dispatch, date: string, logItem: WorkoutLogItem) => {
  dispatch({
    type: 'ADD_DAY_TO_WORKOUT_LOG',
    payload: { key: date, value: logItem },
  })
}

/**
 *
 * @param dispatch Dispatch function from userDispatch()
 * @param preferenceKey Key of the property key in user preferences
 * @param preferenceValue Boolean value for preference setting
 * @param user_id User id string
 * @returns Boolean for the success of the api call
 */
export const updateUserPreference = async (
  dispatch,
  preferenceKey: string,
  preferenceValue: boolean | string | string[],
  user_id?: string
) => {
  if (!user_id) return

  try {
    dispatch({
      type: 'UPDATE_PREFERENCE',
      payload: { key: preferenceKey, value: preferenceValue },
    })

    const res = await fetch(`/api/users/${user_id}/updatePreferences?user_id=${user_id}`, {
      method: 'PUT',
      body: JSON.stringify({ preferenceKey, preferenceValue }),
      headers: { token: getHeaderToken() },
    })

    if (res.status !== 201)
      dispatch({
        type: 'UPDATE_PREFERENCE',
        payload: { key: preferenceKey, value: !preferenceValue },
      })

    return res.status === 201
  } catch (e) {
    console.log(e)
    return false
  }
}
