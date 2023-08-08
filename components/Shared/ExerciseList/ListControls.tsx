import React from 'react'
import styled, { css } from 'styled-components'
import { useUserState } from '../../../store'
import { Exercise } from '../../../types'

import TextInput from '../TextInput'

import Weight from '../../svg/Weight'
import Timer from '../../svg/Timer'
// import Distance from '../../svg/Distance'
import { ListOptionsType } from './ExerciseList'

type Props = {
  handleSearchTermChange: (term: string) => void
  shownList: ListOptionsType
  setShownList: React.Dispatch<React.SetStateAction<ListOptionsType>>
  metricFilter: '' | 'weight' | 'time' | 'distance'
  setMetricFilter: React.Dispatch<React.SetStateAction<'' | 'weight' | 'time' | 'distance'>>
  muscleGroupFilter: Exercise['muscleGroup']
  setMuscleGroupFilter: React.Dispatch<React.SetStateAction<Exercise['muscleGroup']>>
  setShowCreateExerciseModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ExerciseMetrics: { metric: Exercise['metric']; icon: JSX.Element }[] = [
  { metric: 'weight', icon: <Weight /> },
  { metric: 'time', icon: <Timer /> },
  // { metric: 'distance', icon: <Distance /> },
]

const ListControls = ({
  handleSearchTermChange,
  shownList,
  setShownList,
  setMetricFilter,
  metricFilter,

  setShowCreateExerciseModal,
}: Props) => {
  const { user } = useUserState()

  const ListOptions: ListOptionsType[] = user?.isAdmin
    ? ['All Exercises', 'My Exercises', 'In Review']
    : ['All Exercises', 'My Exercises']

  return (
    <div className="exercise-list-controls">
      {/* <ListOptionsContainer
        xPos={(100 / ListOptions.length) * ListOptions.indexOf(shownList)}
        width={100 / ListOptions.length}
      >
        {ListOptions.map((option) => (
          <p key={option} onClick={() => setShownList(option)} className={shownList === option ? 'selected' : ''}>
            {option}
          </p>
        ))}
      </ListOptionsContainer> */}

      <TextInput
        onChange={(term) => handleSearchTermChange(term)}
        inputName={'Search Term'}
        placeholder={'Search an exercise or muscle'}
      />

      <Filters>
        <div className="types">
          {ExerciseMetrics.map(({ metric, icon }) => (
            <button
              key={metric}
              type="button"
              onClick={() => setMetricFilter((prev) => (prev === metric ? '' : metric))}
              className={metricFilter === metric ? 'active' : ''}
            >
              {metric} {icon}
            </button>
          ))}
          <button className="add-exercise-button" onClick={() => setShowCreateExerciseModal(true)}>
            Create Exercise
          </button>
        </div>
      </Filters>
    </div>
  )
}

export default ListControls

const ListOptionsContainer = styled.div<{ xPos: number; width: number }>`
  display: flex;
  justify-content: space-around;
  height: fit-content;
  margin: 0.5rem 0.25rem 0.5rem;
  position: relative;

  p {
    cursor: pointer;
    flex: 1;
    padding: 0.4rem 0;
    font-weight: 400;
    font-size: 0.8rem;
    text-transform: capitalize;
    color: ${({ theme }) => theme.textLight};
    transition: all 0.2s ease;

    &.selected {
      color: ${({ theme }) => theme.text};
    }
  }

  ${({ xPos, width }) => css`
    &::after {
      pointer-events: none;
      transition: all 0.2s ease;
      content: '';
      left: ${xPos}%;
      position: absolute;
      height: 100%;
      width: ${width}%;
      border-radius: 5px;
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.accent};
    }
  `}
`

const Filters = styled.div`
  margin-top: 0.25rem;

  .types {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0.35rem;
    padding: 0.25rem 0.25rem 0;

    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }
  }

  button {
    flex: 1;
    font-size: 0.75rem;
    background: ${({ theme }) => theme.buttonMedGradient};
    max-height: fit-content;
    color: ${({ theme }) => theme.textLight};
    border-radius: 5px;
    text-transform: capitalize;
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.medOpacity};
    transition: all 0.25s ease;
    cursor: pointer;
    min-width: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem 0;
    font-weight: 500;

    span {
      font-size: 1.3rem;
      line-height: 1rem;
      margin-left: 0.25rem;
    }

    svg {
      margin-left: 0.25rem;
      height: 14px;
    }

    &.active {
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.text};
    }
  }

  .add-exercise-button {
    background: ${({ theme }) => theme.accent} !important;
    color: ${({ theme }) => theme.accentText} !important;
    box-shadow: none;
  }
`
