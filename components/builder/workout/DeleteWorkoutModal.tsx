import styled from 'styled-components'
// Components
import Modal from '../../Shared/Modal'
// Interfaces
import { Workout } from '../../../types'
import { useDeleteWorkout } from '../../../api-lib/controllers'
import { useQueryClient } from 'react-query'
import { ConfirmDeleteForm } from '../routine/DeleteRoutineModal'

interface Props {
  workout: Workout
  setWorkoutToDelete: React.Dispatch<React.SetStateAction<Workout | null>>
  clearCustomWorkout: () => void
}

const DeleteWorkoutModal: React.FC<Props> = ({ workout, setWorkoutToDelete, clearCustomWorkout }) => {
  const queryClient = useQueryClient()

  const { mutate: deleteWorkout } = useDeleteWorkout(queryClient, {
    onSuccess: () => {
      setWorkoutToDelete(null)
      clearCustomWorkout()
    },
  })

  return (
    <Modal isOpen={Boolean(workout)} removeModal={() => setWorkoutToDelete(null)}>
      <ConfirmDeleteForm>
        <button className="close-btn" onClick={() => setWorkoutToDelete(null)}>
          ✕
        </button>

        <h3>
          Are you sure you want to delete{' '}
          <span className="title">
            {workout.name} <span className="question">?</span>
          </span>
        </h3>

        <div>
          <button className="danger" onClick={() => deleteWorkout({ workoutId: workout._id })}>
            Yes
          </button>
          <button onClick={() => setWorkoutToDelete(null)}>Cancel</button>
        </div>
      </ConfirmDeleteForm>
    </Modal>
  )
}
export default DeleteWorkoutModal
