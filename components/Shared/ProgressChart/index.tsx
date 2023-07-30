import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
// Components
import Chart from './Chart'
import ChartOptions from './ChartOptions'
import ExerciseStats from './ExerciseStats'
import ChartExerciseOptions from './ChartExerciseOptions'
import ChartWorkoutOptions from './ChartWorkoutOptions'
import TextInput from '../TextInput'
// Utils
import {
  round,
  groupWorkoutLogByExercise,
  formatSetRepsAndWeight,
  formatMilliseconds,
  formatWorkoutLogDate,
} from '../../../utils'
// Interfaces
import { Exercise, User, WeightSet, TimeSet, Workout } from '../../../types'

export type ChartData = {
  date: string
  weight?: number
  timeString?: string
  timeMs?: number
}[]

interface Props {
  profile: User
  exercise?: Exercise
  showSearch?: boolean
  showTitle?: boolean
  showDateQuery?: boolean
}

const ProgressTile: React.FC<Props> = ({
  profile,
  exercise,
  showSearch = true,
  showTitle = true,
  showDateQuery = false,
}) => {
  const router = useRouter()

  const exerciseMap = groupWorkoutLogByExercise(profile.workoutLog)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExercise, setSelectedExercise] = useState<Exercise>()
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')
  const [chartData, setChartData] = useState<ChartData>([])
  const [statOption, setStatOption] = useState<'avg' | 'total' | 'max'>('avg')
  const [ignoreZeroWeight, setIgnore0InChart] = useState(false)
  const [exerciseMetric, setExerciseMetric] = useState<Exercise['metric']>('weight')
  const [selectedDate, setSelectedDate] = useState('')

  const getAvgWeight = useMemo(
    () => (sets: WeightSet[]) =>
      round(
        sets.reduce((acc, curr) => acc + formatSetRepsAndWeight(curr.weight) * formatSetRepsAndWeight(curr.reps), 0) /
          sets.reduce((acc, curr) => acc + formatSetRepsAndWeight(curr.reps), 0),
        1 // rounding precision
      ) || 0, // default weight if no weight has been entered
    []
  )

  const getTotalWeight = useMemo(
    () => (sets: WeightSet[]) =>
      sets.reduce((acc, curr) => acc + formatSetRepsAndWeight(curr.weight) * formatSetRepsAndWeight(curr.reps) || 0, 0),
    []
  )

  const getMaxWeight = useMemo(
    () => (sets: WeightSet[]) => Math.max(0, ...sets.map((a) => formatSetRepsAndWeight(a.weight))),
    []
  )

  const getAvgTime = useMemo(
    () => (sets: TimeSet[]) => sets.reduce((acc, curr) => acc + curr.duration, 0) / sets.length,
    []
  )

  const getTotalTime = useMemo(() => (sets: TimeSet[]) => sets.reduce((acc, curr) => acc + curr.duration, 0), [])

  const getMaxTime = useMemo(() => (sets: TimeSet[]) => Math.max(0, ...sets.map((a) => a.duration)), [])

  const chartExercise = (exercise_id: string, workout_id?: string) => {
    const exerciseHistory = exerciseMap.get(exercise_id)
    if (!exerciseHistory) return

    setSelectedWorkoutId(workout_id || '')
    setSelectedExerciseId(exerciseHistory[0].exercise_id)
    setExerciseMetric(exerciseHistory[0].metric)

    // Data to send as prop to chart component
    const exerciseChartData: ChartData = []

    // Format date for X axis labels
    const formatDate = (isoDate: string) => {
      const date = dayjs(isoDate.replace(/-/g, '/'))
      return date.format('MMM D, YY')
    }

    exerciseHistory.forEach(({ date, sets, metric }) => {
      if (metric === 'weight') {
        let displayWeight = 0

        switch (statOption) {
          case 'avg':
            displayWeight = getAvgWeight(sets as WeightSet[])
            break
          case 'total':
            displayWeight = getTotalWeight(sets as WeightSet[])
            break
          case 'max':
            displayWeight = getMaxWeight(sets as WeightSet[])
            break
        }

        exerciseChartData.unshift({
          date: formatDate(date),
          weight: displayWeight,
        })
      } else if (metric === 'time') {
        let displayTime = 0

        switch (statOption) {
          case 'avg':
            displayTime = getAvgTime(sets as TimeSet[])
            break
          case 'total':
            displayTime = getTotalTime(sets as TimeSet[])
            break
          case 'max':
            displayTime = getMaxTime(sets as TimeSet[])
            break
        }

        exerciseChartData.unshift({
          date: formatDate(date),
          timeString: formatMilliseconds(displayTime),
          timeMs: displayTime,
        })
      } else if (metric === 'distance') {
      }
    })

    ignoreZeroWeight
      ? setChartData(exerciseChartData.filter(({ weight, timeMs }) => weight || timeMs))
      : setChartData(exerciseChartData)
  }

  const handleExerciseClick = (exercise: Exercise, workout?: Workout) => {
    chartExercise(exercise._id, workout?._id)
    setSelectedExercise(exercise)
  }

  // Trigger if the selected exercise changes or a stat option is selected
  useEffect(() => {
    if (selectedExerciseId) chartExercise(selectedExerciseId, selectedWorkoutId)
  }, [statOption, ignoreZeroWeight, profile.workoutLog])

  useEffect(() => {
    if (exercise) handleExerciseClick(exercise)
  }, [])

  return (
    <Container>
      {showTitle && <h3 className="title">Progression</h3>}

      <Collapsable style={selectedExercise ? { height: showTitle ? '475px' : '415px' } : { height: '0px' }}>
        {showTitle && (
          <ChartHeading>
            <h3 className="name">{selectedExercise?.name}</h3>
          </ChartHeading>
        )}

        <div>
          {showDateQuery && selectedDate && (
            <ViewDateButton
              type="button"
              onClick={() => router.push(`/log?date=${formatWorkoutLogDate(selectedDate)}`)}
              disabled={!selectedDate}
            >
              View {selectedDate}
            </ViewDateButton>
          )}

          <IgnoreZeroButton type="button" onClick={() => setIgnore0InChart(!ignoreZeroWeight)}>
            Ignore zero
            <input type="checkbox" name="ignore 0's" checked={ignoreZeroWeight} readOnly={true} />
          </IgnoreZeroButton>
        </div>

        <Chart
          data={chartData}
          metric={exerciseMetric}
          setSelectedDate={setSelectedDate}
          style={{
            borderTopLeftRadius: showDateQuery && selectedDate ? '0px' : '',
            borderTopRightRadius: '0px',
            borderBottomLeftRadius: statOption === 'avg' ? '0px' : '5px',
            borderBottomRightRadius: statOption === 'max' ? '0px' : '5px',
          }}
        />

        <ChartOptions setStatOption={setStatOption} statOption={statOption} />

        {selectedExercise && (
          <ExerciseStats exerciseHistory={exerciseMap.get(selectedExercise._id) || []} metric={exerciseMetric} />
        )}
      </Collapsable>

      {showSearch && (
        <>
          <TextInput
            onChange={(inputText) => setSearchTerm(inputText)}
            inputName={'exercise search'}
            placeholder={'Search an exercise or workout'}
            autoComplete={false}
          />

          <SearchResults style={searchTerm ? {} : { display: 'none' }}>
            <ChartExerciseOptions
              exerciseMap={exerciseMap}
              searchTerm={searchTerm}
              selectedExerciseId={selectedExerciseId}
              handleExerciseClick={handleExerciseClick}
            />

            <ChartWorkoutOptions
              workoutLog={profile.workoutLog}
              searchTerm={searchTerm}
              selectedExerciseId={selectedExerciseId}
              selectedWorkoutId={selectedWorkoutId}
              setSelectedWorkoutId={setSelectedWorkoutId}
              handleExerciseClick={handleExerciseClick}
            />
          </SearchResults>
        </>
      )}
    </Container>
  )
}
export default ProgressTile

