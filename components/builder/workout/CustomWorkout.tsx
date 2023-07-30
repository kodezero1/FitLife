import styled from 'styled-components'
import { Droppable } from '@hello-pangea/dnd'
import update from 'immutability-helper'
// Interfaces
import { TimeSet, WeightSet, DistanceSet } from '../../../utils/classes/sets'
import { Workout, Set } from '../../../types'
// Components
import CustomWorkoutExercise from './CustomWorkoutExercise'
import { formatSetRepsAndWeight } from '../../../utils'

interface Props {
  customWorkout: Workout
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>
  removeExercise: (exercise_id: string) => void
}

const CustomWorkout: React.FC<Props> = ({ customWorkout, setCustomWorkout, removeExercise }) => {
  const handleRepChange = (newReps: string | number, exerciseIndex: number, setIndex: number) => {
    setCustomWorkout(
      update(customWorkout, {
        exercises: { [exerciseIndex]: { sets: { [setIndex]: { reps: { $set: formatSetRepsAndWeight(newReps) } } } } },
      })
    )
  }

  const handleWeightChange = (newWeight: number | string, exerciseIndex: number, setIndex: number) => {
    setCustomWorkout(
      update(customWorkout, {
        exercises: {
          [exerciseIndex]: { sets: { [setIndex]: { weight: { $set: formatSetRepsAndWeight(newWeight) } } } },
        },
      })
    )
  }

  const handleTimeChange = (setData: TimeSet, exerciseIndex: any, setIndex: any) => {
    setCustomWorkout(
      update(customWorkout, {
        exercises: { [exerciseIndex]: { sets: { [setIndex]: { $set: setData } } } },
      })
    )
  }

  const handleSetChange = (method: 'add' | 'remove', exerciseIndex: number) => {
    const exerciseSetsLength = customWorkout.exercises[exerciseIndex].sets.length

    switch (method) {
      case 'add':
        if (exerciseSetsLength >= 100) break

        const previousSet = customWorkout.exercises[exerciseIndex].sets[exerciseSetsLength - 1]
        let newSet: Set

        switch (customWorkout.exercises[exerciseIndex].metric) {
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

        setCustomWorkout(
          update(customWorkout, {
            exercises: { [exerciseIndex]: { sets: { $push: [newSet] } } },
          })
        )
        break
      case 'remove':
        if (exerciseSetsLength === 1) break
        setCustomWorkout(
          update(customWorkout, {
            exercises: { [exerciseIndex]: { sets: { $splice: [[exerciseSetsLength - 1, 1]] } } },
          })
        )
        break
      default:
        break
    }
  }

  return (
    <>
      {!!customWorkout.exercises.length && (
        <Droppable droppableId={'workout'}>
          {(provided) => (
            <CustomWorkoutList {...provided.droppableProps} ref={provided.innerRef}>
              {customWorkout.exercises.map(
                ({ exercise, sets }, i) =>
                  exercise && (
                    <CustomWorkoutExercise
                      key={exercise._id}
                      exerciseIndex={i}
                      sets={sets}
                      exercise={exercise}
                      handleSetChange={handleSetChange}
                      handleRepChange={handleRepChange}
                      handleWeightChange={handleWeightChange}
                      handleTimeChange={handleTimeChange}
                      removeExercise={removeExercise}
                    />
                  )
              )}
              {provided.placeholder}
            </CustomWorkoutList>
          )}
        </Droppable>
      )}
    </>
  )
}
export default CustomWorkout

const CustomWorkoutList = styled.ul`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  gap: 1rem;

  background: ${({ theme }) => theme.background};
  padding: 0.25rem;
  border-radius: 5px;
`
