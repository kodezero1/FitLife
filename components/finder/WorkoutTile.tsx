import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import dayjs from 'dayjs'
// Components
import SkeletonBox from '../SkeletonBox'
// Utils
import { addExerciseDataToWorkout, timeSince } from '../../utils'
// Interfaces
import { Workout } from '../../types'
// Context
import { addSavedWorkout, removeSavedWorkout, useUserState, useUserDispatch } from '../../store'
import Bookmark from '../svg/Bookmark'

const CreatorHeight = 24
const InfoExerciseHeight = 29

interface Props {
  index: number
  isLoading: boolean
  workout: Workout
  showCreatorName?: boolean
}

const WorkoutTile: React.FC<Props> = ({ index, isLoading, workout, showCreatorName = true }) => {
  const { user } = useUserState()
  const dispatch = useUserDispatch()

  const addToSavedWorkouts = (workout: Workout) => {
    addSavedWorkout(dispatch, user!._id, workout._id)
  }

  const removeFromSavedWorkouts = (workout: Workout) => {
    removeSavedWorkout(dispatch, user!._id, workout._id)
  }

  const tile = useRef<any>()

  const [workoutExercises, setWorkoutExercises] = useState<Workout['exercises']>([])
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [closedHeight, setClosedHeight] = useState<number>()
  const [openHeight, setOpenHeight] = useState<number>()

  const toggleWorkoutInfo = () => setShowWorkoutInfo((prev) => !prev)

  // Returns boolean for if a workout is in savedWorkouts
  const workoutIsSaved = (workout: Workout) => {
    return (user?.savedWorkouts && user?.savedWorkouts?.indexOf(workout._id) > -1) || false
  }

  // Get all exercises for a workout
  const getWorkoutExercises = async () => {
    const { exercises } = await addExerciseDataToWorkout(workout)
    setWorkoutExercises(exercises)
    setLoading(false)
  }

  useEffect(() => {
    // Only fetch data if it has not already been fetched
    if (showWorkoutInfo && !workoutExercises.length) {
      setLoading(true)
      getWorkoutExercises()
    }
  }, [showWorkoutInfo])

  useEffect(() => {
    if (loading) return

    if (!closedHeight) {
      setClosedHeight(tile.current.clientHeight)
    }

    if (!!workoutExercises.length && showWorkoutInfo && !openHeight) {
      setOpenHeight(tile.current.clientHeight + workoutExercises.length * InfoExerciseHeight + CreatorHeight)
    }
  }, [tile, showWorkoutInfo, loading])

  return (
    <Container
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggleWorkoutInfo()}
      ref={tile}
      style={showWorkoutInfo && openHeight ? { height: openHeight } : { height: closedHeight }}
      className="button-press finder-item"
      onDoubleClick={() => (workoutIsSaved(workout) ? removeFromSavedWorkouts(workout) : addToSavedWorkouts(workout))}
    >
      <TitleBar>
        {isLoading ? (
          <div className="name">
            <SkeletonBox style={{ width: '55%', animationDelay: (index + 1) / 20 + 's' }} />

            <p>
              <SkeletonBox style={{ width: '40%', animationDelay: (index + 1) / 20 + 's' }} />
            </p>
          </div>
        ) : (
          <>
            <div className="name" onClick={toggleWorkoutInfo}>
              <h3>{workout.name}</h3>

              <p className="log-count">
                Logged {workout.numLogged} {workout.numLogged === 1 ? 'time' : 'times'}
              </p>
            </div>
            {workout._id && (
              <div className="buttons">
                {workoutIsSaved(workout) ? (
                  <button className="heart saved" onClick={() => removeFromSavedWorkouts(workout)}>
                    <Bookmark filled={true} />
                  </button>
                ) : (
                  <button className="heart not-saved" onClick={() => addToSavedWorkouts(workout)}>
                    <Bookmark />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </TitleBar>

      {showWorkoutInfo && !loading && openHeight && (
        <WorkoutInfo>
          <div className="info-header">
            <p className="created-by">
              {showCreatorName && (
                <>
                  by
                  <Link href={`users/${workout.creatorName}`} className="creator">
                    {workout.creatorName}
                  </Link>
                  -
                </>
              )}{' '}
              {dayjs(workout.date_created).format('MMM D, YYYY')}
            </p>

            <span className="sets-header">Sets</span>
          </div>

          {workoutExercises.map(({ sets, exercise_id, exercise }) => (
            <li key={exercise_id} className="exercise">
              {exercise && (
                <>
                  <p>{exercise.name}</p>
                  <p className="sets">{sets.length}</p>
                </>
              )}
            </li>
          ))}
        </WorkoutInfo>
      )}
    </Container>
  )
}
export default WorkoutTile

const Container = styled.div`
  border-radius: 5px;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-out;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  .name {
    text-align: left;
    flex: 3;

    h3 {
      font-weight: 400;
      font-size: 1.05rem;
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }

    .workout-meta {
      display: flex;
      justify-content: space-between;
    }
    .log-count {
      font-size: 0.65rem;
      letter-spacing: 0.05em;
      color: ${({ theme }) => theme.textLight};
      margin: 0.1rem 0;
    }
  }
  .loadingSpinner {
    margin-right: 0;
    height: 20px;
    width: 20px;
  }
  .buttons {
    width: min-content;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    button {
      &:active {
        box-shadow: none !important;
      }
    }

    .heart {
      cursor: pointer;
      border-radius: 5px;
      border: none;
      margin-left: 0.5rem;
      background: transparent;
      transition: all 0.25s ease;
    }

    .not-saved {
      color: ${({ theme }) => theme.border};
    }
    .saved {
      color: ${({ theme }) => theme.accent};
    }
  }
`

const WorkoutInfo = styled.ul`
  text-align: left;
  transform-origin: top;
  -webkit-animation: open 0.5s ease forwards;
  animation: open 0.5s ease forwards;

  .info-header {
    height: ${CreatorHeight}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    color: ${({ theme }) => theme.textLight};

    .creator {
      font-size: 1.05em;
      margin: 0 3px;

      &:hover {
        color: ${({ theme }) => theme.text};
      }
    }

    .sets-header {
    }
  }

  .exercise {
    font-weight: 300;
    font-size: 0.9rem;
    line-height: 1rem;
    height: ${InfoExerciseHeight}px;
    display: flex;
    align-items: center;
    text-transform: capitalize;
    display: flex;
    justify-content: space-between;

    .sets {
      min-width: max-content;
      font-size: 0.75rem;
      min-width: 25px;
      text-align: center;

      span {
        text-transform: lowercase;
        font-size: 0.7rem;
      }
    }
  }

  @keyframes open {
    0% {
      opacity: 0;
      transform: rotate3d(1, 0, 0, 45deg);
    }
    100% {
      opacity: 1;
      transform: rotate3d(0);
    }
  }
`
