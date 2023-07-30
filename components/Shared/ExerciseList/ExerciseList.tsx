import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import { matchSorter } from 'match-sorter'
// Context
import { useUserState } from '../../../store'
import { getInReviewExercises, getUserMadeExercises } from '../../../api-lib/controllers'
// Interfaces
import { Exercise } from '../../../types'
// Components
import CreateExerciseModal from '../../builder/workout/CreateExerciseModal'
import ExerciseListItem from './ExerciseListItem'
import VirtualList from '../VirtualList'
import ListControls from './ListControls'
import useLockedBody from '../../hooks/useLockedBody'

interface Props {
  isExerciseSelected: (exercise: Exercise) => boolean
  onExerciseSelect: (exercise: Exercise) => void
  onExerciseDeselect: (exercise: Exercise) => void
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ListVH = 85
const RowHeight = 60

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((r) => r.json())

export type ListOptionsType = 'All Exercises' | 'My Exercises' | 'In Review'

const ExerciseList: React.FC<Props> = ({
  isExerciseSelected,
  onExerciseSelect,
  onExerciseDeselect,
  isOpen = false,
  setIsOpen,
}) => {
  const { user } = useUserState()

  const [_, setLockedBody] = useLockedBody(isOpen)

  const { data: ssrExercises, error } = useSWR('/api/exercises?default=true', fetcher) as {
    data: Exercise[]
    error: any
  }

  const { data: userExercises } = getUserMadeExercises(user)
  const { data: inReviewExercises } = getInReviewExercises(user)

  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<Exercise['muscleGroup']>('')
  const [metricFilter, setMetricFilter] = useState<Exercise['metric'] | ''>('')
  const [shownList, setShownList] = useState<ListOptionsType>('All Exercises')
  const [shownExercises, setShownExercises] = useState<Exercise[]>([])

  const container = useRef<HTMLDivElement>(null)
  const containerBottom = useRef(isOpen ? 0 : ListVH * -1)
  const listShadow = useRef<HTMLDivElement>(null)
  const virtualListContainer = useRef<HTMLUListElement>(null)

  const handleSearchTermChange = (term: string) => setSearchTerm(term)

  const openList = useCallback(() => {
    containerBottom.current = 0
    if (container.current) {
      container.current.classList.remove('no-transition')
      container.current.style.bottom = 0 + 'vh'
      container.current.classList.add('open')
    }
    if (listShadow.current) listShadow.current.classList.add('open')

    setLockedBody(true)

    setIsOpen(true)
  }, [container, containerBottom, listShadow])

  const closeList = useCallback(() => {
    containerBottom.current = -ListVH
    if (container.current) {
      container.current.classList.remove('no-transition')
      container.current.style.bottom = -ListVH + 'vh'
      container.current.classList.remove('open')
    }
    if (listShadow.current) listShadow.current.classList.remove('open')

    setLockedBody(false)

    setIsOpen(false)
  }, [container, containerBottom, listShadow])

  const setListBottom = useCallback(
    (vh: number) => {
      containerBottom.current = vh
      if (container.current) {
        container.current.classList.add('no-transition')
        container.current.style.bottom = vh + 'vh'
        if (vh > -ListVH) container.current.classList.add('open')
        else container.current.classList.remove('open')
      }
      if (listShadow.current) listShadow.current.classList.remove('open')
    },
    [container, containerBottom, listShadow]
  )

  const handleTouchDragList = (e: any) => {
    const screenHeight = e.view.innerHeight
    const thumbY = e.touches[0].clientY
    const thumbVH = ((screenHeight - thumbY) / screenHeight) * 100 - ListVH
    if (thumbVH <= 0 && container.current) setListBottom(thumbVH)
  }

  const handleDragEnd = () => {
    containerBottom.current <= -20 ? closeList() : openList()
  }

  const fuzzySearchMultipleWords = useCallback(
    (
      exercises: Exercise[],
      filterValue: string, // potentially multi-word search string "upper leg time"
      keys = ['name', 'equipment', 'muscleGroup', 'muscleWorked', 'metric'] // keys to search
    ) => {
      const terms = filterValue.split(',').filter((v) => v.trim())

      if (!filterValue || !filterValue.length || !terms.length) {
        // Sort alphabetically by name
        return exercises.sort((a: Exercise, b: Exercise) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      }

      // reduceRight will mean sorting is done by score for the _first_ entered word.
      return terms.reduceRight((results, term) => matchSorter(results, term, { keys }), exercises)
    },
    []
  )

  useEffect(() => {
    if (ssrExercises && userExercises) {
      const noDupes = [
        ...(shownList === 'All Exercises' ? ssrExercises.filter((ex) => ex.creator_id !== user?._id) : []),
        ...userExercises,
      ]
      const exercises = shownList === 'In Review' ? inReviewExercises || [] : noDupes

      setShownExercises(fuzzySearchMultipleWords(exercises, searchTerm + ',' + muscleGroupFilter + ',' + metricFilter))
    }
  }, [searchTerm, muscleGroupFilter, metricFilter, ssrExercises, userExercises, inReviewExercises, shownList])

  useEffect(() => {
    isOpen && container.current ? openList() : closeList()
  }, [isOpen, container])

  // Error catch for SWR
  if (error) return <h3>Failed to load.</h3>

  return (
    <>
      <ExercisesContainer ref={container}>
        <div ref={listShadow} className="exercise-list-shadow" onClick={closeList} />

        <Header>
          <div className="thumb-line" onTouchMove={handleTouchDragList} onTouchEnd={handleDragEnd}>
            <span />
          </div>

          <ListControls
            handleSearchTermChange={handleSearchTermChange}
            shownList={shownList}
            setShownList={setShownList}
            metricFilter={metricFilter}
            setMetricFilter={setMetricFilter}
            muscleGroupFilter={muscleGroupFilter}
            setMuscleGroupFilter={setMuscleGroupFilter}
            setShowCreateExerciseModal={setShowCreateExerciseModal}
          />
        </Header>

        <ExerciseListContainer ref={virtualListContainer}>
          <VirtualList
            numItems={shownExercises.length}
            itemHeight={RowHeight}
            windowHeight={virtualListContainer.current?.clientHeight || 0}
            renderItem={({ index, style }) => (
              <ExerciseListItem
                key={`exercise-select-list-${shownExercises[index]._id}`}
                exercise={shownExercises[index]}
                isExerciseSelected={isExerciseSelected}
                onExerciseSelect={onExerciseSelect}
                onExerciseDeselect={onExerciseDeselect}
                deletable={shownExercises[index].creator_id === user?._id}
                canEditPublic={Boolean(user?.isAdmin)}
                style={style}
              />
            )}
          />
        </ExerciseListContainer>
      </ExercisesContainer>

      {showCreateExerciseModal && (
        <CreateExerciseModal setShowModal={setShowCreateExerciseModal} showModal={showCreateExerciseModal} />
      )}
    </>
  )
}
export default ExerciseList

const ExercisesContainer = styled.div`
  height: ${ListVH + 'vh'};
  max-height: ${ListVH + 'vh'};
  width: 100vw;
  max-width: 450px;
  margin: auto;
  border-radius: 20px 20px 0 0;
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${'-' + ListVH + 'vh'};
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: all 0s linear;
  box-shadow: none;
  transition: all 0.2s ease-in-out;
  background: ${({ theme }) => theme.background};

  &.open {
    box-shadow: 0 -5px 20px 5px ${({ theme }) => theme.opacityBackground};
  }
  &.no-transition {
    transition: none;
  }

  .exercise-list-shadow {
    position: absolute;
    left: 0;
    background: transparent;
    height: 27vh;
    pointer-events: none;
    width: 100vw;
    max-width: 450px;
    transition: background 0.2s 0.15s;

    &.open {
      top: -25vh;
      pointer-events: auto;
      background: ${({ theme }) => theme.opacityBackground};
    }
  }
`

const Header = styled.header`
  border-top: 2px solid ${({ theme }) => theme.border};
  border-left: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  border-radius: inherit;
  width: 100%;
  z-index: 2;

  .thumb-line {
    border-radius: inherit;
    background: ${({ theme }) => theme.background};
    width: 100%;
    padding: 0.75rem 0;
    touch-action: none;

    span {
      width: 15%;
      height: 5px;
      border-radius: 5px;
      background: ${({ theme }) => theme.border};
      display: block;
      margin: auto;
      touch-action: none;
    }
  }

  .exercise-list-controls {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding-bottom: 0.75rem;
    background: ${({ theme }) => theme.background};
  }
`

const ExerciseListContainer = styled.ul`
  overflow: hidden;
  background: ${({ theme }) => theme.background};
  border-left: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;

  & > * {
    width: 100%;
  }
`
