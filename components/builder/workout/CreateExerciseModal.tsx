import styled from 'styled-components'
import { useState } from 'react'
// Components
import Modal from '../../Shared/Modal'
// Interfaces
import { NewExercise } from '../../../types'
// Context
import { useUserState } from './../../../store'
import { useQueryClient } from 'react-query'
import { useCreateExercise } from '../../../api-lib/controllers'

const muscleGroups = [
  'upper back',
  'lower back',
  'shoulder',
  'upper arm',
  'forearm',
  'chest',
  'hip',
  'upper leg',
  'lower leg',
  'core',
  'cardio',
]

const metrics: NewExercise['metric'][] = ['weight', 'time', 'distance']

const InitialNewState: NewExercise = {
  name: '',
  equipment: '',
  muscleGroup: '',
  muscleWorked: '',
  metric: 'weight',
  creator_id: '',
  public: false,
}

export default function CreateExerciseModal({ setShowModal, showModal }) {
  const [formState, setFormState] = useState<NewExercise>(InitialNewState)

  const { user } = useUserState()

  const queryClient = useQueryClient()
  const { mutate: createExercise } = useCreateExercise(queryClient, {
    onSuccess: () => setFormState(InitialNewState),
  })

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createExercise({ newExercise: { ...formState, creator_id: user!._id } })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, name: e.target.value })

  const handleEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, equipment: e.target.value })

  const handleMuscleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFormState({ ...formState, muscleGroup: e.target.value as NewExercise['muscleGroup'] })

  const handleMuscleWorkedChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormState({ ...formState, muscleWorked: e.target.value })

  const handleMetricChange = (metric: 'weight' | 'time' | 'distance') => setFormState({ ...formState, metric: metric })

  return (
    <Modal isOpen={showModal} removeModal={() => setShowModal(false)}>
      <Container>
        <button className="close-btn" onClick={() => setShowModal(false)}>
          ✕
        </button>

        <form action="POST" onSubmit={handleFormSubmit}>
          <h3>New Exercise</h3>

          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" name="name" value={formState.name} onChange={handleNameChange} required />
          </div>

          <div>
            <label htmlFor="equipment">Equipment:</label>
            <input type="text" name="equipment" value={formState.equipment} onChange={handleEquipmentChange} required />
          </div>

          <div>
            <label htmlFor="muscleGroup">Muscle Group:</label>
            <select name="muscleGroup" onChange={handleMuscleGroupChange} defaultValue={'none'} required>
              <option value="none" disabled>
                Select One
              </option>

              {muscleGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="muscleWorked">Muscle Worked:</label>
            <input
              type="text"
              name="muscleWorked"
              value={formState.muscleWorked}
              onChange={handleMuscleWorkedChange}
              required
            />
          </div>

          <div>
            <label htmlFor="metric">Metric:</label>
            <div className="metric-select">
              {metrics.map((metric: 'weight' | 'time' | 'distance') => (
                <button
                  type="button"
                  key={metric}
                  onClick={() => handleMetricChange(metric)}
                  className={formState.metric === metric ? 'selected' : ''}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={
              !formState.name ||
              !formState.equipment ||
              !formState.equipment ||
              !formState.muscleGroup ||
              !formState.muscleWorked ||
              !formState.metric
            }
          >
            Save
          </button>
        </form>
      </Container>
    </Modal>
  )
}

const Container = styled.div`
  max-width: 400px;
  width: 95%;
  margin: 50px auto 0;
  border-radius: 10px;
  background: ${({ theme }) => theme.buttonMed};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 15px 10px ${({ theme }) => theme.boxShadow};
  position: relative;
  z-index: 99999999;
  max-height: 90vh;
  overflow-y: auto;

  display: grid;
  place-items: center;

  .close-btn {
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 5px;
    right: 5px;
    height: 25px;
    width: 25px;
  }

  form {
    height: 100%;
    width: 100%;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    h3 {
      color: ${({ theme }) => theme.text};
      font-weight: 300;
    }

    div {
      width: 100%;
      display: flex;
      text-align: left;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      margin: 0.5rem 0;

      label {
        font-size: 0.8rem;
        color: ${({ theme }) => theme.textLight};
        text-transform: uppercase;
      }

      input {
        width: 100%;
        margin: 0.25rem 0;
        padding: 0.5rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        background: ${({ theme }) => theme.medOpacity};
        border: 1px solid ${({ theme }) => theme.border};

        &:focus {
          border: 1px solid ${({ theme }) => theme.accent};
          outline: none;
        }
      }

      select {
        width: 100%;
        text-transform: capitalize;
        margin: 0.25rem 0;
        padding: 0.5rem 0.5rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        border: 1px solid ${({ theme }) => theme.border};
        cursor: pointer;

        --BG: ${({ theme }) => theme.medOpacity};
        --arrow: ${({ theme }) => theme.accent};
        --arrowBG: ${({ theme }) => theme.body};

        -webkit-appearance: none;
        appearance: none;
        background-color: ${({ theme }) => theme.medOpacity};
        background-image: linear-gradient(var(--BG), var(--BG)),
          linear-gradient(-135deg, transparent 50%, var(--arrowBG) 50%),
          linear-gradient(-225deg, transparent 50%, var(--arrowBG) 50%),
          linear-gradient(var(--arrowBG) 42%, var(--arrow) 42%);
        background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
        background-size: 1px 100%, 30px 30px, 30px 30px, 30px 100%;
        background-position: right 30px center, right bottom, right bottom, right bottom;
      }

      .metric-select {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 0.5rem;

        button {
          text-transform: capitalize;
          padding: 0.25rem 1rem;
          border: 1px solid ${({ theme }) => theme.border};
          border-radius: 5px;
          transition: all 0.25s ease;
          cursor: pointer;
          background: ${({ theme }) => theme.medOpacity};
          color: ${({ theme }) => theme.textLight};

          &.selected {
            color: ${({ theme }) => theme.text};
            background: ${({ theme }) => theme.buttonMedGradient};
            border: 1px solid ${({ theme }) => theme.accent};
          }
        }
      }
    }

    [type='submit'] {
      background: ${({ theme }) => theme.buttonMedGradient};
      border: 1px solid ${({ theme }) => theme.border};
      color: inherit;
      border-radius: 5px;
      margin: 3rem auto 0;
      padding: 0.5rem 1rem;
      width: 100%;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.lowOpacity};
      }
    }
  }
`
