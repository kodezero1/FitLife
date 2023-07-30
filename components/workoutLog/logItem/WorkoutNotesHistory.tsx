import dayjs from "dayjs";
import React, { useMemo } from "react";
import styled from "styled-components";

import { useUserState } from "../../../store";
import Modal from "../../Shared/Modal";

type Props = {
  showWorkoutNotesHistory: boolean;
  setShowWorkoutNotesHistory: (value: React.SetStateAction<boolean>) => void;
};

const WorkoutNotesHistory: React.FC<Props> = ({
  showWorkoutNotesHistory,
  setShowWorkoutNotesHistory,
}) => {
  const { user } = useUserState();

  const workoutNotes = useMemo(() => {
    if (!user) return;

    const log = user.workoutLog;
    const logData = Object.entries(log);
    const notes = logData.reduce((filtered, [date, workout]) => {
      workout.workoutNote && filtered.unshift({ date, note: workout.workoutNote });
      return filtered;
    }, [] as { date: string; note: string }[]);

    return notes;
  }, [user?.workoutLog]);

  return (
    <Modal removeModal={() => setShowWorkoutNotesHistory(false)} isOpen={showWorkoutNotesHistory}>
      <Container>
        <button className="close-btn" onClick={() => setShowWorkoutNotesHistory(false)}>
          ✕
        </button>
        <h2 className="title">Note History</h2>

        {workoutNotes
          ? workoutNotes.map(({ date, note }) => (
              <Note>
                <span>{dayjs(date).format("MMM D, YYYY")}</span>
                <p>{note}</p>
              </Note>
            ))
          : "No Notes"}
      </Container>
    </Modal>
  );
};

export default WorkoutNotesHistory;

const Container = styled.div`
  position: relative;
  width: 95%;
  margin: 10vh auto 0;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 0 15px 10px ${({ theme }) => theme.boxShadow};
  border-radius: 8px;
  padding: 0.5rem;
  text-align: left;
  scroll-behavior: smooth;
  scroll-padding-top: 1rem;

  .title {
    font-weight: 400;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.buttonMed};
  }

  .close-btn {
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 5px;
    right: 5px;
    height: 25px;
    width: 25px;
  }
`;

const Note = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding-bottom: 1rem;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.buttonMed};
  }

  span {
    color: ${({ theme }) => theme.textLight};
    font-size: 0.8em;
    margin-bottom: 0.5rem;
  }
`;
