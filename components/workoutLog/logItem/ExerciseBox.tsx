import React, { useRef } from 'react'
import styled from 'styled-components'
import update from 'immutability-helper'
import { Draggable } from '@hello-pangea/dnd'
import { useSwipeable } from 'react-swipeable'
import composeRefs from '@seznam/compose-react-refs'

import { Set, Exercise, WorkoutLogItem, ExerciseHistory } from '../../../types'
import SkeletonBox from '../../SkeletonBox'
import SetContainer from './Set'
import Stats from '../../svg/Stats'
import { TimeSet, WeightSet, DistanceSet } from '../../../utils/classes/sets'
import useLongPress from '../../hooks/useLongPress'
import { compressExercise, parseExercise } from '../../../utils'
import { updateUserPreference, useUserDispatch, useUserState } from '../../../store'

interface Props {
  selectedDate: string
  exerciseData: WorkoutLogItem['exerciseData'][0]
  exerciseIndex: number
  exerciseHistory: ExerciseHistory | undefined
  showChartButton: boolean
  setExerciseInfo: React.Dispatch<React.SetStateAction<Exercise | undefined>>
  removeExercise: (exercise_id: string) => void
  currentWorkoutLogItem: WorkoutLogItem
  debounceSave: (updatedLogItem: WorkoutLogItem, time?: number) => void
}

const LeftSwipeWidth = 200
const RightSwipeWidth = 100
const LeftSwipeDelta = 15
const RightSwipeDelta = 15
const LongPressDelayMS = 700

const DefaultSetPresets = ['w/10-10-10', 'w/12-10-8', 'w/12-10-10', 'w/12-10-10-8', 't/30m', 't/60m']

