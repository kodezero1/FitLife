import React, { useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import styled from 'styled-components'
import { useDeleteExercise, useSetExercisePublic } from '../../../api-lib/controllers'
// Interfaces
import { Exercise } from '../../../types'
import Distance from '../../svg/Distance'
// SVG
import Garbage from '../../svg/Garbage'
import Timer from '../../svg/Timer'
import Weight from '../../svg/Weight'
import Modal from '../../Shared/Modal'
import { ConfirmDeleteForm } from '../../builder/routine/DeleteRoutineModal'
import { useSwipeable } from 'react-swipeable'
import Info from '../../svg/Info'
import StarFull from '../../svg/StarFull'
import StarEmpty from '../../svg/StarEmpty'

interface Props {
  exercise: Exercise
  isExerciseSelected: (exercise: Exercise) => boolean
  onExerciseDeselect: (exercise: Exercise) => void
  onExerciseSelect: (exercise: Exercise) => void
  deletable: boolean
  canEditPublic: boolean
  style: React.CSSProperties
}

const SwipeBoxWidth = 70

const ExerciseListItem: React.FC<Props> = ({
  exercise,
  isExerciseSelected,
  onExerciseDeselect,
  onExerciseSelect,
  deletable,
  canEditPublic,
  style,
}) => {
  let NumBoxes = 1
  if (deletable) NumBoxes += 1
  if (canEditPublic) NumBoxes += 1

  const queryClient = useQueryClient()
  const { mutate: deleteExercise } = useDeleteExercise(queryClient, {
    onSuccess: () => {
      onExerciseDeselect && onExerciseDeselect(exercise)
      setConfirmDelete(false)
    },
  })

  const { mutate: setExercisePublic, isLoading: isLoadingPublic } = useSetExercisePublic(queryClient)

  const handleDeleteExercise = () => {
    deleteExercise({ exerciseId: exercise._id })
  }

  const [showInfo, setShowInfo] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [hasSwiped, setHasSwiped] = useState(false)
  const [isPublic, setIsPublic] = useState(exercise.public)

  const itemRef = useRef<HTMLDivElement>(null)

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (!itemRef.current) return

      const currLeft = parseInt(itemRef.current.style.getPropertyValue('--swipe-left'))
      const startingLeft = parseInt(itemRef.current.style.getPropertyValue('--starting-left')) || 0

      if (eventData.first) itemRef.current.style.setProperty('--starting-left', currLeft.toString())

      itemRef.current.style.setProperty('--transition', '')
      itemRef.current.style.setProperty('--swipe-left', startingLeft + eventData.deltaX + 'px')
      itemRef.current.style.setProperty('--num-boxes', NumBoxes.toString())

      setHasSwiped(true)
    },

    onTouchEndOrOnMouseUp: () => {
      if (!itemRef.current) return

      const currLeft = parseInt(itemRef.current.style.getPropertyValue('--swipe-left'))

      const finalLeft = currLeft < -((SwipeBoxWidth * NumBoxes) / 2) ? -NumBoxes * SwipeBoxWidth : 0

      itemRef.current.style.setProperty('--starting-left', finalLeft.toString())
      itemRef.current.style.setProperty('--swipe-left', finalLeft + 'px')
      itemRef.current.style.setProperty('--transition', 'all 150ms ease')

      setTimeout(() => {
        itemRef?.current?.style.setProperty('--transition', '')
        setHasSwiped(false)
      }, 150)
    },

    trackMouse: true,
  })

  const refPassthrough = (el: HTMLDivElement) => {
    handlers.ref(el)
    // @ts-ignore
    itemRef.current = el
  }

  const getExerciseIcon = () => {
    switch (exercise.metric) {
      case 'weight':
        return (
          <div className="metric-flex">
            <Weight /> <p>Weight</p>
          </div>
        )
      case 'time':
        return (
          <div className="metric-flex">
            <Timer /> <p>Time</p>
          </div>
        )
      case 'distance':
        return (
          <div className="metric-flex">
            <Distance /> <p>Distance</p>
          </div>
        )
    }
  }

  const BackgroundButtons: any[] = []

  /**
   * Admin Btn
   */
  if (canEditPublic)
    BackgroundButtons.push(
      <button
        disabled={isLoadingPublic}
        onClick={(e) => {
          e.stopPropagation()
          setExercisePublic({ exerciseId: exercise._id, isPublic: !isPublic })
          setIsPublic((prev) => !prev)
        }}
      >
        {isPublic ? <StarFull /> : <StarEmpty />}
      </button>
    )

  /**
   * Default Info Btn
   */
  BackgroundButtons.push(
    <button
      onClick={(e) => {
        e.stopPropagation()
        setShowInfo(!showInfo)
      }}
    >
      <Info />
    </button>
  )

  /**
   * Delete Btn
   */
  if (deletable)
    BackgroundButtons.push(
      <button
        className="danger"
        onClick={(e) => {
          e.stopPropagation()
          setConfirmDelete(true)
        }}
      >
        <Garbage />
      </button>
    )

  return (
    <>
      <Item style={style}>
        <div {...handlers} ref={refPassthrough}>
          <div
            className={isExerciseSelected(exercise) ? 'inner highlight' : 'inner'}
            onClick={() =>
              !hasSwiped && (isExerciseSelected(exercise) ? onExerciseDeselect(exercise) : onExerciseSelect(exercise))
            }
          >
            <div className="heading">
              <h3>{exercise.name}</h3>
            </div>
          </div>

          <div className="background-boxes">
            {BackgroundButtons.map((elem, i) => (
              <div className="background-boxes__button-wrap" style={{ '--button-num': i } as React.CSSProperties}>
                {elem}
              </div>
            ))}
          </div>
        </div>
      </Item>

      <Modal removeModal={() => setShowInfo(false)} isOpen={showInfo}>
        <InfoWrap>
          <button className="close-btn" onClick={() => setShowInfo(false)}>
            ✕
          </button>

          <p>
            <span>muscle group</span> {exercise.muscleGroup}
          </p>

          <p>
            <span>muscle worked</span> {exercise.muscleWorked}
          </p>

          <p>
            <span>equipment</span> {exercise.equipment}
          </p>

          <p>
            <span>Metric</span> {getExerciseIcon()}
          </p>
        </InfoWrap>
      </Modal>

      <Modal removeModal={() => setConfirmDelete(false)} isOpen={confirmDelete}>
        <ConfirmDeleteForm>
          <button className="close-btn" onClick={() => setConfirmDelete(false)}>
            ✕
          </button>

          <h3>
            Are you sure you want to delete{' '}
            <span className="title">
              {exercise.name} <span className="question">?</span>
            </span>
          </h3>

          <div>
            <button className="danger" onClick={handleDeleteExercise}>
              Yes
            </button>
            <button onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        </ConfirmDeleteForm>
      </Modal>
    </>
  )
}
export default ExerciseListItem

