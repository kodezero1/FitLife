import React, { ReactElement, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
// Context
import { Exercise, ExerciseHistory, Set, TimeSet, WeightSet } from '../../../types'
// Utils
import TimerSet from './TimerSet'
import WeightSetContainer from './WeightSet'

interface Props {
  setIndex: number
  exerciseIndex: number
  set: Set
  exerciseHistory?: ExerciseHistory | undefined
  metric: Exercise['metric']
  mode: 'builder' | 'log'
  handleWeightChange: (newWeight: number | string, exerciseIndex: number, setIndex: number) => void
  handleRepChange: (newReps: number | string, exerciseIndex: number, setIndex: number) => void
  handleTimeChange: (setData: TimeSet, exerciseIndex: any, setIndex: any) => void
  handleSetTypeChange: (type: Set['type'], exerciseIndex: number, setIndex: number) => void
  handleSetPrevious: (
    prevExerciseData: { reps: string | number; weight: string | number },
    exerciseIndex: number,
    setIndex: number
  ) => void
}

const SetContainer: React.FC<Props> = ({
  setIndex,
  exerciseIndex,
  set,
  exerciseHistory,
  metric,
  mode,
  handleWeightChange,
  handleRepChange,
  handleTimeChange,
  handleSetTypeChange,
  handleSetPrevious,
}) => {
  const dropdownRef = useRef<HTMLButtonElement>(null)

  const [showSetTypes, setShowSetTypes] = useState(false)

  const SetTypes: { title: string; type: Set['type']; icon: ReactElement }[] = [
    { title: 'Normal', type: '1', icon: <span className="normal">{setIndex + 1}</span> },
    { title: 'Warmup', type: 'W', icon: <span className="warmup">W</span> },
    { title: 'Drop', type: 'D', icon: <span className="drop">D</span> },
    { title: 'Failure', type: 'F', icon: <span className="failure">F</span> },
  ]

  const changeSetType = (type: Set['type']) => {
    handleSetTypeChange(type, exerciseIndex, setIndex)
    setShowSetTypes(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSetTypes(false)
    }

    if (showSetTypes) document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showSetTypes])

  return (
    <ContainerStyles>
      <div className="set-index">
        <button
          ref={dropdownRef}
          type="button"
          className={`dropdown-btn ${showSetTypes && 'highlight'}`}
          onClick={() => setShowSetTypes(!showSetTypes)}
        >
          {set.type ? (
            SetTypes.map(({ type, icon }, i) =>
              set.type === type ? <span key={type}>{icon}</span> : <span key={type}></span>
            )
          ) : (
            <span className="normal">{setIndex + 1}</span>
          )}
        </button>

        {showSetTypes && (
          <ul className="set-types-dropdown">
            {SetTypes.map(({ title, type, icon }) => (
              <li key={title}>
                <button onClick={() => changeSetType(type)}>
                  <span className="icon">{icon}</span> {title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="metric-wrapper">
        {metric === 'weight' && (
          <WeightSetContainer
            set={set as WeightSet}
            setIndex={setIndex}
            exerciseIndex={exerciseIndex}
            handleWeightChange={handleWeightChange}
            handleRepChange={handleRepChange}
            handleSetPrevious={handleSetPrevious}
            exerciseHistory={exerciseHistory}
            showPrevious={mode === 'log'}
          />
        )}

        {metric === 'time' && (
          <TimerSet
            set={set as TimeSet}
            setIndex={setIndex}
            exerciseIndex={exerciseIndex}
            handleTimeChange={handleTimeChange}
            showStartStop={mode === 'log'}
          />
        )}
      </div>
    </ContainerStyles>
  )
}
export default SetContainer

const ContainerStyles = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  width: 100%;
  margin: 0.5rem 0;

  .set-index {
    flex: 0.25;
    color: ${({ theme }) => theme.textLight};
    position: relative;

    .normal,
    .warmup,
    .drop,
    .failure {
      overflow: visible;
      height: 24px;
      width: 24px;
      display: grid;
      place-items: center;
      font-weight: 400;
      font-size: 0.8rem;
    }

    .dropdown-btn {
      border-radius: 3px;

      user-select: none;
      -webkit-user-select: none; /*Safari*/
      -moz-user-select: none; /*Firefox*/

      &.highlight {
        background: ${({ theme }) => theme.background};
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border};
      }
    }

    .set-types-dropdown {
      background: ${({ theme }) => theme.background};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.border};
      border-radius: 4px;
      position: absolute;
      left: calc(100% + 0.25rem);
      top: 1px;
      z-index: 2;

      button {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem 0.25rem 0.25rem;
        width: 100%;

        &:hover {
          background: ${({ theme }) => theme.medOpacity};
        }
      }
    }
  }

  .metric-wrapper {
    width: 100%;
    display: flex;
  }
`