const ExerciseBox: React.FC<Props> = ({
  selectedDate,
  exerciseData,
  exerciseIndex,
  exerciseHistory,
  showChartButton,
  setExerciseInfo,
  removeExercise,
  currentWorkoutLogItem,
  debounceSave,
}) => {
  const { exercise, exercise_id, metric, sets } = exerciseData

  // Set Presets
  const { user } = useUserState()
  const userDispatch = useUserDispatch()

  const setPresets = user?.preferences?.setPresets || DefaultSetPresets

  const updatePreference = (key: string, value: string[]) => {
    updateUserPreference(userDispatch, key, value, user?._id)
  }

  const onPresetClick = (e: any) => parseDefaultExerciseData(e.target.dataset.set, exerciseIndex)
  const onPresetLongPress = (e: any) => {
    const updatedPresets = update(setPresets, {
      [e.target.dataset.presetIndex]: { $set: compressExercise(exerciseData) },
    })
    updatePreference('setPresets', updatedPresets)
  }
  const longPressEvent = useLongPress(onPresetLongPress, onPresetClick, {
    delay: LongPressDelayMS,
  })

  // Swipe Functionality
  const boxPos = useRef(0)
  const exerciseElem = useRef<HTMLDivElement | null>(null)
  const swipeContainer = useRef<HTMLDivElement | null>(null)

  const refPassthrough = (el: HTMLDivElement) => {
    swipeHandlers.ref(el)
    swipeContainer.current = el
  }

  const moveExerciseToPosition = (pos: number) => {
    boxPos.current = pos
    const newPos = pos + 'px'
    if (swipeContainer.current) swipeContainer.current.style.transform = `translateX(${newPos})`
  }

  const onSwipedLeft = () => {
    const newPos = boxPos.current === 0 ? -RightSwipeWidth : 0
    moveExerciseToPosition(newPos)
  }

  const onSwipedRight = () => {
    const newPos = boxPos.current === 0 ? LeftSwipeWidth : 0
    moveExerciseToPosition(newPos)
  }

  const swipeHandlers = useSwipeable({
    delta: { left: LeftSwipeDelta, right: RightSwipeDelta },
    trackMouse: true,
    trackTouch: true,
    onSwipedLeft,
    onSwipedRight,
  })

  const handleRepChange = (newReps: number | string, exerciseIndex: number, setIndex: number) => {
    const value = newReps === '' ? -1 : Number(newReps) - 0

    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: { [exerciseIndex]: { sets: { [setIndex]: { reps: { $set: value } } } } },
    })

    debounceSave(updatedLogItem, 1000)
  }

  const handleWeightChange = (newWeight: number | string, exerciseIndex: number, setIndex: number) => {
    const value = newWeight === '' ? -1 : Number(newWeight) - 0

    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: { [exerciseIndex]: { sets: { [setIndex]: { weight: { $set: value } } } } },
    })

    debounceSave(updatedLogItem, 1000)
  }

  const handleSetPrevious = (
    prevExerciseData: { reps: string | number; weight: string | number },
    exerciseIndex: number,
    setIndex: number
  ) => {
    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: {
        [exerciseIndex]: {
          sets: {
            [setIndex]: { weight: { $set: prevExerciseData.weight }, reps: { $set: prevExerciseData.reps } },
          },
        },
      },
    })
    debounceSave(updatedLogItem, 1000)
  }

  const handleTimeChange = (setData: TimeSet, exerciseIndex: number, setIndex: number) => {
    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: {
        [exerciseIndex]: {
          sets: {
            [setIndex]: {
              duration: { $set: setData.duration },
              ongoing: { $set: setData.ongoing },
              startedAt: { $set: setData.startedAt },
            },
          },
        },
      },
    })

    debounceSave(updatedLogItem, 1000)
  }

  const handleSetTypeChange = (type: Set['type'], exerciseIndex: number, setIndex: number) => {
    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: {
        [exerciseIndex]: {
          sets: {
            [setIndex]: { type: { $set: type } },
          },
        },
      },
    })

    debounceSave(updatedLogItem, 1000)
  }

  const handleSetLengthChange = (method: 'add' | 'remove', exerciseIndex: number, metric: Exercise['metric']) => {
    let updatedLogItem: WorkoutLogItem = currentWorkoutLogItem

    const exerciseSetsLength = currentWorkoutLogItem.exerciseData[exerciseIndex].sets.length

    switch (method) {
      case 'add':
        if (exerciseSetsLength >= 100) break

        const previousSet = currentWorkoutLogItem.exerciseData[exerciseIndex].sets[exerciseSetsLength - 1]
        let newSet: Set

        switch (metric) {
          case 'weight':
            newSet = new WeightSet(previousSet as WeightSet)
            break
          case 'time':
            newSet = new TimeSet()
            break
          case 'distance':
            newSet = new DistanceSet(previousSet as DistanceSet)
            break
        }

        // Add empty set to spedified exercise
        updatedLogItem = update(currentWorkoutLogItem, {
          exerciseData: { [exerciseIndex]: { sets: { $push: [newSet] } } },
        })
        break
      case 'remove':
        if (exerciseSetsLength === 1) break
        // Remove last set from spedified exercise
        updatedLogItem = update(currentWorkoutLogItem, {
          exerciseData: {
            [exerciseIndex]: {
              sets: { $splice: [[exerciseSetsLength - 1, 1]] },
            },
          },
        })
        break
      default:
        break
    }

    debounceSave(updatedLogItem, 1000)
  }

  const parseDefaultExerciseData = (exerciseData: string, exerciseIndex: number) => {
    const { sets, metric } = parseExercise(exerciseData)

    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: { [exerciseIndex]: { sets: { $set: sets }, metric: { $set: metric } } },
    })

    debounceSave(updatedLogItem, 1000)
  }

  return (
    <Draggable
      key={exercise_id + '_' + selectedDate + '_draggable'}
      draggableId={exercise_id + '_' + selectedDate}
      index={exerciseIndex}
    >
      {(provided, snapshot) => (
        <SwipeWrapper
          className="ExerciseBox"
          key={exercise_id + '_' + selectedDate + '_swipe-wrapper'}
          data-key={exercise_id}
          {...swipeHandlers}
          ref={composeRefs(provided.innerRef, refPassthrough) as React.RefObject<HTMLDivElement>}
          {...provided.draggableProps}
        >
          <LeftHideContainer>
            <span className="left-hide-title">Set Presets</span>
            <div className="left-hide-grid">
              {setPresets.map((set, i) => (
                <DefaultSet
                  key={i + '_' + set + '_' + exerciseIndex}
                  type="button"
                  data-set={set}
                  data-preset-index={i}
                  style={{ fontSize: set.length > 12 ? '.5rem' : '.7rem' }}
                  {...longPressEvent}
                >
                  {set.split('/')[1]}
                </DefaultSet>
              ))}
              {setPresets.length % 2 === 1 && (
                <DefaultSet key={'Filler Default Set'} type="button" style={{ fontSize: '1rem', lineHeight: 0 }}>
                  +
                </DefaultSet>
              )}
            </div>
          </LeftHideContainer>

          <CenterContainer ref={exerciseElem} className={`${snapshot.isDragging && 'dragging'}`} id={exercise_id}>
            <Header>
              <div className="exercise-name-wrap">
                <span className="exercise-name" {...provided.dragHandleProps}>
                  {exercise?.name ? (
                    <span>{exercise.name}</span>
                  ) : (
                    <SkeletonBox style={{ width: '70%', height: '1.75rem' }} />
                  )}
                </span>

                {showChartButton && (
                  <button
                    className="info-icon button-press"
                    aria-label="View Exercise Chart"
                    onClick={() => setExerciseInfo(exercise!)}
                    type="button"
                  >
                    <Stats height={20} width={20} />
                  </button>
                )}
              </div>

              <div className="set-ctrl">
                <button type="button" onClick={() => handleSetLengthChange('remove', exerciseIndex, metric)}>
                  —
                </button>

                <button type="button" onClick={() => handleSetLengthChange('add', exerciseIndex, metric)}>
                  ＋
                </button>
              </div>
            </Header>

            <div className="sets-list">
              {metric === 'weight' && (
                <div className="set-title">
                  <p style={{ flex: 0.15 }} />
                  <p style={{ flex: 1.25 }}>Reps</p>
                  <p style={{ flex: 1.25 }}>Weight</p>
                  <p style={{ flex: 0.25 }}>Prev</p>
                </div>
              )}

              {sets.map((set, j) => (
                <SetContainer
                  key={`${exercise_id}_${j}_${selectedDate}`}
                  set={set}
                  metric={metric}
                  setIndex={j}
                  exerciseIndex={exerciseIndex}
                  mode="log"
                  handleWeightChange={handleWeightChange}
                  handleRepChange={handleRepChange}
                  handleTimeChange={handleTimeChange}
                  handleSetTypeChange={handleSetTypeChange}
                  handleSetPrevious={handleSetPrevious}
                  exerciseHistory={exerciseHistory}
                />
              ))}
            </div>
          </CenterContainer>

          <RightHideContainer>
            <DeleteBtn type="button" onClick={() => removeExercise(exercise_id)}>
              Remove
            </DeleteBtn>
          </RightHideContainer>
        </SwipeWrapper>
      )}
    </Draggable>
  )
}

