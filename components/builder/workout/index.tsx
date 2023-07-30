import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";

import ExerciseList from "../../Shared/ExerciseList/ExerciseList";
import UserWorkouts from "./UserWorkouts";
import CustomWorkout from "./CustomWorkout";
import ControlsBar from "./ControlsBar";
import AddExerciseBtn from "../../Shared/AddExerciseBtn";
import { Exercise, Workout, Set } from "../../../types";
import { moveItemInArray } from "../../../utils";

export const InitialCustomWorkout: Workout = {
  _id: "",
  name: "",
  creator_id: "",
  creatorName: "",
  exercises: [],
  isPublic: false,
  date_created: "",
  numLogged: 0,
  muscleGroups: [],
};

const WorkoutBuilder: React.FC = () => {
  const [isExerciseListOpen, setIsExerciseListOpen] = useState(false);
  const [customWorkout, setCustomWorkout] = useState<Workout>(InitialCustomWorkout);

  // Resets custom workout state
  const clearCustomWorkout = () => setCustomWorkout(InitialCustomWorkout);

  // Returns boolean for whether or not an exercise exists in customWorkoutExercises
  const isExerciseInCustomWorkout = (exercise: Exercise) => {
    const { exercises } = customWorkout;
    return !!exercises.find((item) => item.exercise_id === exercise._id);
  };

  // Adds NEW exercises to the end of the customWorkout.exercises
  const addExercise = (exercise: Exercise) => {
    // Exercise cannot already be in the customWorkout
    if (!isExerciseInCustomWorkout(exercise)) {
      let firstSet: Set;

      switch (exercise.metric) {
        case "weight":
          firstSet = { reps: 0, weight: -1, type: "1" };
          break;
        case "time":
          firstSet = { duration: 0, startedAt: 0, ongoing: false, type: "1" };
          break;
        case "distance":
          firstSet = { distance: 0, unit: "mi", type: "1" };
          break;
      }

      setCustomWorkout((prev) => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            exercise: exercise,
            exercise_id: exercise._id,
            metric: exercise.metric,
            sets: [firstSet],
          },
        ],
      }));
    }
  };

  // Removes an exercise from customWorkout.exercises
  const removeExercise = (exercise_id: string) => {
    const { exercises } = customWorkout;
    const filteredArr = exercises.filter((each) => each.exercise_id !== exercise_id);

    setCustomWorkout((prev) => {
      return { ...prev, exercises: filteredArr };
    });
  };

  const handleDragDropEnd = (result: any) => {
    const startIndex: number = result.source?.index;
    const endIndex: number = result.destination?.index > -1 ? result.destination.index : startIndex;

    if (startIndex === endIndex) return;

    setCustomWorkout((prev) => ({
      ...prev,
      exercises: moveItemInArray(prev.exercises, startIndex, endIndex),
    }));
  };

  return (
    <>
      <ControlsBar
        customWorkout={customWorkout}
        setCustomWorkout={setCustomWorkout}
        clearCustomWorkout={clearCustomWorkout}
      />

      <DragDropContext onDragEnd={handleDragDropEnd}>
        <CustomWorkout
          customWorkout={customWorkout}
          setCustomWorkout={setCustomWorkout}
          removeExercise={removeExercise}
        />
      </DragDropContext>

      <AddExerciseBtn onClick={() => setIsExerciseListOpen((prev) => !prev)} />

      <UserWorkouts
        customWorkout={customWorkout}
        clearCustomWorkout={clearCustomWorkout}
        setCustomWorkout={setCustomWorkout}
      />

      <ExerciseList
        isExerciseSelected={isExerciseInCustomWorkout}
        onExerciseSelect={addExercise}
        onExerciseDeselect={(exercise) => removeExercise(exercise._id)}
        isOpen={isExerciseListOpen}
        setIsOpen={setIsExerciseListOpen}
      />
    </>
  );
};
export default WorkoutBuilder;
