import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
// Context
import { useUserState } from "../../../store";
import { useUserRoutines } from "../../../api-lib/controllers";
// Interfaces
import { Routine } from "../../../types";
// Components
import DeleteRoutineModal from "./DeleteRoutineModal";
import TiledList from "../../Shared/TiledList";

interface Props {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  clearRoutine: () => void;
}

const UserRoutines: React.FC<Props> = ({ routine, setRoutine, clearRoutine }) => {
  const { user } = useUserState();
  const router = useRouter();

  const { data: routines } = useUserRoutines(user);

  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [hasQueriedUrl, setHasQueriedUrl] = useState(false);

  // If url has query for specific routine, set that routine
  useEffect(() => {
    const queriedRoutine_id = router.query.routine as string;
    if (queriedRoutine_id && routines && !hasQueriedUrl) {
      const queried = routines.find((each) => each._id === queriedRoutine_id);
      if (queried) setRoutine(queried);
      setHasQueriedUrl(true);
    }
  }, [routines]);

  return (
    <>
      {routineToDelete && (
        <DeleteRoutineModal
          routine={routineToDelete}
          setRoutineToDelete={setRoutineToDelete}
          clearRoutine={clearRoutine}
        />
      )}

      <div className="tile">
        <TiledList
          title="My Routines"
          showExpand={true}
          listName="created-routines"
          items={routines || undefined}
          onItemClick={(routine) => setRoutine(routine)}
          displayProp="name"
          isHighlighted={(routineItem) => routine._id === routineItem._id}
          onDeleteClick={(routine) => setRoutineToDelete(routine)}
          keyProp="_id"
        />
      </div>
    </>
  );
};

export default UserRoutines;
