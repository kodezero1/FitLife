import React from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
// Utils
import { getUserByUsername, getUserTeams } from '../../api-lib/controllers'
// Context
import { useUserState } from '../../store'
// Components
import SeoHead from '../../components/SeoHead'
import NameTile from '../../components/userProfile/NameTile'
import Bio from '../../components/userProfile/Bio'
import TeamsTile from '../../components/userProfile/TeamsTile'
import WorkoutTileList from '../../components/userProfile/WorkoutTileList'
import LoadingBricks from '../../components/Shared/LoadingBricks'
import { getSortedWorkoutLogDateArray } from '../../utils'
import { User, Workout } from '../../types'
import WeightTile from "../../components/settingsPage/WeightTile"

const Username: React.FC = () => {
  const router = useRouter()
  const username = router.query.username as string
  const { user } = useUserState()

  const isProfileOwner = user?.username === username

  const { data: profile = isProfileOwner ? user : null, isLoading } = getUserByUsername(username)
  // const { data: createdWorkouts = [] } = getUserMadeWorkouts(profile || undefined)
  const { data: teamsJoined = [] } = getUserTeams(profile || undefined)

  const getUserRecentWorkouts = (user?: User): Workout[] => {
    if (!user) return []

    const workoutCountMap = {}

    return getSortedWorkoutLogDateArray(user.workoutLog || {})
      .map((date) => {
        const d = user.workoutLog[date]

        const workoutCount = workoutCountMap[d.workoutName]
        workoutCountMap[d.workoutName] = workoutCount ? workoutCount + 1 : 1

        return {
          name: d.workoutName || '',
          date,
          exercises: d.exerciseData,
          _id: d.workout_id || '',
          creatorName: user.username,
          isPublic: true,
          numLogged: workoutCountMap[d.workoutName],
          creator_id: '',
          muscleGroups: [],
          date_created: date,
        }
      })
      .reverse()
  }
  const recentWorkouts = getUserRecentWorkouts(profile || undefined)

  return (
    <Container>
      {!isLoading && profile && user ? (
        <>
          <SeoHead title={`${profile.username} - FitLife`} />

          <NameTile profile={profile} isProfileOwner={isProfileOwner} />

          <div className="inner-container">
            {profile.preferences?.showProfileBio && <Bio profile={profile} isProfileOwner={isProfileOwner} />}

            {Boolean(profile.teamsJoined?.length) && (
              <TeamsTile profileTeamsJoined={teamsJoined} profile_id={profile._id} />
            )}

            {/* {Boolean(createdWorkouts.length) && (
              <WorkoutTileList
                workouts={createdWorkouts.filter((workout) => workout.isPublic)}
                listTitle={'Created Workouts'}
              />
            )} */}
            <WeightTile/>
            <p className="box">
          <span className="small-text">Workouts </span>
          <span className="stat large-text">{Object.keys(profile.workoutLog).length}</span>
        </p>
            <WorkoutTileList workouts={recentWorkouts} listTitle={'Recent Workouts'} />
          </div>
        </>
      ) : (
        <div className="loadingContainer">
          <LoadingBricks />
        </div>
      )}
      
    </Container>
  )
}
export default Username

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  .inner-container {
    margin-bottom: 1rem;
    width: 100%;
    border-radius: 0 0 10px 10px;
    background: ${({ theme }) => theme.background};
  }

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 0.9rem;
  }

  .loadingContainer {
    height: 80vh;
    display: grid;
    place-items: center;
  }
`
