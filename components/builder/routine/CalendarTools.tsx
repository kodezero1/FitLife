import React from "react";
import styled from "styled-components";
// Interface
import { Routine } from "../../../types";
// Icons
import Garbage from "../../svg/Garbage";
import Stack from "../../svg/Stack";
import Copy from "../../svg/Copy";
import Bubble from "../../svg/Bubble";
import Reset from "../../svg/Reset";
import Undo from "../../svg/Undo";

interface Props {
  selectedDaysFromPlan?: Routine["workoutPlan"];
  datesSelected: { [date: string]: boolean };
  deleteWorkoutsOnSelectedDates?: () => void;
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  multiSelectMode: boolean;
  setMultiSelectMode: React.Dispatch<React.SetStateAction<boolean>>;
  showWorkoutTags: boolean;
  setShowWorkoutTags: React.Dispatch<React.SetStateAction<boolean>>;
  copyWorkoutsMode: boolean;
  setCopyWorkoutsMode: React.Dispatch<React.SetStateAction<boolean>>;
  undoRoutineStack?: Routine[];
  undoRoutine?: () => void;
}

const CalendarTools: React.FC<Props> = ({
  selectedDaysFromPlan,
  datesSelected,
  deleteWorkoutsOnSelectedDates,
  setDatesSelected,
  multiSelectMode,
  setMultiSelectMode,
  showWorkoutTags,
  setShowWorkoutTags,
  copyWorkoutsMode,
  setCopyWorkoutsMode,
  undoRoutineStack,
  undoRoutine,
}) => {
  return (
    <Tools>
      <button
        onClick={deleteWorkoutsOnSelectedDates ? () => deleteWorkoutsOnSelectedDates() : () => {}}
        className={Object.keys(selectedDaysFromPlan!).length ? "highlight" : ""}
      >
        <p>Delete</p>
        <Garbage />
      </button>

      <button onClick={undoRoutine} className={undoRoutineStack?.length ? "highlight" : ""}>
        <p>Undo</p>
        <Undo />
      </button>

      <button
        onClick={() => setCopyWorkoutsMode(!copyWorkoutsMode)}
        className={`${Object.keys(selectedDaysFromPlan!).length && "highlight"} ${
          copyWorkoutsMode && "accent"
        }`}
      >
        <p>Copy</p>
        <Copy />
      </button>

      <button
        onClick={() => setShowWorkoutTags(!showWorkoutTags)}
        className={showWorkoutTags ? "accent" : "highlight"}
      >
        <p>Show Tags</p>
        <Bubble />
      </button>

      <button
        onClick={() => setMultiSelectMode(!multiSelectMode)}
        className={multiSelectMode ? "accent" : "highlight"}
      >
        <p>Multi-select</p>
        <Stack />
      </button>

      <button
        onClick={() => {
          setDatesSelected({});
          setCopyWorkoutsMode(false);
        }}
        className={Object.keys(datesSelected).length ? "highlight" : ""}
      >
        <p>Deselect</p>
        <Reset />
      </button>
    </Tools>
  );
};

export default CalendarTools;

const Tools = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.buttonMed};

  button {
    border: none;
    min-width: 30%;
    flex: 1;
    color: ${({ theme }) => theme.textLight};
    fill: ${({ theme }) => theme.textLight};
    stroke: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
    padding: 0.5rem 0.1rem;
    margin: 0.15rem;
    border-radius: 3px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    cursor: pointer;

    p {
      margin-top: 0.15rem;
      min-width: max-content;
      flex: 2;
    }

    svg {
      transform: scale(0.9);
      flex: 1;
    }

    &.highlight {
      box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
      background: ${({ theme }) => theme.buttonMedGradient};
      color: ${({ theme }) => theme.text};
      fill: ${({ theme }) => theme.text};
      stroke: ${({ theme }) => theme.text};
    }
    &.accent {
      box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
      background: ${({ theme }) => theme.accent};
      color: ${({ theme }) => theme.accentText};
      fill: ${({ theme }) => theme.accentText};
      stroke: ${({ theme }) => theme.accentText};
    }
  }
`;
