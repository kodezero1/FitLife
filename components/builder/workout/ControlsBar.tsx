import dayjs from 'dayjs'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'

import { useCreateWorkout, useUpdateWorkout } from '../../../api-lib/controllers'
import { useUserState } from '../../../store'
import { Workout } from '../../../types'
import { getMuscleGroupsOfWorkout } from '../../../utils'
import Checkmark from '../../Checkmark'
import Lock from '../../svg/Lock'

interface Props {
  customWorkout: Workout
  setCustomWorkout: Dispatch<SetStateAction<Workout>>
  clearCustomWorkout: () => void
}

const ControlsBar: React.FC<Props> = ({ customWorkout, setCustomWorkout, clearCustomWorkout }) => {
  const { user } = useUserState()
  const queryClient = useQueryClient()

  const [showSaveNotification, setShowSaveNotification] = useState(false)

  const onSaveSuccess = () => {
    setShowSaveNotification(false)
    setShowSaveNotification(true)
    clearCustomWorkout()
  }

  const { mutate: updateWorkout, isLoading: isUpdatingWorkout } = useUpdateWorkout(queryClient, {
    onSuccess: onSaveSuccess,
  })
  const { mutate: createWorkout, isLoading: isCreatingWorkout } = useCreateWorkout(queryClient, {
    onSuccess: onSaveSuccess,
  })

  const saveCustomWorkout = async () => {
    if (!user) return

    // Add muscle groups and remove exercise data
    const muscleGroups = getMuscleGroupsOfWorkout(customWorkout)
    const { exercises } = customWorkout
    const composedExercises = exercises.map(({ exercise, ...omitExercise }) => omitExercise)

    const composedWorkout: Workout = {
      ...customWorkout,
      exercises: composedExercises,
      muscleGroups,
    }

    if (composedWorkout.creator_id === user._id) {
      // Workout owner is editing existing workout
      updateWorkout({ workout: composedWorkout })
    } else {
      // User is saving their version of a saved workout or building a new workout
      composedWorkout.name = composedWorkout.name || 'New Workout'
      // Set creator_id to user's _id
      composedWorkout.creator_id = user._id
      // Set creatorName to user's username
      composedWorkout.creatorName = user.username
      // Only allow admins to save public workouts
      if (!user.isAdmin) composedWorkout.isPublic = false
      // Remove any existing _id
      const { _id, ...workout } = composedWorkout
      // Add date created
      workout.date_created = dayjs().toISOString()

      createWorkout({ workout })
    }
  }

  // Handles changes for custom workout name
  const handleWorkoutNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWorkout((prev) => {
      return { ...prev, name: e.target.value }
    })
  }

  // Handles changes for custom workout privacy
  const handlePrivacyChange = () => {
    setCustomWorkout((prev) => {
      return { ...prev, isPublic: !prev.isPublic }
    })
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showSaveNotification) timeout = setTimeout(() => setShowSaveNotification(false), 2000)
    return () => clearTimeout(timeout)
  }, [showSaveNotification])

  return (
    <BuilderControlBarStyles className="tile">
      <div className="input-wrapper">
        <label htmlFor="workoutName">Workout Name</label>
        <input type="text" name="workoutName" value={customWorkout.name} onChange={handleWorkoutNameChange} />

        <button
          className={`public-checkbox ${!user?.isAdmin && 'disabled'}`}
          onClick={user?.isAdmin ? handlePrivacyChange : () => {}}
          disabled={!user?.isAdmin}
        >
          <label htmlFor="public">Public</label>
          {user?.isAdmin ? (
            <input
              type="checkbox"
              name="public"
              checked={customWorkout.isPublic}
              readOnly={true}
              disabled={!user?.isAdmin}
            />
          ) : (
            <Lock />
          )}
        </button>
      </div>

      <BuilderControlButtons>
        <button
          onClick={saveCustomWorkout}
          disabled={!Boolean(customWorkout.exercises.length) || isUpdatingWorkout || isCreatingWorkout}
        >
          {showSaveNotification && !Boolean(customWorkout.exercises.length) ? (
            <Checkmark styles={{ height: '1.75rem', width: '1.75rem' }} />
          ) : (
            'Save Workout'
          )}
        </button>

        <button
          onClick={clearCustomWorkout}
          disabled={
            (!Boolean(customWorkout.name.length) && !Boolean(customWorkout.exercises.length)) ||
            isUpdatingWorkout ||
            isCreatingWorkout
          }
        >
          Clear All
        </button>
      </BuilderControlButtons>
    </BuilderControlBarStyles>
  )
}

export default ControlsBar

export const BuilderControlBarStyles = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem 1px 1px;

  .input-wrapper {
    padding: 0 0.5rem 0.5rem;
    border-radius: 5px;
    width: 100%;
    position: relative;

    label {
      float: left;
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
      margin-right: 0.25rem;
    }

    input[type='text'] {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      font-size: 1.25rem;
      border-radius: 0;
      color: ${({ theme }) => theme.text};
      background: inherit;
      border: none;
      border-bottom: 1px solid ${({ theme }) => theme.border};
      appearance: none;

      &:focus {
        outline: none;
        border-bottom: 1px solid ${({ theme }) => theme.accent};
      }
    }

    .public-checkbox {
      position: absolute;
      top: -0.15rem;
      right: 0.5rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.text};
      display: inline-block;
      min-width: max-content;
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      border: none;

      &.disabled {
        color: ${({ theme }) => theme.textLight};
        background: ${({ theme }) => theme.medOpacity};
      }

      input[type='checkbox'] {
        /* Add if not using autoprefixer */
        -webkit-appearance: none;
        /* Remove most all native input styles */
        appearance: none;
        /* For iOS < 15 */
        background-color: transparent;
        /* Not removed via appearance */
        margin: 0;
        font: inherit;
        color: currentColor;
        width: 1.15em;
        height: 1.15em;
        border: 0.15em solid ${({ theme }) => theme.textLight};
        border-radius: 3px;
        transform: translateY(-0.075em);
        display: grid;
        place-content: center;
      }

      input[type='checkbox']::before {
        content: '';
        width: 0.65em;
        height: 0.65em;
        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
        transform: scale(0);
        transform-origin: bottom left;
        transition: 120ms transform ease-in-out;
        box-shadow: inset 1em 1em ${({ theme }) => theme.text};
        background-color: ${({ theme }) => theme.text};
      }

      input[type='checkbox']:checked::before {
        transform: scale(1);
      }
    }
  }
`

export const BuilderControlButtons = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
  gap: 1px;

  button {
    flex: 1;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.text};

    display: inline-block;
    padding: 0;
    min-height: 45px;
    font-size: 0.9rem;
    font-weight: 400;
    transition: all 0.25s ease;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    &:first-child {
      border-radius: 0 0 0 5px;
      border-right: 1px solid ${({ theme }) => theme.border};
    }
    &:last-child {
      border-radius: 0 0 5px 0;
    }
    &:disabled {
      background: transparent;
      color: ${({ theme }) => theme.border};
    }
  }
`
