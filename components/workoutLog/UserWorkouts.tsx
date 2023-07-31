import styled from "styled-components";

// Interfaces
import { Workout } from "../../types";
import TiledList from "../Shared/TiledList";

interface Props {
  searchTerm?: string;
  displayPremadeWorkout: (clicked: Workout) => void;
  copyPreviousLogItem: (date: string) => void;
  quickStartWorkouts: {
    recent: { workoutName: string; date: string }[];
    created: Workout[];
    saved: Workout[];
  };
}

const UserWorkouts: React.FC<Props> = ({
  searchTerm,
  displayPremadeWorkout,
  copyPreviousLogItem,
  quickStartWorkouts,
}) => {
  return (
    <>
      <WorkoutsList>
        <TiledList
          searchTerm={searchTerm}
          showExpand={true}
          listName="recent"
          items={quickStartWorkouts.recent}
          onItemClick={(workout) => copyPreviousLogItem(workout.date)}
          displayProp={"workoutName"}
          keyProp={"workoutName"}
          title="Recent"
          searchProps={["workoutName"]}
        />
      </WorkoutsList>

      <WorkoutsList>
        <TiledList
          searchTerm={searchTerm}
          showExpand={true}
          listName="saved"
          items={quickStartWorkouts.saved}
          onItemClick={(workout) => displayPremadeWorkout(workout)}
          displayProp={"name"}
          keyProp={"_id"}
          title="Saved"
          searchProps={[
            "creatorName",
            "name",
            (workout: Workout) => workout.muscleGroups.map(([groupName]) => groupName),
          ]}
        />
      </WorkoutsList>

      <WorkoutsList>
        <TiledList
          searchTerm={searchTerm}
          showExpand={true}
          listName="created"
          items={quickStartWorkouts.created}
          onItemClick={(workout) => displayPremadeWorkout(workout)}
          displayProp={"name"}
          keyProp={"_id"}
          title="My Workouts"
          searchProps={[
            "creatorName",
            "name",
            (workout: Workout) => workout.muscleGroups.map(([groupName]) => groupName),
          ]}
        />
      </WorkoutsList>
    </>
  );
};
export default UserWorkouts;

const WorkoutsList = styled.div`
  margin: 0.5rem 0 1rem;
  width: calc(100% + 1rem);
  margin-left: -0.5rem;
  h3 {
    padding-left: 0.5rem;
  }
  ul {
    padding: 0.25rem 0.5rem;
  }
`;
