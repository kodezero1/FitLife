import Link from 'next/link'
import React, { useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import styled from 'styled-components'
import { HomepageText } from '../../pages'
import { WorkoutLogItem } from '../../types'
import { formatWorkoutLogDate } from '../../utils'
import ExerciseBox from '../workoutLog/logItem/ExerciseBox'

type Props = {}

const ExampleExercise = (props: Props) => {
  const [currentLogItem, setCurrentLogItem] = useState<WorkoutLogItem>(ExampleLogItem)

  return (
    <Container>
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="workout" direction="vertical">
          {(provided) => (
            <div className="example-exercise-wrapper">
              <div className="example-exercise-inner-border" {...provided.droppableProps} ref={provided.innerRef}>
                <div className="example-exercise-inner">
                  {currentLogItem.exerciseData.map((exerciseData, i) => (
                    <ExerciseBox
                      key={exerciseData.exercise_id}
                      selectedDate={formatWorkoutLogDate()}
                      exerciseData={exerciseData}
                      exerciseIndex={i}
                      removeExercise={() => {}}
                      setExerciseInfo={() => {}}
                      exerciseHistory={[]}
                      showChartButton={true}
                      currentWorkoutLogItem={currentLogItem}
                      debounceSave={(updatedLogItem) => setCurrentLogItem(updatedLogItem)}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="example-exercise-text-wrapper">
        <HomepageText>
          <div className="visible-text">
            <h2 className="heading-gradient marg">The Focus</h2>
            <p>A workout log allows you to track individual exercises</p>
            <br />
            <p>
              You get complete customization, without having to look for it, with easy swipe interactions to make your
              workouts better and more informed
            </p>
          </div>

          <div className="hidden-text">
            <span className="hidden-text-spacer-lg" />

            <p>Oh...you&apos;re still going...</p>

            <span className="hidden-text-spacer-lg" />

            <p>I see you&apos;re a curious one...</p>

            <span className="hidden-text-spacer-lg" />

            <p>There&apos;s no way you&apos;re doing 30+ sets, but I admire the optimism</p>

            <span className="hidden-text-spacer-lg" />

            <p>You&apos;re looking for more, huh? I like that</p>

            <span className="hidden-text-spacer-md" />
            <p>I suppose we can start with a quick introduction</p>
            <br />
            <br />
            <p>
              My name is Christian and as I&apos;m sure you may have guessed, I&apos;m a big fan of lifting and I am the
              one responsible for what you have before you
            </p>
            <br />
            <p>
              I started building Lift Club in April of 2021 because my cousin and I were lazy and didn&apos;t want to
              spend five minutes handwriting every rep and weight for every exercise on every workout every day
            </p>
            <br />
            <p>
              We wanted to simply walk into the gym and know what to do right away - sets, reps, weights, everything
            </p>
            <br />
            <p>
              Meanwhile, my workout guru uncle, inspired by the great{' '}
              <Link href="article/vince-gironda">Vince Gironda</Link>, wanted to train us with Vince&apos;s methods just
              as he had been taught when he was in his 20s
            </p>
            <br />
            <p>
              The only request he had was for us to keep note of our workouts so that we didn&apos;t forget what to do
              and so we could see the progress from where we started
            </p>
            <br />
            <p>With those desires in mind, Lift Club came into existance and I hope it is of some use to you</p>
            <br />
            <p>
              If you like what you see and have ideas of how to make it better, you can do so{' '}
              <a href="https://github.com/ChristianAnagnostou/liftclub" target={'_blank'} rel="noreferrer">
                here on github
              </a>
            </p>
            <span className="hidden-text-spacer-sm" />
            <p>
              Regardless of whether or not you record your workouts with Lift Club, make sure you keep working out and
              pushing yourself
            </p>
            <br />
            <p>One&apos;s greatest obligation is to continuously strive to be better & stronger</p>
            <span className="hidden-text-spacer-lg" />
            <span className="hidden-text-spacer-lg" />
            <p>Thanks for visiting</p>
            <p>You&apos;re the GOAT</p>
          </div>
        </HomepageText>
      </div>
    </Container>
  )
}

export default ExampleExercise

const Container = styled.section`
  max-width: var(--max-w-screen);
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 10rem auto;
  border-radius: 10px;
  padding: 1rem;

  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.medOpacity};

  .example-exercise-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    width: 100%;

    .example-exercise-inner-border {
      width: 100%;
      height: fit-content;
      max-width: 350px;
      padding: 1px;
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      box-shadow: 0 3px 8px 2px ${({ theme }) => theme.boxShadow};

      &::before {
        content: '';
        position: absolute;
        pointer-events: none;
        left: 50%;
        top: 50%;
        transform: rotate(-45deg) translate(-50%, -50%);
        transform-origin: top left;
        background-image: linear-gradient(
          to right,
          ${({ theme }) => theme.boxShadow},
          ${({ theme }) => theme.body},
          ${({ theme }) => theme.buttonMed} 45%,
          ${({ theme }) => theme.defaultAccent},
          ${({ theme }) => theme.buttonMed} 55%,
          ${({ theme }) => theme.body},
          ${({ theme }) => theme.boxShadow}
        );
        background-size: 200%;
        aspect-ratio: 1;
        min-height: 430px;
        height: 150%;
        z-index: -1;
        -webkit-animation: glower 6s linear infinite;
        animation: glower 6s linear infinite;
        will-change: background-position;
      }

      @keyframes glower {
        0% {
          background-position: 0 0;
        }

        100% {
          background-position: 200% 0;
        }
      }

      .example-exercise-inner {
        background: ${({ theme }) => theme.background};
        padding: 0 0.2rem;
        border-radius: 5px;
        height: min-content;
        display: flex;
        justify-content: center;
        align-items: center;

        .ExerciseBox {
          margin: 0.5rem 0 0.2rem;
        }
      }
    }
  }

  .example-exercise-text-wrapper {
    flex: 1;

    .hidden-text {
      display: none;
      padding-right: 2rem;

      a {
        text-decoration: solid underline ${({ theme }) => theme.defaultAccent} 2px;
        text-underline-offset: 3px;
      }

      .hidden-text-spacer-lg {
        display: block;
        height: 500px;
      }
      .hidden-text-spacer-md {
        display: block;
        height: 400px;
      }
      .hidden-text-spacer-sm {
        display: block;
        height: 100px;
      }

      .hidden-remains {
        span:nth-child(1) {
          top: 65px;
          left: 10px;
        }
        span:nth-child(2) {
          left: 115px;
          top: 125px;
        }
        span:nth-child(3) {
          bottom: 50px;
          left: 125px;
        }
      }
    }
  }
  
  @media screen and (min-width: 1024px) {
    .marg {
      margin-top: 2px;
    }
  }

  @media screen and (min-width: 1024px) {
    flex-direction: row;
    padding: 4rem 1rem;

    .example-exercise-wrapper {
      margin-top: 0;
      margin-right: 3rem;
      flex: 0.8;
    }

    .example-exercise-text-wrapper {
      padding: 3rem 0;
      align-self: normal;

      .hidden-text {
        display: block;
        position: absolute;
      }
    }
  }

  @media screen and (max-width: 768px) {
    padding-top: 0.5rem;
    margin: 5rem 0;

    .visible-text p {
      font-size: 1.1rem;
      line-height: 1.7rem;
    }
  }
`

const ExampleLogItem: WorkoutLogItem = {
  completed: false,
  exerciseData: [
    {
      metric: 'weight',
      exercise_id: '628f989222a63e00095b9599',
      sets: [
        { reps: '12', weight: -1, type: '1' },
        { reps: '10', weight: -1, type: '1' },
        { reps: '10', weight: -1, type: '1' },
        { reps: '8', weight: -1, type: '1' },
      ],
      exercise: {
        _id: '628f989222a63e00095b9599',
        name: 'Lateral Raise',
        equipment: 'Dumbbell or Pully',
        muscleGroup: 'shoulder',
        muscleWorked: 'Delt',
        metric: 'weight',
        creator_id: '6078d91dba02360006e07555',
        public: true,
      },
    },
  ],
  workoutName: 'Example Workout',
  workoutNote: 'Example Note',
}
