import dayjs from 'dayjs'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import VirtualList from '../../Shared/VirtualList'
import { useUserState } from '../../../store'
import { WorkoutLogItem } from '../../../types'
import { getRecentUserWorkouts } from '../../../utils'

type Props = {
  updateWorkoutName: (newName: string) => void
  currentWorkoutLogItem: WorkoutLogItem
  copyPreviousLogItem: (date: string) => void
  selectedDate: string
}

const WorkoutName = ({ updateWorkoutName, currentWorkoutLogItem, copyPreviousLogItem, selectedDate }: Props) => {
  const { user } = useUserState()

  const textInput = useRef<HTMLInputElement>(null)

  const [editingName, setEditingName] = useState<boolean>(currentWorkoutLogItem.workoutName === '')
  const [nameValue, setNameValue] = useState(currentWorkoutLogItem.workoutName)

  useEffect(() => {
    setNameValue(currentWorkoutLogItem.workoutName)
  }, [selectedDate, currentWorkoutLogItem.workoutName, setNameValue])

  if (!editingName)
    return (
      <Container listHeight={0}>
        <h3 onClick={() => setEditingName(true)}>{currentWorkoutLogItem.workoutName}</h3>
      </Container>
    )

  const handleNameChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setNameValue(target.value)
  }

  const handleNameClick = (workout: { workoutName: string; date: string }) => {
    copyPreviousLogItem(workout.date)
    setEditingName(false)
    setNameValue(workout.workoutName || '')
  }

  const handleXClick = () => {
    setNameValue('')
  }

  const handleInputBlur = () => {
    if (nameValue === '') textInput.current?.focus()
    else {
      setEditingName(false)
      currentWorkoutLogItem.workoutName === nameValue
        ? setNameValue(currentWorkoutLogItem.workoutName)
        : updateWorkoutName(nameValue)
    }
  }

  const pastWorkoutNames = getRecentUserWorkouts(user).filter(
    (w) =>
      !dayjs(w.date).isSame(selectedDate, 'day') && w.workoutName.toLowerCase().includes(nameValue.toLocaleLowerCase())
  )

  const ListItemHeight = 50
  const ListHeight = Math.min(pastWorkoutNames.length * ListItemHeight, 250)

  return (
    <Container listHeight={ListHeight}>
      <div className={`editing-wrap ${pastWorkoutNames.length && 'expand'}`}>
        <div className="input-wrap">
          <input
            ref={textInput}
            type="text"
            name="Workout Name"
            value={nameValue}
            onChange={handleNameChange}
            onBlur={handleInputBlur}
            role="presentation"
            autoComplete="off"
            autoFocus
          />
          <button
            id="x-button"
            tabIndex={0}
            type="button"
            onMouseDownCapture={handleXClick}
            className={`clear-input ${nameValue && 'highlight'}`}
          >
            ✕
          </button>
        </div>
        {Boolean(pastWorkoutNames.length) && (
          <ul className="past-workout-name__list">
            <VirtualList
              numItems={pastWorkoutNames.length}
              itemHeight={ListItemHeight}
              windowHeight={ListHeight}
              renderItem={({ index, style }) => (
                <li key={`past-workout-name__${pastWorkoutNames[index].date}`} style={style}>
                  <button type="button" onMouseDown={() => handleNameClick(pastWorkoutNames[index])}>
                    {pastWorkoutNames[index].workoutName}{' '}
                    <span className="past-workout-name__date">
                      {dayjs(pastWorkoutNames[index].date).format('MMM DD, YY')}
                    </span>
                  </button>
                </li>
              )}
            />
          </ul>
        )}
      </div>
    </Container>
  )
}

export default WorkoutName

const Container = styled.div<{ listHeight: number }>`
  width: 100%;
  margin: 1rem 0 0.25rem;
  padding: 0.25rem 0;
  text-align: left;
  background: transparent;

  h3 {
    border: 2px solid ${({ theme }) => theme.backgroundNoGrad};
    margin-left: 0.5rem;
    font-size: 1.75em;
    font-weight: 400;
    animation: fadeIn 0.5s;
    min-height: 48px;
  }

  .editing-wrap {
    position: relative;
    border: 1px solid ${({ theme }) => theme.border};
    box-shadow: 0 3px 10px 1px ${({ theme }) => theme.boxShadow};
    border-radius: 6px;
    z-index: 1;

    .input-wrap {
      position: relative;
      z-index: 3;

      input[name='Workout Name'] {
        width: calc(100% + 2px);
        max-width: calc(100% + 2px);
        margin-left: -1px;
        margin-top: -1px;
        margin-bottom: -1px;
        background: inherit;
        font-size: 1.75rem;
        color: inherit;
        padding-top: 1px;
        padding-bottom: 2px;
        padding-left: calc(0.5rem + 1px);
        padding-right: 2rem;
        outline: none;
        border: 1px solid ${({ theme }) => theme.accent};
        border-radius: 5px;
      }

      .clear-input {
        padding: 0.5rem 0.75rem;
        position: absolute;
        top: 50%;
        right: 0;
        border-radius: 5px;
        transform: translateY(-50%);
        color: ${({ theme }) => theme.background};
        pointer-events: none;
        opacity: 0;

        &.highlight {
          pointer-events: all;
          opacity: 1;
        }
      }
    }

    .past-workout-name__list {
      position: relative;
      overflow: hidden;
      background: ${({ theme }) => theme.background};
      z-index: 2;
      height: 0;

      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      li {
        height: 50px;

        button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          width: 100%;
          padding: 0 0.5rem;
          border-bottom: 1px solid ${({ theme }) => theme.buttonMed};

          .past-workout-name__date {
            font-size: 0.8rem;
            color: ${({ theme }) => theme.textLight};
          }
        }
        &:last-child button {
          border-bottom: none;
        }
      }
    }

    &.expand {
      margin-bottom: -${(props) => props.listHeight}px;

      .past-workout-name__list {
        height: ${(props) => props.listHeight}px;
      }
    }
  }
`
