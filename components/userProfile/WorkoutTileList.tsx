import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Workout } from '../../types'
import WorkoutTile from '../finder/WorkoutTile'

interface Props {
  workouts: Workout[]
  listTitle: string
}

const WorkoutTileList: React.FC<Props> = ({ workouts, listTitle }) => {
  return (
    <Container>
      <div className="topbar">
        <h3 className="title">{listTitle}</h3>

        <Link href="/builder?builder=workout">+</Link>
      </div>

      <WorkoutsList>
        {Boolean(workouts?.length) ? (
          workouts.map((workout: Workout, i) => (
            <WorkoutTile
              index={i}
              isLoading={false}
              workout={workout}
              showCreatorName={false}
              key={listTitle + '_' + workout._id + '_' + i}
            />
          ))
        ) : (
          <p className="noWorkouts">None</p>
        )}
      </WorkoutsList>
    </Container>
  )
}

export default WorkoutTileList

const Container = styled.section`
  position: relative;
  width: 100%;
  padding: 0.5rem;

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 5px;
      margin-bottom: 0.5rem;
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.lowOpacity};
      font-size: 0.9rem;
      line-height: 0.9rem;
    }
  }
`

const WorkoutsList = styled.div`
  & > div {
    background: transparent;
    background: ${({ theme }) => theme.darkBg};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.border};
    margin-bottom: 0.5rem;
  }
  .noWorkouts {
    line-height: 1.2rem;
    font-size: 0.9rem;
    padding: 0.25rem;
    font-weight: 300;
  }
`
