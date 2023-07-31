import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { TimeSet } from '../../../types'
import { msToTime, round, timeToMs } from '../../../utils'
import Reset from '../../svg/Reset'

type Props = {
  set: TimeSet
  setIndex: number
  exerciseIndex: number
  showStartStop: boolean
  handleTimeChange: (setData: TimeSet, exerciseIndex: any, setIndex: any) => void
}

const MS_TO_QS = 100
const currTime = () => round(Date.now() / MS_TO_QS, 0)

const TimerSet: React.FC<Props> = ({ set, setIndex, exerciseIndex, showStartStop, handleTimeChange }) => {
  const [timerCount, setTimerCount] = useState<number>(
    set.startedAt ? set.duration + (currTime() - set.startedAt) : set.duration
  )
  const [timer, setTimer] = useState<NodeJS.Timer | null>(null)
  const [focusedInput, setFocusedInput] = useState<'hours' | 'minutes' | 'seconds' | null>(null)
  const [focusedInputValue, setFocusedInputValue] = useState('')

  const saveSet = (set: TimeSet) => {
    handleTimeChange(set, exerciseIndex, setIndex)
  }

  const handleInputFocus = ({ target }) => {
    stopTimer()
    setFocusedInput(target.name)
    target.select()
  }

  const handleInputBlur = ({ target }) => {
    setFocusedInput(null)
    setFocusedInputValue('')
    if (target.value == '') return

    let { hours, minutes, seconds, milliseconds } = msToTime(timerCount)
    const inputName = target.name
    let newTime: number = 0

    switch (inputName) {
      case 'hours':
        newTime = timeToMs(target.value, minutes, seconds, milliseconds * MS_TO_QS)
        break
      case 'minutes':
        newTime = timeToMs(hours, target.value, seconds, milliseconds * MS_TO_QS)
        break
      case 'seconds':
        newTime = timeToMs(hours, minutes, target.value.split('.')[0], target.value.split('.')[1] * MS_TO_QS || 0)
        break
    }
    setTimerCount(newTime)

    saveSet({
      duration: newTime,
      startedAt: 0,
      ongoing: false,
      type: set.type,
    })
  }

  const startTimer = () => {
    if (timer) clearTimeout(timer)
    saveSet({ duration: timerCount, startedAt: currTime(), ongoing: true, type: set.type })
    setTimer(initTimerInterval(timerCount, currTime()))
  }

  const stopTimer = () => {
    if (!timer) return
    saveSet({ duration: timerCount, startedAt: 0, ongoing: false, type: set.type })
    clearTimeout(timer)
    setTimer(null)
  }

  const clearTimer = () => {
    if (timer) clearTimeout(timer)
    saveSet({ duration: 0, startedAt: 0, ongoing: false, type: set.type })
    setTimer(null)
    setTimerCount(0)
  }

  const pad = (digit: number) => (digit < 10 ? '0' + digit : digit)

  const initTimerInterval = (duration, startedAt) => {
    return setInterval(() => {
      setTimerCount(duration + (currTime() - startedAt))
    }, 100)
  }

  useEffect(() => {
    setTimerCount(set.startedAt ? set.duration + (currTime() - set.startedAt) : set.duration)
  }, [set])

  useEffect(() => {
    if (set.ongoing && set.startedAt && !timer) setTimer(initTimerInterval(set.duration, set.startedAt))
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <Set showStartStop={showStartStop}>
      <button type="button" onClick={clearTimer} className="reset-btn">
        <Reset />
      </button>

      <div className="timer">
        <div>
          <input
            type="number"
            name="hours"
            inputMode="decimal"
            className="hours"
            value={focusedInput === 'hours' ? focusedInputValue : msToTime(timerCount).hours}
            onChange={({ target }) => setFocusedInputValue(target.value)}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            min={0}
            max={24}
          />
          <span>:</span>
        </div>
        <div>
          <input
            type="number"
            name="minutes"
            inputMode="decimal"
            className="minutes"
            value={focusedInput === 'minutes' ? focusedInputValue : pad(msToTime(timerCount).minutes)}
            onChange={({ target }) => setFocusedInputValue(target.value)}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            min={0}
            max={59}
          />
          <span>:</span>
        </div>
        <div>
          <input
            type="number"
            name="seconds"
            inputMode="decimal"
            className="seconds"
            value={
              focusedInput === 'seconds'
                ? focusedInputValue
                : `${pad(msToTime(timerCount).seconds)}.${msToTime(timerCount).milliseconds}`
            }
            onChange={({ target }) => setFocusedInputValue(target.value)}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            step={0.1}
            min={0}
            max={59}
          />
        </div>
      </div>

      {showStartStop && (
        <div className="start-stop">
          {set.ongoing ? (
            <button className="stop" type="button" onClick={stopTimer} disabled={!set.ongoing}>
              Stop
            </button>
          ) : (
            <button className="start" type="button" onClick={startTimer} disabled={set.ongoing}>
              Start
            </button>
          )}
        </div>
      )}
    </Set>
  )
}

export default TimerSet

const Set = styled.div<{ showStartStop: boolean }>`
  width: 100%;
  height: fit-content;
  padding-left: 0.25rem;
  margin: 0.5rem 0;
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: ${({ showStartStop }) => (showStartStop ? 'space-around' : 'start')};
  align-items: center;

  .reset-btn {
    display: grid;
    place-items: center;
    margin: 0 0.5rem 0 0.25rem;
    padding: 0.4rem;
    height: 100%;
    border-radius: 3px;
    cursor: pointer;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.textLight};
  }

  .timer {
    flex: 1;
    display: flex;
    width: 100%;
    max-width: min-content;

    div {
      display: flex;
      align-items: center;

      span {
        margin: 0 2px;
      }

      input {
        background: inherit;
        color: inherit;
        font-size: 1.45rem;
        margin: 0;
        padding: 0.2rem 0;
        text-align: center;
        border: none;
        border-radius: 0;
        border: 1px solid transparent;
        border-bottom: 1px solid ${({ theme }) => theme.accent};
        outline: none;
        font-family: 'Verdana';
        transition: all 0.2s ease;

        /* Chrome, Safari, Edge, Opera */
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* Firefox */
        &[type='number'] {
          -moz-appearance: textfield;
        }

        &.hours {
          width: 35px;
          max-width: 35px;
        }
        &.minutes {
          width: 35px;
          max-width: 35px;
        }
        &.seconds {
          width: 60px;
          max-width: 60px;
        }

        @media screen and (min-width: 380px) {
          &.hours {
            width: 45px;
            max-width: 45px;
          }
          &.minutes {
            width: 45px;
            max-width: 45px;
          }
          &.seconds {
            width: 65px;
            max-width: 65px;
          }
        }

        &:focus {
          border: 1px solid ${({ theme }) => theme.accent};
          border-radius: 3px;
          outline: none;
        }
        &::-moz-selection {
          color: ${({ theme }) => theme.accent};
          background: ${({ theme }) => theme.background};
          text-shadow: none;
        }
        &::-webkit-selection {
          color: ${({ theme }) => theme.accent};
          background: ${({ theme }) => theme.background};
          text-shadow: none;
        }
        &::selection {
          color: ${({ theme }) => theme.accent};
          background: ${({ theme }) => theme.background};
          text-shadow: none;
        }
      }
    }
  }

  .start-stop {
    display: flex;

    button {
      display: grid;
      place-items: center;
      margin-left: 0.25rem;
      min-width: 70px;
      padding: 0.4rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      background: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};

      transition: all 0.2s ease;
      font-size: 0.85rem;
      font-weight: 400;

      &:disabled {
        background: ${({ theme }) => theme.lowOpacity};
        color: ${({ theme }) => theme.buttonMed};
        box-shadow: none;
        cursor: default;
      }

      &.stop {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.accent};
      }
    }
  }
`
