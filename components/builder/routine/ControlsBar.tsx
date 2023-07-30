import React, { useEffect, useState } from "react";
// Context
import { useUserState } from "../../../store";
import { useCreateRoutine, useUpdateRoutine } from "../../../api-lib/controllers";
import { useQueryClient } from "react-query";
// Interfaces
import { Routine } from "../../../types";
// Components
import { BuilderControlBarStyles, BuilderControlButtons } from "../workout/ControlsBar";
import Checkmark from "../../Checkmark";

interface Props {
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  routine: Routine;
  clearRoutine: () => void;
}

const ControlsBar: React.FC<Props> = ({ setRoutine, routine, clearRoutine }) => {
  const { user } = useUserState();
  const queryClient = useQueryClient();

  const [showSaveNotification, setShowSaveNotification] = useState<null | boolean>(null);

  const onSaveSuccess = () => {
    setShowSaveNotification(false);
    setShowSaveNotification(true);
    clearRoutine();
  };

  const { mutate: updateRoutine } = useUpdateRoutine(queryClient, {
    onSuccess: onSaveSuccess,
  });
  const { mutate: createRoutine } = useCreateRoutine(queryClient, {
    onSuccess: onSaveSuccess,
  });

  const saveRoutine = async () => {
    if (!user) return;
    routine._id ? updateRoutine({ routine }) : createRoutine({ routine, user });
  };

  const handleRoutineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoutine((prev) => ({ ...prev, name: e.target.value }));
  };

  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;
    if (showSaveNotification) resetTimeout = setTimeout(() => setShowSaveNotification(null), 2000);
    return () => clearTimeout(resetTimeout);
  }, [showSaveNotification]);

  return (
    <BuilderControlBarStyles className="tile">
      <div className="input-wrapper">
        <label htmlFor="workoutName">Routine Name</label>
        <input
          type="text"
          name="routineName"
          value={routine.name}
          onChange={handleRoutineNameChange}
        />
      </div>

      <BuilderControlButtons>
        <button onClick={saveRoutine} disabled={!Boolean(routine.workoutPlan.length)}>
          {showSaveNotification && !Boolean(routine.workoutPlan.length) ? (
            <Checkmark styles={{ height: "1.75rem", width: "1.75rem" }} />
          ) : (
            "Save Routine"
          )}
        </button>

        <button
          onClick={clearRoutine}
          disabled={!Boolean(routine.name.length) && !Boolean(routine.workoutPlan.length)}
        >
          Clear All
        </button>
      </BuilderControlButtons>
    </BuilderControlBarStyles>
  );
};
export default ControlsBar;
