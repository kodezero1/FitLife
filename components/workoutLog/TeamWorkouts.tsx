import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useUserState } from '../../store'
// API
import { getTeamsFromIdArray, getWorkoutFromId, getWorkoutsFromIdArray } from '../../api-lib/fetchers'
// Interfaces
import { Team, Workout } from '../../types'
// Utils
import { areTheSameDate } from '../../utils'
// Components
import TiledList from '../Shared/TiledList'

interface Props {
  searchTerm?: string
  selectedDate: string
  displayPremadeWorkout: (clicked: Workout) => void
}

const TeamWorkouts: React.FC<Props> = ({ selectedDate, displayPremadeWorkout }) => {
  const { user } = useUserState()

  const [teamsJoined, setTeamsJoined] = useState<Team[] | null>(null)
  const [todaysWorkouts, setTodaysWorkouts] = useState<
    { teamName: Team['teamName']; currWorkout: Workout | null }[] | null
  >(null)

  useEffect(() => {
    if (!teamsJoined) return

    const getTodaysWorkouts = async () => {
      const data = await Promise.all(
        teamsJoined.map(async (team) => {
          const plan = team.routine?.workoutPlan
          let currWorkout: Workout | undefined
          let workouts: Workout[] = []

          if (plan) {
            const day = plan.find((day) => areTheSameDate(day.isoDate, selectedDate))
            if (day) {
              const currWorkoutId = plan.map((day) => day.workout_id).find((w_id) => w_id == day.workout_id)
              if (currWorkoutId) currWorkout = (await getWorkoutFromId(currWorkoutId)) || undefined
            }
          }
          return {
            teamName: team.teamName,
            currWorkout: currWorkout || null,
          }
        })
      )
      setTodaysWorkouts(data)
    }
    getTodaysWorkouts()
  }, [teamsJoined, selectedDate])

  useEffect(() => {
    // If user is in a team, get its routine workout
    if (user && user.teamsJoined) {
      const loadTeamRoutines = async () => {
        const teams = await getTeamsFromIdArray(user.teamsJoined!)
        if (teams.length) setTeamsJoined(teams)
      }

      loadTeamRoutines()
    }
  }, [user?.teamsJoined])

  return (
    <>
      {teamsJoined && (
        <TeamsList>
          <h3 className="section-title">Teams</h3>

          <ul>
            {todaysWorkouts?.map(({ teamName, currWorkout }) => (
              <JoinedTeam key={teamName} className={currWorkout ? 'has-workout' : ''}>
                <p className="team-name">{teamName}</p>

                {/* <hr /> */}

                {currWorkout?.name ? (
                  <p className="workout-name">
                    Today is{' '}
                    <button type="button" className="button-press" onClick={() => displayPremadeWorkout(currWorkout)}>
                      {currWorkout.name}
                    </button>
                  </p>
                ) : (
                  <p className="workout-name">No workout set</p>
                )}
              </JoinedTeam>
            ))}
          </ul>
        </TeamsList>
      )}
    </>
  )
}

export default TeamWorkouts

const TeamsList = styled.div`
  width: 100%;
  margin: 0.5rem 0 1rem;
`

const JoinedTeam = styled.li`
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border};
  margin: 0 0.25rem 0.75rem;
  padding: 0.5rem;
  border-radius: 5px;
  text-align: left;
  color: ${({ theme }) => theme.textLight};
  transition: all 0.2s ease;

  .team-name {
    padding: 0.25rem;
    font-size: 1.1rem;
    font-weight: 300;
  }

  .workout-name {
    font-weight: 300;
    letter-spacing: 1px;
    padding: 0.25rem;
    word-wrap: break-word;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      transition: opacity 0.25s ease-in-out;
      background: ${({ theme }) => theme.buttonMedGradient};
      box-shadow: 0 0 0 1px ${({ theme }) => theme.border}, 0 1px 3px ${({ theme }) => theme.boxShadow};
      border-radius: 4px;
      cursor: pointer;
      padding: 0.3rem 0.5rem;
      text-align: left;
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      font-weight: 400;
      position: relative;
      overflow: hidden;
      animation: fadeIn 0.3s forwards;
    }
  }

  &.has-workout {
    /* background: ${({ theme }) => theme.lowOpacity}; */
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.text};
  }
`

const WorkoutsList = styled.div`
  margin-bottom: 0.5rem;

  ul {
    padding: 0.25rem 0;
  }
`
