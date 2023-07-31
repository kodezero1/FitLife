import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useQuery } from 'react-query'
// Components
import DateScroll from '../components/workoutLog/DateScroll'
const LogItem = dynamic(import('../components/workoutLog/logItem'))
import QuickStart from '../components/workoutLog/QuickStart'
// Utils
import { formatWorkoutLogDate, getRecentUserWorkouts, initWorkoutLogItem, isTrue } from '../utils'
// Context
import { cacheWorkoutLogItem, useUserDispatch, useUserState } from '../store'
// Interfaces
import { Workout, WorkoutLogItem, Exercise } from '../types'
import markdownToHtml from '../api-lib/articles/markdownToHtml'
// Articles
import { ArticleType, getPostBySlug } from '../api-lib/articles'
import { getSavedWorkouts, getUserMadeWorkouts } from '../api-lib/controllers'
import { getExercisesFromIdArray } from '../api-lib/fetchers'
import LoadingBricks from '../components/Shared/LoadingBricks'

export async function getServerSideProps() {
  const post = getPostBySlug('workout-log-guide')
  const content = await markdownToHtml(post.content || '')
  return { props: { logGuide: content as ArticleType['content'] } }
}

interface Props {
  pageProps: { logGuide: ArticleType['content'] }
}

export default function Log({ pageProps }: Props) {
  const router = useRouter()

  const { user } = useUserState()
  const dispatch = useUserDispatch()

  const [selectedDate, setSelectedDate] = useState('')
  const [currentWorkoutLogItem, setCurrentWorkoutLogItem] = useState<WorkoutLogItem>()

  const recent = getRecentUserWorkouts(user)
  const { data: created } = getUserMadeWorkouts(user)
  const { data: saved } = getSavedWorkouts(user)

  const quickStartWorkouts = {
    created: created || [],
    recent: recent || [],
    saved: saved || [],
  }

  const addExercisesToCurrentLogItem = (
    data: Exercise[] = workoutExercises || [],
    logItem = currentWorkoutLogItem,
    cacheLogItem = true
  ) => {
    if (!logItem) return
    // Merge exercises into exerciseData
    const logItemWithExercises = {
      ...logItem,
      exerciseData: logItem.exerciseData.map((exData, i) => ({
        ...exData,
        exercise: data[i],
      })),
    }
    // Set state
    setCurrentWorkoutLogItem(logItemWithExercises)
    // Cache log item
    if (cacheLogItem) cacheWorkoutLogItem(dispatch, selectedDate, logItemWithExercises)
  }

  // Query workout exercises every time selected date changes
  const { data: workoutExercises } = useQuery(
    ['workout-exercises', selectedDate],
    () => getExercisesFromIdArray(currentWorkoutLogItem?.exerciseData.map((each) => each.exercise_id) || []),
    {
      // Enabled if there is log item, but it's missing exercise data
      enabled: Boolean(currentWorkoutLogItem) && !currentWorkoutLogItem?.exerciseData.every((ex) => ex.exercise),
      onSuccess: addExercisesToCurrentLogItem,
    }
  )

  const displayOnTheFlyWorkout = () => {
    const newLogItem = initWorkoutLogItem()
    setCurrentWorkoutLogItem(newLogItem)
  }

  const displayPremadeWorkout = async (workout: Workout) => {
    const newLogItem = {
      ...initWorkoutLogItem(),
      exerciseData: workout.exercises,
      workout_id: workout._id,
      workoutName: workout.name,
      workout: workout,
    }
    const exercises = await getExercisesFromIdArray(workout.exercises.map((each) => each.exercise_id) || [])
    addExercisesToCurrentLogItem(exercises, newLogItem, false)
  }

  const copyPreviousLogItem = (date: string) => {
    if (!user) return
    const updatedLogItem = { ...user.workoutLog[date] }
    setCurrentWorkoutLogItem(updatedLogItem)
  }

  const changeLogToDate = (date: string) => {
    setSelectedDate(date)
    const logItem = user?.workoutLog[date]
    setCurrentWorkoutLogItem(logItem)
  }

  useEffect(() => {
    if (user)
      changeLogToDate(router.query.date ? formatWorkoutLogDate(router.query.date.toString()) : formatWorkoutLogDate())
  }, [user?._id, router.query.date])

  return (
    <MainContainer>
      {isTrue(user?.preferences?.showDateBarInLog) && (
        <DateScroll changeLogToDate={changeLogToDate} selectedDate={selectedDate} />
      )}

      {!user && !currentWorkoutLogItem && (
        <div className="loadingContainer">
          <LoadingBricks />
        </div>
      )}

      {selectedDate && user && (
        <>
          {!user.workoutLog[selectedDate] && !currentWorkoutLogItem && (
            <QuickStart
              displayOnTheFlyWorkout={displayOnTheFlyWorkout}
              displayPremadeWorkout={displayPremadeWorkout}
              displayWorkoutLogItem={setCurrentWorkoutLogItem}
              copyPreviousLogItem={copyPreviousLogItem}
              quickStartWorkouts={quickStartWorkouts}
              selectedDate={selectedDate}
            />
          )}

          {currentWorkoutLogItem && (
            <LogItem
              selectedDate={selectedDate}
              changeLogToDate={changeLogToDate}
              currentWorkoutLogItem={currentWorkoutLogItem}
              setCurrentWorkoutLogItem={setCurrentWorkoutLogItem}
              logGuide={pageProps.logGuide}
            />
          )}
        </>
      )}
    </MainContainer>
  )
}

const MainContainer = styled.section`
  min-height: 30vh;
  width: 100%;
  padding: 0 0.5rem 1rem;

  .loadingContainer {
    height: 80vh;
    display: grid;
    place-items: center;
  }
`
