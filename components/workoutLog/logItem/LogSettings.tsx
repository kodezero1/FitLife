import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { updateUserPreference, useUserDispatch, useUserState } from '../../../store'
import { WorkoutLogItem } from '../../../types'
import { compressWorkout, copyToClipboard, isTrue } from '../../../utils'

import Modal from '../../Shared/Modal'
import Checkmark from '../../Checkmark'

import Bookmark from '../../svg/Bookmark'
import ClipboardCopy from '../../svg/ClipboardCopy'
import Garbage from '../../svg/Garbage'
import Settings from '../../svg/Settings'
import Toggle from '../../Shared/Toggle'
import LayersOutline from '../../svg/LayersOutline'
import NoWeight from '../../svg/NoWeight'

type Props = {
  currentWorkoutLogItem: WorkoutLogItem
  resetAllSets: () => void
  resetAllWeights: () => void
  deleteWorkout: () => Promise<void>
  saveWorkout: () => Promise<void>
}

const LogSettings = ({ resetAllSets, resetAllWeights, deleteWorkout, currentWorkoutLogItem, saveWorkout }: Props) => {
  const { user } = useUserState()
  const userDispatch = useUserDispatch()

  const [showSettings, setShowSettings] = useState(false)
  const [showCopy, setShowCopy] = useState<boolean>(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updatePreference = (key: string, value: boolean) => {
    updateUserPreference(userDispatch, key, value, user?._id)
  }

  const copyLogItemToClipboard = () => {
    copyToClipboard(compressWorkout(currentWorkoutLogItem))
    setShowCopy(true)
  }

  useEffect(() => {
    let showCopyTimer: NodeJS.Timeout
    if (showCopy) showCopyTimer = setTimeout(() => setShowCopy(false), 2500)
    return () => clearTimeout(showCopyTimer)
  }, [showCopy])

  return (
    <>
      <button
        type="button"
        className="nav-btn small-btn"
        onClick={() => setShowSettings(!showSettings)}
        aria-label="View log settings"
      >
        <Settings />
      </button>

      {showSettings && (
        <Modal removeModal={() => setShowSettings(false)} isOpen={showSettings}>
          <ModalStyle>
            <button className="close-btn" onClick={() => setShowSettings(false)}>
              ✕
            </button>

            <h3 className="title">Workout Settings</h3>

            <div className="modal-list">
              {/* Workout Tools */}

              <button className="copy-to-clipboard row" onClick={copyLogItemToClipboard}>
                <ClipboardCopy /> Copy Workout
                {showCopy && (
                  <span className="save-notification">
                    <Checkmark styles={{ height: 20, width: 20 }} />
                  </span>
                )}
              </button>
              <button className="row" type="button" onClick={saveWorkout}>
                <Bookmark /> Save Workout
              </button>

              <button className="row" type="button" onClick={resetAllSets}>
                <LayersOutline /> Clear Sets
              </button>
              <button className="row" type="button" onClick={resetAllWeights}>
                <NoWeight /> Clear Weights
              </button>
              <button className="row danger" type="button" onClick={deleteWorkout}>
                <Garbage /> Delete Workout
              </button>

              {/* UI Preferences */}
              <div className="row-title">
                <p>Customize</p> <span>OFF/ON</span>
              </div>
              <div className="row">
                <label className="toggle">
                  <span>Date Bar</span>
                  <Toggle
                    checked={isTrue(user?.preferences?.showDateBarInLog)}
                    onChange={() => updatePreference('showDateBarInLog', !isTrue(user?.preferences?.showDateBarInLog))}
                  />
                </label>
              </div>
              <div className="row">
                <label className="toggle">
                  <span>Muscle Icons</span>
                  <Toggle
                    checked={isTrue(user?.preferences?.showMuscleIconsInLog)}
                    onChange={() =>
                      updatePreference('showMuscleIconsInLog', !isTrue(user?.preferences?.showMuscleIconsInLog))
                    }
                  />
                </label>
              </div>
              <div className="row">
                <label className="toggle">
                  <span>Exercise Charts</span>
                  <Toggle
                    checked={isTrue(user?.preferences?.showExerciseChartsInLog)}
                    onChange={() =>
                      updatePreference('showExerciseChartsInLog', !isTrue(user?.preferences?.showExerciseChartsInLog))
                    }
                  />
                </label>
              </div>

              <div className="row-title">
                <p>Advanced</p>
                <button className="small-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                  {showAdvanced ? 'Hide' : 'Show'}
                </button>
              </div>
              {showAdvanced && (
                <div className="row">
                  <label className="toggle">
                    <span>Show Dupes In Workout Name Search</span>
                    <Toggle
                      checked={isTrue(user?.preferences?.showDupesInWorkoutNameSearch, false)}
                      onChange={() =>
                        updatePreference(
                          'showDupesInWorkoutNameSearch',
                          !isTrue(user?.preferences?.showDupesInWorkoutNameSearch, false)
                        )
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          </ModalStyle>
        </Modal>
      )}
    </>
  )
}

export default LogSettings

export const ModalStyle = styled.div`
  position: relative;
  width: 95%;
  margin: 10vh auto 0;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 0 15px 10px ${({ theme }) => theme.boxShadow};
  border-radius: 8px;
  padding: 0.5rem;
  text-align: left;
  scroll-behavior: smooth;
  scroll-padding-top: 1rem;

  .title {
    font-weight: 400;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.buttonMed};
  }

  hr {
    height: 1px;
    border: 0;
    background-color: ${({ theme }) => theme.buttonMed};
  }

  .modal-list {
    display: grid;
    grid-gap: 0.5rem;
    margin-bottom: 0.25rem;
    grid-template-columns: 1fr;

    .row {
      background: ${({ theme }) => theme.buttonMed};
      border-radius: 5px;
      font-size: 0.9rem;

      &.danger {
        box-shadow: inset 0 0 0 1px rgb(200, 100, 100);
      }
    }

    .row-title {
      display: flex;
      justify-content: space-between;
      align-items: end;
      padding: 0 0.75rem 0;
      padding-bottom: 0.25rem;
      font-weight: 300;
      margin-top: 0.5rem;
      color: ${({ theme }) => theme.textLight};
      border-bottom: 1px solid ${({ theme }) => theme.buttonMed};
      font-size: 0.9rem;

      span {
        font-size: 0.6rem;
        margin-right: 0.35rem;
      }
      .small-btn {
        font-size: 0.7rem;
        background: ${({ theme }) => theme.lowOpacity};
        padding: 0.2rem 0.5rem;
        font-weight: 300;
        border-radius: 3px;
        min-width: 50px;
        text-align: center;
      }
    }

    .toggle {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      span {
        flex: 1;
        padding-bottom: 1px;
        margin-right: 0.25rem;
      }
    }

    .row {
      padding: 0.75rem 1rem;
      width: 100%;
      display: flex;
      align-items: center;

      svg {
        margin-right: 1rem;
        color: ${({ theme }) => theme.textLight};
      }

      .save-notification {
        position: absolute;
        right: 1.5rem;
      }
    }
  }

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
`
