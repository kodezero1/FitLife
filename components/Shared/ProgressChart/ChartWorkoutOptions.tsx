import React, { useEffect, useState } from "react";
// Utils
import { getExercisesFromIdArray, getWorkoutsFromIdArray } from "../../../api-lib/fetchers";
// Interfaces
import { Exercise, Workout, WorkoutLog } from "../../../types";
import styled from "styled-components";

interface Props {
  workoutLog: WorkoutLog;
  searchTerm: string;
  selectedExerciseId: string;
  selectedWorkoutId: string;
  setSelectedWorkoutId: React.Dispatch<React.SetStateAction<string>>;
  handleExerciseClick: (exercise: Exercise, workout?: Workout) => void;
}

const ChartWorkoutOptions: React.FC<Props> = ({
  workoutLog,
  searchTerm,
  selectedExerciseId,
  selectedWorkoutId,
  setSelectedWorkoutId,
  handleExerciseClick,
}) => {
  const [workoutOptions, setWorkoutOptions] = useState<Workout[]>([]); // Used in WorkoutSelect
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState<Exercise[]>([]); // Used in ExerciseSelect

  /**
   * 1. Set workout options to workouts that the profile has logged
   */
  useEffect(() => {
    if (workoutLog) getWorkoutOptions();
  }, [workoutLog]);

  const getWorkoutOptions = async () => {
    const keyArr = Object.keys(workoutLog);
    const idArr: string[] = [];
    keyArr.forEach((key) => {
      if (workoutLog[key].workout_id) idArr.push(workoutLog[key].workout_id!);
    });
    // Returns all unique workouts
    const workouts = await getWorkoutsFromIdArray(idArr);
    setWorkoutOptions(workouts);
  };

  const handleWorkoutOptionChange = async (workout: Workout) => {
    if (workout._id === selectedWorkoutId) {
      setSelectedWorkoutId("");
      setSelectedWorkoutExercises([]);
    } else {
      setSelectedWorkoutId(workout._id);
      const idArr = workout.exercises.map(({ exercise_id }) => exercise_id);
      const exercises = await getExercisesFromIdArray(idArr);
      setSelectedWorkoutExercises(exercises);
    }
  };

  return (
    <>
      {workoutOptions
        .filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((workout) => (
          <WorkoutOption
            key={workout.name}
            className={`option ${selectedWorkoutId === workout._id && "selected"}`}
          >
            <div className="name" onClick={() => handleWorkoutOptionChange(workout)}>
              <p>{workout.name}</p>

              <div className="arrow">
                <span />
                <span />
              </div>
            </div>

            {selectedWorkoutId === workout._id &&
              selectedWorkoutExercises.map((exercise) => (
                <li
                  key={exercise.name + "-in-" + workout._id}
                  onClick={() => handleExerciseClick(exercise, workout)}
                  className={`option indented ${
                    selectedExerciseId === exercise._id && "highlight"
                  }`}
                >
                  <p className="button-press">◦ {exercise.name}</p>
                </li>
              ))}
          </WorkoutOption>
        ))}
    </>
  );
};

export default ChartWorkoutOptions;

const WorkoutOption = styled.ul`
  .name {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      font-weight: 300;
    }
    .arrow {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      -webkit-transform: translateZ(0) scale(1, 1);
      transform: translateZ(0) scale(1, 1);

      width: 0.85rem;
      height: 1.2rem;
      display: inline-block;
      position: relative;
      margin: 0 1rem;

      span {
        top: 0.5rem;
        position: absolute;
        width: 0.55rem;
        height: 0.1rem;
        background-color: ${({ theme }) => theme.textLight};
        display: inline-block;
        transition: all 0.2s ease;

        &:first-of-type {
          left: 0;
          transform: rotate(45deg);
        }

        &:last-of-type {
          right: 0;
          transform: rotate(-45deg);
        }
      }
    }
  }
  &.selected {
    .arrow {
      span {
        &:first-of-type {
          transform: rotate(-45deg);
        }

        &:last-of-type {
          transform: rotate(45deg);
        }
      }
    }
  }

  .indented {
    margin-right: 1rem;
  }
`;
