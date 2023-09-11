import React, { useState } from "react";
import styled from "styled-components";
import { useUserState } from "../store";
import Modal from "./Shared/Modal";
import Signature from "../public/signature.png";
import Image from "next/image";

type Props = {};

const DemoWelcome = ({}: Props) => {
  const { user } = useUserState();

  const initialModalState =
    user?.username === "Demo" && localStorage.getItem("demo-welcome") === "true";

  const [showModal, setShowModal] = useState(initialModalState);

  const closeModal = () => {
    setShowModal(false);
    localStorage.removeItem("demo-welcome");
  };

  return (
    <Modal removeModal={closeModal} isOpen={showModal}>
      <Container>
        <button className="close-btn" onClick={closeModal}>
          ✕
        </button>

        <h3 className="title">Welcome to FitSync!</h3>

        <p>
          Thanks for taking the time to check out FitSync! In this demo, you have access to all
          pages and features, but none of your progress or changes will be saved.
          <br />
          <br />
          Take a look around, and if you like what you see, join our{" "}
          <a href="https://discord.gg/a35vPjCG5r" target="_blank">
            Discord
          </a>{" "}
          or consider getting that sweet, sweet membership!
          <br />
          <br />
          Sincerely,
          <Image
            src={Signature}
            alt="Samuel Adeoluwa's Signature"
            height={60}
            className="signature"
          />
          <span className="small-text">FitSync Founder</span>
        </p>
      </Container>
    </Modal>
  );
};

export default DemoWelcome;

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

  p {
    font-size: 0.95rem;
    line-height: 1.5rem;
    margin-bottom: 0.5rem;

    a {
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-color: ${({ theme }) => theme.textLight};
    }
  }

  .signature {
    margin: 0.5rem 0 0.25rem;
    display: block;
    filter: ${({ theme }) => (theme.type === "dark" ? "brightness(1.5)" : "brightness(0.4)")};
  }

  .small-text {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
