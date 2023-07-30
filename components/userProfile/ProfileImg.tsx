import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import styled from "styled-components";
// Interfaces
import { User } from "../../types";
const ProfileImgModal = dynamic(import("./ProfileImgModal"));

interface Props {
  profileData: Omit<User, "workoutLog">;
  isProfileOwner: boolean;
}

const ProfileImg: React.FC<Props> = ({ profileData, isProfileOwner }) => {
  const [showProfileImgModal, setShowProfileImgModal] = useState(false);

  const toggleShowIconSelect = () => setShowProfileImgModal(!showProfileImgModal);

  return (
    <>
      <ProfileImage>
        {profileData.profileImgUrl ? (
          // Show uploaded image
          <img
            src={profileData.profileImgUrl}
            onClick={isProfileOwner ? toggleShowIconSelect : () => {}}
          />
        ) : isProfileOwner ? (
          // User is profile owner and doesn't have a profileImgUrl
          <div className="addImgIcon" onClick={toggleShowIconSelect}>
            <span></span>
            <span></span>
            <p>ADD IMAGE</p>
          </div>
        ) : (
          // Show default image for users who have no profileImgUrl saved
          <Image
            src="/favicon.png"
            height="75"
            width="75"
            alt="Default profile - man posing with a wing for a right arm and a circle around him"
          />
        )}
      </ProfileImage>

      {showProfileImgModal && (
        <ProfileImgModal
          setShowProfileImgModal={setShowProfileImgModal}
          showProfileImgModal={showProfileImgModal}
        />
      )}
    </>
  );
};
export default ProfileImg;

const ProfileImage = styled.div`
  height: 100px;
  width: 100px;
  background: ${({ theme }) => theme.buttonMedGradient};
  /* box-shadow: 0 0 0 1px ${({ theme }) => theme.buttonMed}; */
  padding: 3px;
  display: grid;
  place-items: center;
  position: relative;
  border-radius: 50%;

  img {
    border-radius: 50%;
    height: 100%;
    width: 100%;
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
    object-fit: cover;
  }

  .addImgIcon {
    height: 100%;
    width: 100%;
    position: relative;
    cursor: pointer;

    span {
      position: absolute;
      bottom: 60px;
      right: 0;
      left: 0;
      margin: auto;
      display: block;
      height: 5px;
      width: 35px;
      background: ${({ theme }) => theme.background};
      border-radius: 7px;

      &:first-of-type {
        transform: rotate(90deg);
      }
    }

    p {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      margin: auto;
      color: ${({ theme }) => theme.textLight};
      font-size: 0.7rem;
    }
  }
`;