const Collapsable = styled.section`
  width: 100%;
  overflow: hidden;
  transition: height 0.25s ease-out;
  transform-origin: top;
`

const ChartHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.25rem 0 0 0.5rem;

  .name {
    max-width: 100%;
    text-transform: capitalize;
    font-weight: 400;
    font-size: 1.4rem;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden;
    white-space: nowrap;
  }
`

const ChartButton = styled.button`
  border: none;
  font-size: 0.7em;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.medOpacity};
  border-radius: 5px 5px 0 0;
  padding: 0.25rem 0.4rem;
  min-width: max-content;
`
const ViewDateButton = styled(ChartButton)`
  float: left;
`
const IgnoreZeroButton = styled(ChartButton)`
  float: right;

  input[type='checkbox'] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    background-color: transparent;
    /* Not removed via appearance */
    margin: 0;
    margin-left: 0.25rem;
    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid ${({ theme }) => theme.textLight};
    border-radius: 3px;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
  }

  input[type='checkbox']::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.text};
  }

  input[type='checkbox']:checked::before {
    transform: scale(1);
  }
`

const SearchResults = styled.ul`
  margin-top: 0.25rem;
  margin: 0.25rem auto;
  max-height: 40vh;
  width: 98%;
  border-radius: 5px;
  background: ${({ theme }) => theme.medOpacity};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 3px 5px ${({ theme }) => theme.boxShadow};
  z-index: 5;
  overflow-x: hidden;
  overflow-y: scroll;

  p {
    text-transform: capitalize;
    font-weight: 300;
    transition: all 0.5s ease;
    width: fit-content;
    padding: 0.25rem;
    border-radius: 5px;
    cursor: pointer;
  }

  .option {
    margin: 0.5rem 1rem;

    &:not(:last-child) {
      padding: 0 0 0.5rem;
      border-bottom: 1px solid ${({ theme }) => theme.buttonLight};
    }

    &.highlight p {
      background: ${({ theme }) => theme.accent} !important;
      color: ${({ theme }) => theme.accentText} !important;
      border-radius: 5px;
      padding: 0.25rem 1rem;
    }
  }
`

const Container = styled.section`
  position: relative;
  width: 100%;
  padding: 0.5rem;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 0.9rem;
  }
`
