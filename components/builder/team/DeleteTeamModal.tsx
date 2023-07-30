import React from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
import { useDeleteTeam } from '../../../api-lib/controllers'

// Interface
import { Team } from '../../../types'
// Components
import Modal from '../../Shared/Modal'
import { ConfirmDeleteForm } from '../routine/DeleteRoutineModal'

interface Props {
  team: Team
  setTeamToDelete: React.Dispatch<React.SetStateAction<Team | null>>
  clearTeam: () => void
}

const DeleteTeamModal: React.FC<Props> = ({ team, setTeamToDelete, clearTeam }) => {
  const queryClient = useQueryClient()

  const { mutate: deleteTeam } = useDeleteTeam(queryClient, {
    onSuccess: () => {
      setTeamToDelete(null)
      clearTeam()
    },
  })

  return (
    <Modal isOpen={Boolean(team)} removeModal={() => setTeamToDelete(null)}>
      <ConfirmDeleteForm>
        <button className="close-btn" onClick={() => setTeamToDelete(null)}>
          ✕
        </button>

        <h3>
          Are you sure you want to delete{' '}
          <span className="title">
            {team.teamName} <span className="question">?</span>
          </span>
        </h3>

        <div>
          <button className="danger" onClick={() => deleteTeam({ teamId: team._id })}>
            Yes
          </button>
          <button onClick={() => setTeamToDelete(null)}>Cancel</button>
        </div>
      </ConfirmDeleteForm>
    </Modal>
  )
}

export default DeleteTeamModal
