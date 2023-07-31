import React, { useMemo } from 'react'
import styled from 'styled-components'

import { weightSetsAreComplete } from '../../../utils'
import { WeightSet, ExerciseHistory, WorkoutLogItem } from '../../../types'

type Props = {
  set: WeightSet
  setIndex: number
  exerciseIndex: number
  exerciseHistory?: ExerciseHistory | undefined
  showPrevious: boolean
  handleWeightChange: (
    newWeight: number | string,
    exerciseIndex: number,
    setIndex: number,
    defaultLogItem?: WorkoutLogItem
  ) => void
  handleRepChange: (newReps: number | string, exerciseIndex: number, setIndex: number) => void
  handleSetPrevious: (
    prevExerciseData: { reps: string | number; weight: string | number },
    exerciseIndex: number,
    setIndex: number
  ) => void
}

const WeightSetContainer: React.FC<Props> = ({
  set,
  exerciseIndex,
  setIndex,
  exerciseHistory,
  showPrevious,
  handleRepChange,
  handleWeightChange,
  handleSetPrevious,
}) => {
  const prevExerciseData = useMemo(() => {
    if (!exerciseHistory) return null

    const history = exerciseHistory as { sets: WeightSet[]; date: string }[]
    // Find the first exercise that has all its sets completed
    const first = history.find(({ sets }) => weightSetsAreComplete(sets))

    const prev = first || history[0]
    if (!prev) return null

    const prevReps = prev.sets[setIndex]?.reps
    const prevWeight = prev.sets[setIndex]?.weight

    return prevReps >= 0 && prevWeight >= 0 ? { reps: prevReps, weight: prevWeight } : null
  }, [])

  return (
    <Container>
      <InputContainer className="reps">
        <input
          aria-label={`Reps for set number ${setIndex} of exercise number ${exerciseIndex}`}
          type="number"
          inputMode="decimal"
          value={set.reps >= 0 ? set.reps : ''}
          onChange={(e) => handleRepChange(e.target.value, exerciseIndex, setIndex)}
          onFocus={(e) => e.target.select()}
        />
      </InputContainer>

      <XSymbol className="x-symbol">✕</XSymbol>

      <InputContainer className="weight">
        <input
          aria-label={`Weight for set number ${setIndex} of exercise number ${exerciseIndex}`}
          type="number"
          inputMode="decimal"
          value={set.weight >= 0 ? set.weight : ''}
          onChange={(e) => handleWeightChange(e.target.value, exerciseIndex, setIndex)}
          onFocus={(e) => e.target.select()}
        />
      </InputContainer>

      {showPrevious && (
        <Previous
          type="button"
          onClick={prevExerciseData ? () => handleSetPrevious(prevExerciseData, exerciseIndex, setIndex) : () => {}}
        >
          {prevExerciseData ? (
            <span className="prev">{prevExerciseData.reps + '×' + prevExerciseData.weight}</span>
          ) : (
            <span className="none">None</span>
          )}
        </Previous>
      )}
    </Container>
  )
}

export default WeightSetContainer

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1;
`

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  input {
    text-align: center;
    box-shadow: none;
    border: 1px solid transparent;
    border-bottom: 1px solid ${({ theme }) => theme.accent};
    border-radius: 0;
    width: 5rem;
    font-size: 1.5rem;
    font-weight: 400;
    background: inherit;
    color: inherit;
    transition: all 0.25s ease;

    /* Chrome, Safari, Edge, Opera */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type='number'] {
      -moz-appearance: textfield;
    }

    &:focus {
      border: 1px solid ${({ theme }) => theme.accent};
      border-radius: 3px;
      outline: none;
    }
    &::-moz-selection,
    &::-webkit-selection,
    &::selection {
      color: ${({ theme }) => theme.accent};
      background: ${({ theme }) => theme.background};
      text-shadow: none;
    }
  }
`

const XSymbol = styled.span`
  flex: 0;
  display: block;
  color: ${({ theme }) => theme.border};

  user-select: none;
  -webkit-user-select: none; /*Safari*/
  -moz-user-select: none; /*Firefox*/
`

const Previous = styled.button`
  flex: 0.25;
  display: flex;
  justify-content: center;
  align-items: flex-end;

  user-select: none;
  -webkit-user-select: none; /*Safari*/
  -moz-user-select: none; /*Firefox*/

  font-weight: 300;
  font-size: 0.7rem;
  display: grid;
  place-items: center;
  border-radius: 3px;
  height: 100%;

  .prev {
    color: ${({ theme }) => theme.textLight};
  }
  .none {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.8em;
  }
`
