import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
// Context
import { useDeleteRoutine } from '../../../api-lib/controllers'
// Interfaces
import { Routine } from '../../../types'
// Components
import Modal from '../../Shared/Modal'

interface Props {
  routine: Routine
  setRoutineToDelete: React.Dispatch<React.SetStateAction<Routine | null>>
  clearRoutine: () => void
}

const DeleteRoutineModal: React.FC<Props> = ({ routine, setRoutineToDelete, clearRoutine }) => {
  const queryClient = useQueryClient()

  const { mutate: deleteRoutine } = useDeleteRoutine(queryClient, {
    onSuccess: () => {
      setRoutineToDelete(null)
      clearRoutine()
    },
  })

  const handleDeleteRoutine = async () => {
    deleteRoutine({ routineId: routine._id })
  }

  return (
    <Modal isOpen={Boolean(routine)} removeModal={() => setRoutineToDelete(null)}>
      <ConfirmDeleteForm>
        <button className="close-btn" onClick={() => setRoutineToDelete(null)}>
          ✕
        </button>

        <h3>
          Are you sure you want to delete{' '}
          <span className="title">
            {routine.name} <span className="question">?</span>
          </span>
        </h3>

        <div>
          <button className="danger" onClick={handleDeleteRoutine}>
            Yes
          </button>
          <button onClick={() => setRoutineToDelete(null)}>Cancel</button>
        </div>
      </ConfirmDeleteForm>
    </Modal>
  )
}

export default DeleteRoutineModal

export const ConfirmDeleteForm = styled.div`
  position: relative;
  width: 95%;
  margin: 50vh auto;
  transform: translateY(-50%);

  max-width: 400px;
  background: ${({ theme }) => theme.buttonMed};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 15px 10px ${({ theme }) => theme.boxShadow};
  border-radius: 7px;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .close-btn {
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 2px;
    right: 2px;
    height: 25px;
    width: 25px;
  }

  h3 {
    font-weight: 300;
    font-size: 16px;
  }

  h3 .title {
    display: block;
    text-transform: capitalize;
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 1.8rem;

    .question {
      font-weight: 300;
      margin-left: -2px;
    }
  }

  div {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    button {
      flex: 1;
      color: inherit;
      border-radius: 4px;
      padding: 0.5rem;
      min-width: 100px;

      &:not(.danger) {
        border: 1px solid ${({ theme }) => theme.body};
      }
    }
  }
`
