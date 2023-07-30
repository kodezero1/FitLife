import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import update from 'immutability-helper'
import dynamic from 'next/dynamic'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
// Context
import { useUserDispatch, useUserState, addDayToWorkoutLog, deleteDayFromWorkoutLog } from '../../../store'
// Utils
import {
  groupWorkoutLogByExercise,
  dateCompare,
  moveItemInArray,
  isTrue,
  getMuscleGroupsOfWorkoutLogItem,
} from '../../../utils'
// Interfaces
import { Exercise, WorkoutLog, WorkoutLogItem } from '../../../types'
import { ArticleType } from '../../../api-lib/articles'
import { DistanceSet, TimeSet, WeightSet } from '../../../utils/classes/sets'
// Components
const ExerciseInfoModal = dynamic(import('./ExerciseInfoModal'))
import SaveNotification from './SaveNotification'
import ExerciseBox from './ExerciseBox'
import ExerciseList from '../../Shared/ExerciseList/ExerciseList'
import WorkoutNotesHistory from './WorkoutNotesHistory'
import LogNav from './LogNav'
import WorkoutName from './WorkoutName'
// Icons
import MuscleGroupIcons from './MuscleGroupIcons'
import NotesHistory from '../../svg/NotesHistory'
import AddExerciseBtn from '../../Shared/AddExerciseBtn'

interface Props {
  changeLogToDate: (date: string) => void
  currentWorkoutLogItem: WorkoutLogItem
  setCurrentWorkoutLogItem: React.Dispatch<React.SetStateAction<WorkoutLogItem | undefined>>
  selectedDate: string
  logGuide: ArticleType['content']
}

