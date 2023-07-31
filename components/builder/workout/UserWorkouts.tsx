import { useState } from "react";
// Utils
import { addExerciseDataToWorkout } from "../../../utils";
// Context
import { useUserState } from "../../../store";
// Interfaces
import { Workout } from "../../../types";
// Components
import DeleteWorkoutModal from "./DeleteWorkoutModal";
import TiledList from "../../Shared/TiledList";
import { getSavedWorkouts, getUserMadeWorkouts } from "../../../api-lib/controllers";

interface Props {
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  customWorkout: Workout;
  clearCustomWorkout: () => void;
}

const UserWorkouts: React.FC<Props> = ({ setCustomWorkout, customWorkout, clearCustomWorkout }) => {
  const { user } = useUserState();

  const { data: created } = getUserMadeWorkouts(user);
  const { data: saved } = getSavedWorkouts(user);

  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [loadingWorkoutId, setLoadingWorkoutId] = useState("");

  const displayWorkout = async (workout: Workout) => {
    setLoadingWorkoutId(workout._id);
    const mergedData = await addExerciseDataToWorkout(workout);

    if (mergedData.creator_id !== user!._id) {
      mergedData.numLogged = 0;
      mergedData.isPublic = false;
    }

    setCustomWorkout(mergedData);
    setLoadingWorkoutId("");
  };

  return (
    <>
      <div className="tile">
        <TiledList
          showExpand={true}
          title="My Workouts"
          listName="created-workouts"
          items={created}
          onItemClick={(workout) => displayWorkout(workout)}
          displayProp="name"
          isHighlighted={(workout) => customWorkout._id === workout._id}
          onDeleteClick={(workout) => setWorkoutToDelete(workout)}
          keyProp="_id"
          isLoading={(workout) => workout._id === loadingWorkoutId}
        />

        <TiledList
          showExpand={true}
          title="Saved"
          listName="saved-workouts"
          items={saved}
          onItemClick={(workout) => displayWorkout(workout)}
          displayProp="name"
          isHighlighted={(workout) => customWorkout._id === workout._id}
          keyProp="_id"
          isLoading={(workout) => workout._id === loadingWorkoutId}
        />
      </div>

      {workoutToDelete && (
        <DeleteWorkoutModal
          workout={workoutToDelete}
          setWorkoutToDelete={setWorkoutToDelete}
          clearCustomWorkout={clearCustomWorkout}
        />
      )}
    </>
  );
};
export default UserWorkouts;
