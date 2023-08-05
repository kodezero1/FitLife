import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
// Interfaces
import { Workout, WorkoutLogItem } from '../../types'
// SVG
import ClipboardPaste from '../svg/ClipboardPaste'
import LightningBolt from '../svg/LightningBolt'
// Components
import TextInput from '../Shared/TextInput'
// import TeamWorkouts from "./TeamWorkouts";
import UserWorkouts from './UserWorkouts'
import { parseWorkout } from '../../utils'
import TeamWorkouts from './TeamWorkouts'

interface Props {
  displayOnTheFlyWorkout: () => void
  displayPremadeWorkout: (clicked: Workout) => void
  displayWorkoutLogItem: (logItem: WorkoutLogItem) => void
  copyPreviousLogItem: (date: string) => void
  quickStartWorkouts: {
    recent: { workoutName: string; date: string }[]
    created: Workout[]
    saved: Workout[]
  }
  selectedDate: string
}

const QuickStart: React.FC<Props> = ({
  displayOnTheFlyWorkout,
  displayPremadeWorkout,
  displayWorkoutLogItem,
  copyPreviousLogItem,
  quickStartWorkouts,
  selectedDate,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCopyErr, setShowCopyErr] = useState(false)

  const handlePasteWorkout = async () => {
    try {
      const text = await navigator?.clipboard?.readText()
      const workout = parseWorkout(text)
      if (workout && workout.workoutName) displayWorkoutLogItem(workout)
      else setShowCopyErr(true)
    } catch (e) {
      console.log(e)
      setShowCopyErr(true)
    }
  }

  useEffect(() => {
    let showCopyTimer: NodeJS.Timeout
    if (showCopyErr) showCopyTimer = setTimeout(() => setShowCopyErr(false), 2000)
    return () => clearTimeout(showCopyTimer)
  }, [showCopyErr])

  return (
    <Container>
      <header>
        <h1 className="title">Quick Start</h1>

        <button type="button" onClick={handlePasteWorkout}>
          <ClipboardPaste />
          {showCopyErr && <span>No Workout Copied</span>}
        </button>
      </header>

      <OnTheFly onClick={displayOnTheFlyWorkout} className="button-press" type="button">
        <h3>
          <LightningBolt /> Start Workout
        </h3>
        <p>Start with a blank workout and track your exercises as you go.</p>
      </OnTheFly>

      <TextInput
        onChange={(text) => setSearchTerm(text)}
        inputName="Quick Start Search Term"
        placeholder="Search Workouts"
      />

      <UserWorkouts
        searchTerm={searchTerm}
        displayPremadeWorkout={displayPremadeWorkout}
        copyPreviousLogItem={copyPreviousLogItem}
        quickStartWorkouts={quickStartWorkouts}
      />

      <TeamWorkouts searchTerm={searchTerm} selectedDate={selectedDate} displayPremadeWorkout={displayPremadeWorkout} />
    </Container>
  )
}

export default QuickStart

const Container = styled.div`
  width: 100%;
  padding: 0.5rem 0.5rem 1px;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  margin: 0 0 0.5rem;

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${({ theme }) => theme.textLight};
    margin: 0 0.25rem 0.5rem;

    .title {
      font-weight: 300;
      text-align: left;
    }

    button {
      height: 30px;
      padding: 5px;
      border-radius: 3px;
      position: relative;
      background: ${({ theme }) => theme.lowOpacity};

      span {
        display: block;
        position: absolute;
        top: 0px;
        right: 110%;
        z-index: 99;
        border-radius: 3px;
        background: ${({ theme }) => theme.buttonMedGradient};
        border: 1px solid ${({ theme }) => theme.accent};
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        animation: slideDown 0.1s ease-in-out;
        width: 160px;
      }
    }
  }

  .section-title {
    text-align: left;
    margin: 0.25rem 0;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
    font-size: 1rem;
  }
`

const OnTheFly = styled.button`
  background: ${({ theme }) => theme.buttonMedGradient};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.border}, 0 1px 3px ${({ theme }) => theme.boxShadow};
  cursor: pointer;
  text-align: left;
  border-radius: 5px;
  padding: 0.75rem 0.5rem 1rem;
  margin: 0.5rem 0.25rem 1rem;
  transition: all 0.2s ease;
  position: relative;
  animation: fadeInUp 0.3s forwards;

  h3 {
    font-weight: 300;
    display: flex;
    font-size: 1.5rem;
    align-items: center;
  }
  svg {
    border: 0.5px solid ${({ theme }) => theme.accent};
    box-shadow: 0 0 4px ${({ theme }) => theme.accent};
    border-radius: 50%;
    padding: 2px;
    background: ${({ theme }) => theme.buttonMed};
    margin: 0 0.5rem;
  }
  svg,
  path {
    fill: ${({ theme }) => theme.accent};
  }

  p {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.9rem;
    line-height: 1.1rem;
    font-weight: 300;
    letter-spacing: 0.5px;
    margin: 0 1.1rem;
    padding: 0 1.2rem;
    border-left: 0.5px dashed ${({ theme }) => theme.accent};
  }
`
