import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Exercise } from "../../../types";
import Modal from "../../Shared/Modal";
import useMuscleGroupIcons from "../../hooks/useMuscleGroupIcons";
import { useUserState } from "../../../store";
import ProgressChart from "../../Shared/ProgressChart";

interface Props {
  exerciseInfo: Exercise;
  setExerciseInfo: React.Dispatch<React.SetStateAction<Exercise | undefined>>;
}

const ExerciseInfoModal: React.FC<Props> = ({ exerciseInfo, setExerciseInfo }) => {
  const router = useRouter();
  const muscleGroupIcons = useMuscleGroupIcons(50);
  const { user } = useUserState();

  const [hasMounted, setHasMounted] = useState(false);

  const closeModal = () => {
    setExerciseInfo(undefined);
  };

  useEffect(() => {
    hasMounted ? closeModal() : setHasMounted(true);
  }, [router.query.date]);

  return (
    <Modal isOpen={exerciseInfo} removeModal={closeModal}>
      <ExerciseInfo>
        <button className="close-btn" onClick={closeModal}>
          ✕
        </button>

        <h3>{exerciseInfo.name}</h3>

        <div className="info">
          {muscleGroupIcons[exerciseInfo.muscleGroup] && (
            <div className="icon">{muscleGroupIcons[exerciseInfo.muscleGroup]}</div>
          )}

          <div>
            <div className="text">
              <span>Muscle: </span>
              <p>{exerciseInfo.muscleWorked}</p>
            </div>

            <div className="text">
              <span>Equipment: </span>
              <p>{exerciseInfo.equipment}</p>
            </div>
          </div>
        </div>

        {user && (
          <ProgressChart
            profile={user}
            exercise={exerciseInfo}
            showSearch={false}
            showTitle={false}
            showDateQuery={true}
          />
        )}
      </ExerciseInfo>
    </Modal>
  );
};

export default ExerciseInfoModal;

const ExerciseInfo = styled.div`
  position: relative;
  width: 95%;
  margin: 5vh auto 0;
  max-width: 400px;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 0 15px 10px ${({ theme }) => theme.boxShadow};
  border-radius: 10px;
  padding-top: 1.5rem;

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

  .title {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }

  h3 {
    font-weight: 400;
    font-size: 1.75rem;
    margin-left: 1rem;
    text-transform: capitalize;
    text-align: left;
  }

  .info {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 0.5rem 1rem;

    .text {
      text-align: left;
      padding-bottom: 0.25rem;
      display: flex;
      align-items: start;
      flex: 1;

      span {
        margin-top: 0.25rem;
        font-weight: 300;
        font-size: 0.75rem;
        color: ${({ theme }) => theme.textLight};
      }
      p {
        margin-left: 0.5rem;
        text-transform: capitalize;
      }
    }

    .icon {
      border-radius: 50%;
      overflow: hidden;
      height: 50px;
      width: 50px;
      min-width: 50px;
      margin-right: 0.5rem;
      object-fit: contain;
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
    }
  }
`;
