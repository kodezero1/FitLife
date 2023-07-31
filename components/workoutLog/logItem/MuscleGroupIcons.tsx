import React from "react";
import styled from "styled-components";
import { Exercise } from "../../../types";
import useMuscleGroupIcons from "../../hooks/useMuscleGroupIcons";

type Props = {
  muscleGroups: [Exercise["muscleGroup"], { count: number; exerciseIds: string[] }][];
};

const MuscleGroupIcons = ({ muscleGroups }: Props) => {
  const muscleGroupIcons = useMuscleGroupIcons();

  return (
    <Container>
      <h4>Muscles</h4>
      <ul className="muscle-groups">
        {muscleGroups.map(([muscleGroup, data], i) => (
          <div className="muscle" key={muscleGroup} style={{ animationDelay: i / 15 + "s" }}>
            <p>{data.count}</p>
            <span className="x-icon">✕</span>
            <span className="muscle-icon">{muscleGroupIcons[muscleGroup]}</span>
          </div>
        ))}
      </ul>
    </Container>
  );
};

export default MuscleGroupIcons;

const Container = styled.div`
  h4 {
    font-weight: 300;
    padding-left: 0.5rem;
    padding-bottom: 0.25rem;
    text-align: left;
  }

  .muscle-groups {
    display: flex;
    flex-wrap: wrap;
    min-height: 2.75rem;
    margin-left: 0.5rem;

    .muscle {
      display: flex;
      align-items: center;
      min-width: max-content;
      margin-right: 0.3rem;
      margin-bottom: 0.3rem;
      padding: 0.2rem 0.2rem 0.2rem 0.4rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.darkBg};
      opacity: 0;
      animation: fadeIn 0.5s forwards;

      p {
        color: ${({ theme }) => theme.text};
        font-weight: 300;
        text-transform: capitalize;
      }

      .x-icon {
        color: ${({ theme }) => theme.textLight};
        font-size: 0.6rem;
        margin: 0 0.2rem;
      }
      .muscle-icon {
        max-height: 100%;
        display: grid;
        place-items: center;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          max-width: 100%;
          object-fit: cover;
        }
      }
    }
  }
`;