export default ExerciseBox

const SwipeWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  display: flex;
  align-items: start;
  margin: 1rem 0;
  padding-top: 0.5rem;
  opacity: 1;

  transition: transform 0.2s ease;
`

const CenterContainer = styled.div`
  min-width: 100%;
  display: block;
  margin-left: 0;
  touch-action: pan-y;

  .sets-list {
    background: ${({ theme }) => theme.darkBg};
    border-radius: 5px 0 5px 5px;
    min-width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem;
    transition: all 0.2s ease;

    .set-title {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.6rem;
      display: flex;
      text-transform: uppercase;
      text-align: center;

      user-select: none;
      -webkit-user-select: none; /*Safari*/
      -moz-user-select: none; /*Firefox*/
    }
  }

  &.dragging .sets-list,
  &.dragging .set-ctrl button,
  &.dragging .timer-sets {
    background: ${({ theme }) => theme.buttonMed};
  }
`

const Header = styled.div`
  padding: 0.5rem 0 0.5rem 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .exercise-name-wrap {
    display: flex;
    align-items: center;
    width: 100%;

    .exercise-name {
      flex: 1;
      text-align: left;

      span {
        text-transform: capitalize;
        font-weight: 300;
        font-size: 1.2rem;
        letter-spacing: 1px;
        animation: fadeIn 0.5s;
      }
    }
    .info-icon {
      display: grid;
      place-items: center;
      height: 22px;
      width: 22px;
      color: ${({ theme }) => theme.textLight};
      border-radius: 3px;
      margin: 0 0.5rem;
      animation: fadeIn 0.5s;

      user-select: none;
      -webkit-user-select: none; /*Safari*/
      -moz-user-select: none; /*Firefox*/
    }
  }

  .set-ctrl {
    min-width: max-content;
    display: flex;
    align-items: center;
    margin-bottom: -0.5rem;
    position: relative;
    align-self: flex-end;

    button {
      cursor: pointer;
      border: none;
      background: ${({ theme }) => theme.darkBg};
      color: ${({ theme }) => theme.textLight};
      font-size: 1.4rem;
      font-weight: 300;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2.5rem;
      width: 3rem;
      border-radius: 5px 5px 0 0;
      transition: all 0.2s ease;

      user-select: none;
      -webkit-user-select: none; /*Safari*/
      -moz-user-select: none; /*Firefox*/

      &:last-child {
        margin-left: 0.25rem;
      }
    }

    &::before {
      content: 'Set';
      position: absolute;
      top: -1.25rem;
      left: 0;
      right: 0;
      font-size: 0.8rem;
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
    }
  }
`

const LeftHideContainer = styled.div`
  min-width: calc(${LeftSwipeWidth}px - 0.25rem);
  max-width: calc(${LeftSwipeWidth}px - 0.25rem);

  margin-top: 12px;
  padding: 0.5rem 0.15rem 0.15rem;

  border-radius: 5px;
  position: absolute;
  right: 100%;
  margin-right: 0.25rem;
  transition: transform 0.2s ease;
  background: ${({ theme }) => theme.darkBg};

  .left-hide-title {
    font-size: 0.65rem;
    line-height: 1.3rem;
    color: ${({ theme }) => theme.textLight};
    display: block;
    margin-bottom: 0.5rem;
  }

  .left-hide-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-content: flex-start;
    border: 1px solid ${({ theme }) => theme.backgroundNoGrad};
    background: ${({ theme }) => theme.background};
    gap: 1px;
    overflow: hidden;
    border-radius: 3px;
  }
`

const RightHideContainer = styled.div`
  min-width: calc(${RightSwipeWidth}px - 0.25rem);
  max-width: calc(${RightSwipeWidth}px - 0.25rem);

  margin-top: 3rem;
  margin-left: 0.25rem;
`

const DefaultSet = styled.button`
  display: block;
  padding: 0.75rem 0;
  width: 100%;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.darkBg};
  line-height: 1;
`

const DeleteBtn = styled.button`
  display: block;
  width: 100%;
  height: 45px;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ theme }) => theme.darkBg};
  color: ${({ theme }) => theme.textLight};
  font-size: 0.8rem;
`
