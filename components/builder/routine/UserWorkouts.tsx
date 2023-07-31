// Context
import { getSavedWorkouts, getUserMadeWorkouts } from "../../../api-lib/controllers";
import { useUserState } from "../../../store";
// Interfaces
import { Workout, Routine } from "../../../types";
// Components
import TiledList from "../../Shared/TiledList";

interface Props {
  selectedDaysFromPlan: Routine["workoutPlan"];
  addWorkoutToDatesSelected: (workout: Workout) => void;
}

const UserWorkouts: React.FC<Props> = ({ selectedDaysFromPlan, addWorkoutToDatesSelected }) => {
  const { user } = useUserState();

  const { data: created } = getUserMadeWorkouts(user);
  const { data: saved } = getSavedWorkouts(user);

  return (
    <>
      <div className="tile">
        <TiledList
          title="My Workouts"
          showExpand={true}
          listName="created"
          items={created}
          onItemClick={(workout) => addWorkoutToDatesSelected(workout)}
          displayProp="name"
          isHighlighted={(workout) =>
            Boolean(selectedDaysFromPlan.filter((day) => day.workout_id === workout._id).length)
          }
          keyProp="_id"
        />

        <TiledList
          title="Saved Workouts"
          showExpand={true}
          listName="saved"
          items={saved}
          onItemClick={(workout) => addWorkoutToDatesSelected(workout)}
          displayProp="name"
          isHighlighted={(workout) =>
            Boolean(selectedDaysFromPlan.filter((day) => day.workout_id === workout._id).length)
          }
          keyProp="_id"
        />
      </div>
    </>
  );
};
export default UserWorkouts;