const Item = styled.li`
  width: 100%;
  min-height: 60px;
  z-index: 1;
  user-select: none;
  -webkit-user-select: none;
  overflow: hidden;

  background: ${({ theme }) => theme.body};

  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  .inner {
    background: ${({ theme }) => theme.background};
    text-transform: capitalize;
    min-height: 59px;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;
    overflow: hidden;

    left: min(0px, var(--swipe-left));
    transition: var(--transition);

    &.highlight {
      background: ${({ theme }) => theme.buttonMedGradient};
    }

    .heading {
      left: calc(-1 * min(0px, var(--swipe-left)));
      transition: var(--transition);
      position: relative;

      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        flex: 1;
        text-align: left;
        padding: 0.25rem 1rem;
        font-size: 1rem;
        font-weight: 300;
        display: flex;
        align-items: center;
      }

      svg {
        margin-right: 0.65rem;
        fill: ${({ theme }) => theme.textLight};
        height: 1rem;

        display: grid;
        place-items: center;
        border-radius: 5px;
        border: none;
      }
    }
  }

  .background-boxes {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: var(--button-num);
    display: flex;
    width: calc(-1 * var(--swipe-left));
    transition: var(--transition);

    opacity: 1;

    .background-boxes__button-wrap {
      background: ${({ theme }) => theme.body};
      width: calc(100% / var(--num-boxes));
      overflow: hidden;

      button {
        display: grid;
        place-items: center;
        padding: 0 0.5rem;
        width: 100%;
        height: 100%;
        position: relative;

        &:disabled {
          color: ${({ theme }) => theme.textLight};
          background: ${({ theme }) => theme.darkBg};
        }

        &::before {
          background: ${({ theme }) => theme.buttonMedGradient};
          display: block;
          content: '';
          min-height: 100%;
          width: 1px;
          left: 0px;
          position: absolute;
        }
      }
    }
  }
`

const InfoWrap = styled.div`
  position: relative;
  width: 95%;
  margin: 50vh auto;
  transform: translateY(-50%);

  max-width: fit-content;
  background: ${({ theme }) => theme.buttonMed};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 15px 10px ${({ theme }) => theme.boxShadow};
  border-radius: 7px;
  padding: 1rem 4rem;

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

  & > p {
    padding: 0.7rem 0;
  }

  p {
    display: block;
    width: 100%;
    text-transform: capitalize;

    span {
      color: ${({ theme }) => theme.textLight};
      margin: 0.25rem 0;
      display: block;
      font-size: 0.7rem;
      width: 100%;
      text-transform: capitalize;
    }
  }

  .metric-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: fit-content;
    margin: auto;
  }
`
