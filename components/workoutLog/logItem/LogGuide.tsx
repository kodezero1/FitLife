import React, { useState } from "react";
import styled from "styled-components";
import { ArticleType } from "../../../api-lib/articles";
import { ArticleStyle } from "../../../pages/article/[slug]";
import Help from "../../svg/Help";

import Modal from "../../Shared/Modal";

type Props = { logGuide: ArticleType["content"] };

const LogGuide = ({ logGuide }: Props) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <button
        type="button"
        className="nav-btn small-btn"
        onClick={() => setShowGuide(!showGuide)}
        aria-label="View log guide"
      >
        <Help />
      </button>

      {showGuide && (
        <Modal removeModal={() => setShowGuide(false)} isOpen={showGuide}>
          <Guide>
            <button className="close-btn" onClick={() => setShowGuide(false)}>
              ✕
            </button>

            <h3 className="title">Workout Log Guide</h3>

            <div className="content" dangerouslySetInnerHTML={{ __html: logGuide }} />
          </Guide>
        </Modal>
      )}
    </>
  );
};

export default LogGuide;

const Guide = styled(ArticleStyle)`
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
