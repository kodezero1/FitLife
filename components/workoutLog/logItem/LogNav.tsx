import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useUserState } from '../../../store'
import { getSortedWorkoutLogDateArray } from '../../../utils'

import LogGuide from './LogGuide'
import { Exercise, WorkoutLogItem } from '../../../types'

import LeftArrow from '../../svg/LeftArrow'
import RightArrow from '../../svg/RightArrow'

// import LogSettings from './LogSettings'
import BodyDiagram from './BodyDiagram'
// import ReportBugBtn from './ReportBugBtn'

type Props = {
  selectedDate: string
  logGuide: string
  changeLogToDate: (date: string) => void
  currentWorkoutLogItem: WorkoutLogItem
  resetAllSets: () => void
  resetAllWeights: () => void
  deleteWorkout: () => Promise<void>
  muscleGroups: [Exercise['muscleGroup'], { count: number; exerciseIds: string[] }][]
  saveWorkout: () => Promise<void>
}

const LogNav = ({
  selectedDate,
  changeLogToDate,
  logGuide,
  currentWorkoutLogItem,
  resetAllSets,
  resetAllWeights,
  deleteWorkout,
  muscleGroups,
  saveWorkout,
}: Props) => {
  const { user } = useUserState()

  const sortedDateArr = useMemo(() => getSortedWorkoutLogDateArray(user!.workoutLog), [user?.workoutLog.size])

  const dateIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    sortedDateArr.forEach((date, i) => map.set(date, i))
    return map
  }, [selectedDate])

  const currDateIndexInLog = dateIndexMap.get(selectedDate) || sortedDateArr.length

  const getPreviousWorkout = () => {
    const newDate = sortedDateArr[Math.max(0, currDateIndexInLog - 1)]
    changeLogToDate(newDate)
  }

  const getNextWorkout = () => {
    const newDate =
      currDateIndexInLog === dateIndexMap.size - 1
        ? sortedDateArr[currDateIndexInLog]
        : sortedDateArr[currDateIndexInLog + 1]
    changeLogToDate(newDate)
  }

  return (
    <Container>
      <button
        className="nav-btn left-arrow"
        onClick={getPreviousWorkout}
        disabled={currDateIndexInLog === 0}
        aria-label="Go to previous workout"
      >
        <LeftArrow />
      </button>

      <LogGuide logGuide={logGuide} />

{/*       <ReportBugBtn /> */}

      <div className="spacer" />

      {/* <LogSettings
        currentWorkoutLogItem={currentWorkoutLogItem}
        resetAllSets={resetAllSets}
        resetAllWeights={resetAllWeights}
        deleteWorkout={deleteWorkout}
        saveWorkout={saveWorkout}
      /> */}

      <BodyDiagram selectedMuscleGroups={muscleGroups} />

      <button
        className="nav-btn right-arrow"
        onClick={getNextWorkout}
        aria-label="Go to next workout"
        disabled={currDateIndexInLog === dateIndexMap.size - 1}
      >
        <RightArrow />
      </button>
    </Container>
  )
}

export default LogNav

const Container = styled.ul`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.25rem;

  .spacer {
    flex: 1;
  }

  .nav-btn {
    background: ${({ theme }) => theme.darkBg};
    color: ${({ theme }) => theme.textLight};
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 5px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:disabled {
      color: ${({ theme }) => theme.border};
    }
  }
  .small-btn {
    padding: 0.5rem;
    min-width: 40px;
  }
`
