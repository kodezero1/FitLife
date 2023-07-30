import React, { useState } from "react";
import styled from "styled-components";
import { useQueryClient, useMutation } from "react-query";
// Wrapper
import Modal from "../Shared/Modal";
// Interfaces
import UploadImgToS3 from "./UploadImgToS3";
// Context
import { useUserDispatch, useUserState, saveProfileImgUrl } from "../../store";

const icons = ["default-man", "default-woman"];

interface Props {
  setShowProfileImgModal: React.Dispatch<React.SetStateAction<boolean>>;
  showProfileImgModal: boolean;
}

const ProfileImgModal: React.FC<Props> = ({ setShowProfileImgModal, showProfileImgModal }) => {
  const { user } = useUserState();
  const userDispatch = useUserDispatch();

  const [selectedDefaultIcon, setSelectedDefaultIcon] = useState("");

  const handleIconClick = (icon: string) =>
    setSelectedDefaultIcon(icon === selectedDefaultIcon ? "" : icon);

  const { mutate: saveUserIcon } = (function (selectedDefaultIcon) {
    const queryClient = useQueryClient();
    const profileImgUrl = `https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${selectedDefaultIcon}.jpg`;

    return useMutation(() => saveProfileImgUrl(userDispatch, user!._id, profileImgUrl), {
      onSuccess: () => queryClient.invalidateQueries(["user-profile", user?.username]),
    });
  })(selectedDefaultIcon);

  const handleIconFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    saveUserIcon();
  };

  return (
    <Modal removeModal={() => setShowProfileImgModal(false)} isOpen={showProfileImgModal}>
      <Box>
        <button className="close-btn" onClick={() => setShowProfileImgModal(false)}>
          ✕
        </button>

        <UploadImgToS3 />

        <DefaultIcons onSubmit={handleIconFormSubmit} action="POST">
          <h3 className="title">Default Icons</h3>
          {icons.map((icon) => (
            <Icon
              key={icon}
              onClick={() => handleIconClick(icon)}
              className={
                selectedDefaultIcon ? (selectedDefaultIcon === icon ? "selected" : "fade") : ""
              }
            >
              <img
                src={`https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${icon}.jpg`}
                alt=""
              />
            </Icon>
          ))}

          <button type="submit" disabled={!selectedDefaultIcon}>
            Save
          </button>
        </DefaultIcons>
      </Box>
    </Modal>
  );
};
export default ProfileImgModal;

const Box = styled.div`
  padding: 1rem 3rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  width: 95%;
  max-width: 420px;
  margin: 50px auto 0;

  .title {
    text-align: center;
    width: fit-content;
    margin: 0 auto 2rem;
    font-size: 1.2rem;
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

const DefaultIcons = styled.form`
  button {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 5px;
    padding: 0.25rem 1.5rem;

    font-size: 1rem;
    font-weight: 400;
    transition: all 0.3s ease;
    display: block;
    margin: 1rem auto;

    &:disabled {
      color: ${({ theme }) => theme.border};
      background: ${({ theme }) => theme.lowOpacity};
    }
  }
`;

const Icon = styled.div`
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  margin: 0 0.5rem;
  border-radius: 50%;
  overflow: hidden;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;

  &.selected {
    border: 3px solid ${({ theme }) => theme.border};
    transform: scale(1.05);
  }
  &.fade {
    opacity: 0.5;
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`;
