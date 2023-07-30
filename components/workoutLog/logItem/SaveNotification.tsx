import React from "react";
import styled from "styled-components";
import Checkmark from "../../Checkmark";

interface Props {
  saveLoading: boolean;
}

const SaveNotification: React.FC<Props> = ({ saveLoading }) => {
  return (
    <Bubble className={saveLoading ? "" : "saved"}>
      {saveLoading ? (
        <LoadingDots />
      ) : (
        <div className="checkmarkContainer">
          <Checkmark />
        </div>
      )}
    </Bubble>
  );
};
export default SaveNotification;

const Bubble = styled.div`
  width: 65px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 6rem;
  z-index: 10000;
  right: 1rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.buttonMedGradient};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
  transition: all 0.3s ease;
  animation: slideUp 0.3s ease forwards;

  &.saved {
    right: calc(1rem + 12.5px);
    bottom: calc(6rem - 2.5px);
    border-radius: 50%;
    width: 35px;
    height: 35px;
  }

  .checkmarkContainer {
    width: 35px;
    height: 35px;
    display: grid;
    place-items: center;
    opacity: 0;
    animation: fadeIn 0.3s linear forwards;

    > * {
      height: 28px !important;
      width: 28px !important;
    }

    @keyframes fadeIn {
      100% {
        opacity: 1;
      }
    }
  }
`;

const LoadingDots = styled.div`
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accent};
  animation: dotFlashing 0.65s infinite linear alternate;
  animation-delay: 0.3s;

  &::before,
  &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  &::before {
    left: -17px;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
    animation: dotFlashing 0.65s infinite alternate;
    animation-delay: 0.1s;
  }

  &::after {
    left: 17px;
    width: 12px;
    height: 12px;
    border-radius: 5px;
    background-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
    animation: dotFlashing 0.65s infinite alternate;
    animation-delay: 0.45s;
  }

  @keyframes dotFlashing {
    0% {
      background-color: ${({ theme }) => theme.accent};
    }
    50%,
    100% {
      background-color: ${({ theme }) => theme.buttonLight};
    }
  }
`;
