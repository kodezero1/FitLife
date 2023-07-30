import styled from 'styled-components'
import { Draggable } from '@hello-pangea/dnd'
// Interfaces
import { Exercise, Set, TimeSet } from '../../../types'
// Icons
import Garbage from '../../svg/Garbage'
import SetContainer from '../../workoutLog/logItem/Set'

interface Props {
  exerciseIndex: number
  sets: Set[]
  exercise: Exercise
  handleSetChange: (method: 'add' | 'remove', exerciseIndex: number) => void
  handleRepChange: (newRep: number | string, exerciseIndex: number, setIndex: number) => void
  handleWeightChange: (newWeight: number | string, exerciseIndex: number, setIndex: number) => void
  handleTimeChange: (setData: TimeSet, exerciseIndex: any, setIndex: any) => void
  removeExercise: (exercise_id: string) => void
}

const CustomWorkoutExercise: React.FC<Props> = ({
  exerciseIndex,
  sets,
  exercise,
  handleSetChange,
  handleRepChange,
  handleWeightChange,
  handleTimeChange,
  removeExercise,
}) => {
  return (
    <Draggable draggableId={exercise._id} index={exerciseIndex}>
      {(provided, snapshot) => (
        <ExerciseItem
          className={snapshot.isDragging ? 'dragging' : ''}
          data-key={exercise._id.toString()}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="header">
            <div className="title">
              <span {...provided.dragHandleProps} className="drag-handle">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <p className="name">{exercise.name}</p>
            </div>

            <div className="buttons">
              <div className="setControl">
                <button className="removeBtn" onClick={() => removeExercise(exercise._id)}>
                  <Garbage />
                </button>

                <button onClick={() => handleSetChange('remove', exerciseIndex)} disabled={sets.length <= 1}>
                  -
                </button>

                <button onClick={() => handleSetChange('add', exerciseIndex)} disabled={sets.length >= 100}>
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="sets-list">
            {exercise.metric === 'weight' && (
              <div className="set-title">
                <p style={{ flex: 0.1 }} />
                <p style={{ flex: 1.25 }}>Reps</p>
                <p style={{ flex: 1.25 }}>Weight</p>
              </div>
            )}

            {sets.map((set, j) => (
              <SetContainer
                key={`${exercise._id}_${j}`}
                setIndex={j}
                exerciseIndex={exerciseIndex}
                set={set}
                metric={exercise.metric}
                mode="builder"
                handleWeightChange={handleWeightChange}
                handleRepChange={handleRepChange}
                handleTimeChange={handleTimeChange}
                handleSetTypeChange={function (type: Set['type'], exerciseIndex: number, setIndex: number): void {}}
                handleSetPrevious={function (): void {}}
              />
            ))}
          </div>
        </ExerciseItem>
      )}
    </Draggable>
  )
}
export default CustomWorkoutExercise

const ExerciseItem = styled.li`
  border-radius: 3px;

  background: ${({ theme }) => theme.darkBg};
  width: 100%;
  text-align: center;
  position: relative;

  user-select: none;

  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      flex: 3;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      color: ${({ theme }) => theme.text};
      padding: 0.5rem;

      .drag-handle {
        max-width: min-content;
        font-size: 1rem;
        margin-right: 0.6rem;
        display: flex;
        flex-direction: column;

        span {
          height: 2px;
          width: 20px;
          margin: 0.15rem;
          display: block;
          background: ${({ theme }) => theme.border};
        }
      }
      .name {
        flex: 1;
        font-size: 1rem;
        text-transform: capitalize;
      }
    }

    .buttons {
      padding: 0.5rem 0;

      .setControl {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0.2rem;

        p {
          margin: 0 0.5rem;
        }
        button {
          flex: 1;
          border: none;
          background: ${({ theme }) => theme.accent};
          color: ${({ theme }) => theme.accentText};
          border-radius: 4px;
          height: 1.75rem;
          width: 1.75rem;
          margin: 0 0.3rem;
          font-size: 1.2rem;
          padding-left: 0.1rem;
          display: grid;
          place-items: center;
          transition: all 0.3s ease;

          &:disabled {
            color: ${({ theme }) => theme.border};
            background: ${({ theme }) => theme.background};
          }
        }

        .removeBtn {
          padding: 0;
          color: ${({ theme }) => theme.textLight};
          border: none;
          background: ${({ theme }) => theme.background};
        }
      }
    }
  }

  .sets-list {
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

  &.dragging {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.accent};
  }
`
