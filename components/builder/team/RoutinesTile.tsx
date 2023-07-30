import React from "react";

import { useUserRoutines } from "../../../api-lib/controllers";
import { useUserState } from "../../../store";
// Interfaces
import { Team, Routine } from "../../../types";
// Components
import TiledList from "../../Shared/TiledList";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
}
const RoutinesTile: React.FC<Props> = ({ team, setTeam }) => {
  const { user } = useUserState();
  const { data: routines } = useUserRoutines(user);

  const handleRoutineClick = (routine: Routine) => {
    setTeam({ ...team, routine_id: routine._id });
  };

  return (
    <div className="tile">
      <h3>My Routines</h3>

      <TiledList
        listName="team-routines"
        items={routines || undefined}
        onItemClick={(routine) => handleRoutineClick(routine)}
        displayProp="name"
        isHighlighted={(routineItem) => team.routine_id === routineItem._id}
        keyProp="_id"
      />
    </div>
  );
};

export default RoutinesTile;