const LogItem: React.FC<Props> = ({
  changeLogToDate,
  currentWorkoutLogItem,
  setCurrentWorkoutLogItem,
  selectedDate,
  logGuide,
}) => {
  const { user } = useUserState()
  const dispatch = useUserDispatch()

  const muscleGroups = getMuscleGroupsOfWorkoutLogItem(currentWorkoutLogItem)
  const exerciseMap = useMemo(
    () => groupWorkoutLogByExercise(user?.workoutLog || ({} as WorkoutLog)),
    [user?.workoutLog]
  )

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)

  const [exerciseInfo, setExerciseInfo] = useState<Exercise>()
  const [isExerciseListOpen, setIsExerciseListOpen] = useState(false)
  const [showWorkoutNotesHistory, setShowWorkoutNotesHistory] = useState(false)

  const deleteWorkout = async () => {
    if (!currentWorkoutLogItem || !user) return
    // If user never saved the workout
    if (!user.workoutLog[selectedDate]) return setCurrentWorkoutLogItem(undefined)

    const deleted = await deleteDayFromWorkoutLog(dispatch, user._id, selectedDate)
    if (deleted) setCurrentWorkoutLogItem(undefined)
  }

  const handleDragDropEnd = (result: any) => {
    const startIndex: number = result.source?.index
    const endIndex: number = result.destination?.index > -1 ? result.destination.index : startIndex
    if (startIndex === endIndex) return

    const updatedLogItem = {
      ...currentWorkoutLogItem,
      exerciseData: moveItemInArray(currentWorkoutLogItem.exerciseData, startIndex, endIndex),
    }
    debounceSave(updatedLogItem, 0)
  }

  const addExercise = (exercise: Exercise) => {
    let newExercise: WorkoutLogItem['exerciseData'][0]

    switch (exercise.metric) {
      case 'weight':
        newExercise = {
          exercise,
          metric: exercise.metric,
          exercise_id: exercise._id,
          sets: [new WeightSet()],
        }
        break
      case 'time':
        newExercise = {
          exercise,
          metric: exercise.metric,
          exercise_id: exercise._id,
          sets: [new TimeSet()],
        }
        break
      case 'distance':
        newExercise = {
          exercise,
          metric: exercise.metric,
          exercise_id: exercise._id,
          sets: [new DistanceSet()],
        }
        break
    }

    const updatedLogItem = {
      ...currentWorkoutLogItem,
      exerciseData: [...currentWorkoutLogItem.exerciseData, newExercise],
    }
    debounceSave(updatedLogItem)
  }

  const removeExercise = (exercise_id: string) => {
    const elem = document.querySelector<HTMLElement>(`[data-key="${exercise_id}"]`)
    const animDurMs = 200
    if (elem) {
      elem.style.height = elem.clientHeight + 'px'
      setTimeout(() => {
        elem.style.transition = `all ${animDurMs}ms ease`
        elem.style.height = 0 + 'px'
        elem.style.padding = 0 + 'px'
        elem.style.margin = 0 + 'px'
        elem.style.opacity = '0'
      }, 0)
    }

    setTimeout(() => {
      const updatedLogItem = {
        ...currentWorkoutLogItem,
        exerciseData: [...currentWorkoutLogItem.exerciseData.filter((each) => each.exercise_id !== exercise_id)],
      }
      debounceSave(updatedLogItem)
    }, animDurMs)
  }

  const updateWorkoutName = (newName: string) => {
    const updatedLogItem = {
      ...currentWorkoutLogItem,
      workoutName: newName,
    }
    debounceSave(updatedLogItem)
  }

  const handleWorkoutNoteChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedLogItem = {
      ...currentWorkoutLogItem,
      workoutNote: target.value,
    }
    debounceSave(updatedLogItem)
  }

  const resetAllSets = () => {
    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: {
        $apply: (exerciseData) =>
          exerciseData.map((exercise) =>
            update(exercise, {
              sets: {
                $apply: (sets) => {
                  return sets.map((set) => {
                    if (exercise.metric === 'weight') return update(set, { $set: new WeightSet() })
                    if (exercise.metric === 'time') return update(set, { $set: new TimeSet() })
                    if (exercise.metric === 'distance') return update(set, { $set: new DistanceSet() })
                  })
                },
              },
            })
          ),
      },
    })

    debounceSave(updatedLogItem)
  }

  const resetAllWeights = () => {
    const updatedLogItem = update(currentWorkoutLogItem, {
      exerciseData: {
        $apply: (exerciseData) =>
          exerciseData.map((exercise) =>
            update(exercise, {
              sets: {
                $apply: (sets) => {
                  return sets.map((set) => {
                    if (exercise.metric === 'weight') return update(set, { $set: { ...set, weight: -1 } })
                    else return set
                  })
                },
              },
            })
          ),
      },
    })

    debounceSave(updatedLogItem)
  }

  const copyPreviousLogItem = (date: string) => {
    if (!user) return
    const updatedLogItem = { ...user.workoutLog[date] }
    setCurrentWorkoutLogItem(updatedLogItem)
    debounceSave(updatedLogItem)
  }

  // Posts currentDayData to DB
  const saveWorkoutLogItem = async (workoutLogItem: WorkoutLogItem) => {
    if (!user) return
    setSaveLoading(true)

    const { workout, ...rest } = workoutLogItem
    const saved = await addDayToWorkoutLog(dispatch, user._id, rest, selectedDate)

    setSaveSuccess(false) // Re-trigger save animation
    setSaveSuccess(saved)
    setSaveLoading(false)
  }

  // Core saving function for all log item changes
  const debounceSave = (updatedLogItem: WorkoutLogItem, time: number = 2000) => {
    setCurrentWorkoutLogItem(updatedLogItem)
    if (saveTimeout) clearTimeout(saveTimeout)
    setSaveTimeout(setTimeout(() => saveWorkoutLogItem(updatedLogItem), time))
  }

  // Remove Saved notification after 3 seconds
  useEffect(() => {
    let resetTimeout: NodeJS.Timeout
    if (saveSuccess) resetTimeout = setTimeout(() => setSaveSuccess(null), 3000)
    return () => clearTimeout(resetTimeout)
  }, [saveSuccess])

  return (
    <Container>
      <LogNav
        selectedDate={selectedDate}
        changeLogToDate={changeLogToDate}
        logGuide={logGuide}
        currentWorkoutLogItem={currentWorkoutLogItem}
        resetAllSets={resetAllSets}
        resetAllWeights={resetAllWeights}
        deleteWorkout={deleteWorkout}
        muscleGroups={muscleGroups}
        saveWorkout={() => saveWorkoutLogItem(currentWorkoutLogItem)}
      />

      <WorkoutName
        updateWorkoutName={updateWorkoutName}
        currentWorkoutLogItem={currentWorkoutLogItem}
        copyPreviousLogItem={copyPreviousLogItem}
        selectedDate={selectedDate}
      />

      {isTrue(user?.preferences?.showMuscleIconsInLog) && Boolean(currentWorkoutLogItem.exerciseData.length) && (
        <MuscleGroupIcons muscleGroups={muscleGroups} />
      )}

      <WorkoutForm>
        <DragDropContext onDragEnd={handleDragDropEnd}>
          <Droppable droppableId="workout" direction="vertical">
            {(provided) => (
              <WorkoutList {...provided.droppableProps} ref={provided.innerRef}>
                {currentWorkoutLogItem.exerciseData.map((exerciseData, i) => (
                  <ExerciseBox
                    key={exerciseData.exercise_id + '_' + selectedDate}
                    selectedDate={selectedDate}
                    exerciseData={exerciseData}
                    exerciseIndex={i}
                    removeExercise={removeExercise}
                    setExerciseInfo={setExerciseInfo}
                    showChartButton={isTrue(user?.preferences?.showExerciseChartsInLog)}
                    currentWorkoutLogItem={currentWorkoutLogItem}
                    debounceSave={debounceSave}
                    exerciseHistory={exerciseMap
                      .get(exerciseData.exercise_id)
                      ?.filter(({ date }) => dateCompare(date, selectedDate))}
                  />
                ))}
                {provided.placeholder}
              </WorkoutList>
            )}
          </Droppable>
        </DragDropContext>

        <AddExerciseBtn onClick={() => setIsExerciseListOpen((prev) => !prev)} />

        <WorkoutNote>
          <div className="notes-header">
            <h4>Notes</h4>
            <button type="button" onClick={() => setShowWorkoutNotesHistory(true)}>
              <NotesHistory />
            </button>
          </div>

          <textarea
            key={'workoutNote'}
            name={'workoutNote'}
            rows={4}
            value={currentWorkoutLogItem.workoutNote}
            onChange={handleWorkoutNoteChange}
          />
        </WorkoutNote>
      </WorkoutForm>

      <ExerciseList
        onExerciseSelect={addExercise}
        onExerciseDeselect={(exercise) => removeExercise(exercise._id)}
        isOpen={isExerciseListOpen}
        setIsOpen={setIsExerciseListOpen}
        isExerciseSelected={(exercise) =>
          currentWorkoutLogItem.exerciseData.some((elem) => elem.exercise_id === exercise._id)
        }
      />

      {(saveSuccess || saveLoading) && <SaveNotification saveLoading={saveLoading} />}

      {exerciseInfo && <ExerciseInfoModal exerciseInfo={exerciseInfo} setExerciseInfo={setExerciseInfo} />}

      {showWorkoutNotesHistory && (
        <WorkoutNotesHistory
          showWorkoutNotesHistory={showWorkoutNotesHistory}
          setShowWorkoutNotesHistory={setShowWorkoutNotesHistory}
        />
      )}
    </Container>
  )
}

export default LogItem

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 0.25rem;
  margin: 0.25rem 0;
  overflow: hidden;
`

const WorkoutForm = styled.form`
  width: 100%;
`

const WorkoutList = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const WorkoutNote = styled.div`
  width: 100%;
  margin: 1rem auto 0;
  border-radius: 10px;

  .notes-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.2rem;

    h4 {
      text-align: left;
      font-weight: 300;
      margin-left: 0.25rem;
    }
    button {
      border-radius: 5px;
      height: 24px;
      padding: 2px 4px;
      color: ${({ theme }) => theme.textLight};
    }
  }
  textarea {
    display: block;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.medOpacity};
    width: 100%;
    max-width: unset;
    max-height: unset;
    height: max-content;
    font-size: 1.1rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.1s ease-in-out;
    color: inherit;
    background: ${({ theme }) => theme.darkBg};

    &:focus {
      border: 1px solid ${({ theme }) => theme.accent};
      outline: none;
    }
  }
`
