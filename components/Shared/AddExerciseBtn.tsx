import React from "react";
import styled from "styled-components";

type Props = { onClick: () => any };

const AddExerciseBtn = ({ onClick }: Props) => {
  return (
    <BtnStyles onClick={onClick} type="button">
      <p>
        Create Exercise <span>＋</span>
      </p>
    </BtnStyles>
  );
};

export default AddExerciseBtn;

const BtnStyles = styled.button`
  background: ${({ theme }) => theme.buttonMedGradient};
  box-shadow: 0 1px 3px ${({ theme }) => theme.boxShadow},
    inset 0 0 0 1px ${({ theme }) => theme.accent};

  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 100%;
  margin: 1rem 0;
  padding: 0.75rem;
  font-weight: 300;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  span {
    font-weight: 300;
  }
`;
