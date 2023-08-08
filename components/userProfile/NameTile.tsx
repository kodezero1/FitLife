import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import Link from "next/link";
import styled from "styled-components";
// Context
import { useUserDispatch, useUserState } from "../../store";
// Components
import ProfileImg from "./ProfileImg";
import Settings from "../svg/Settings";
import FollowsModal from "./FollowsModal";
// Interfaces
import { User } from "../../types";
import { useFollowMutation, useUnfollowMutation } from "../../api-lib/controllers";
import LogHistoryChart from "./LogHistoryChart";

interface Props {
  profile: User;
  isProfileOwner: boolean;
}

const NameTile: React.FC<Props> = ({ profile, isProfileOwner }) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();
  const queryClient = useQueryClient();

  const [showFollowsModal, setShowFollowsModal] = useState(false);
  const [modalData, setModalData] = useState<{
    idArr: string[];
    type: "followers" | "following";
  }>({ idArr: [], type: "followers" });

  const { mutate: followUser, isLoading: loadingFollow } = useFollowMutation(queryClient);
  const { mutate: unfollowUser, isLoading: loadingUnfollow } = useUnfollowMutation(queryClient);

  const handleProfileFollowsClick = (type: "following" | "followers") => {
    setShowFollowsModal(true);
    setModalData({ idArr: profile[type] || [], type });
  };

  useEffect(() => {
    setShowFollowsModal(false);
  }, [profile._id]);

  const queryVars = {
    dispatch,
    userId: user!._id,
    otherId: profile._id,
  };

  return (
    <TileContainer>
      {isProfileOwner && (
        <Link href="/settings">
          <SettingsIcon>
            <Settings />
          </SettingsIcon>
        </Link>
      )}

      {!isProfileOwner &&
        (user!.following?.includes(profile._id) || false ? (
          <FollowBtn
            className="btn unfollowBtn"
            onClick={() => unfollowUser(queryVars)}
            disabled={loadingFollow}
          >
            Following
          </FollowBtn>
        ) : (
          <FollowBtn
            className="btn followBtn"
            onClick={() => followUser(queryVars)}
            disabled={loadingUnfollow}
          >
            Follow
          </FollowBtn>
        ))}

      <div className="top">
        <div className="left">
          <ProfileImg profileData={profile} isProfileOwner={isProfileOwner} />
        </div>

        <div className="username">
          <h1>{profile.username}</h1>
        </div>
      </div>

      <div className="bottom">
        {/* <button className="box" onClick={() => handleProfileFollowsClick("followers")}>
          <span className="small-text">
            {profile.followers?.length === 1 ? "Follower" : "Followers"}
          </span>
          <span className="stat">{profile.followers?.length || 0}</span>
        </button> */}

        <p className="box">
          <span className="small-text">Workouts</span>
          <span className="stat large-text">{Object.keys(profile.workoutLog).length}</span>
        </p>

        {/* <button className="box" onClick={() => handleProfileFollowsClick("following")}>
          <span className="small-text">Following</span>
          <span className="stat">{profile.following?.length || 0}</span>
        </button> */}

        {/* <p className="box">
          <span className="small-text">Last Seen</span>{" "}
          {timeSince(dayjs(profile.lastLoggedIn)).split(" ")[0] === "a" ? (
            <span className="small-text">{timeSince(dayjs(profile.lastLoggedIn))}</span>
          ) : (
            <>
              <span className="small-text">
                {timeSince(dayjs(profile.lastLoggedIn)).split(" ")[0]}{" "}
                {timeSince(dayjs(profile.lastLoggedIn)).split(" ").slice(1).join(" ")}
              </span>
            </>
          )}
        </p>
        <div />
        <p className="box">
          <span className="small-text">Joined</span>
          <span className="stat small-text">{dayjs(profile.accountCreated).format("M.D.YY")}</span>
        </p> */}
      </div>

      <LogHistoryChart profile={profile} />

      {showFollowsModal && (
        <FollowsModal
          modalData={modalData}
          profileUsername={profile.username}
          setShowFollowsModal={setShowFollowsModal}
          showFollowsModal={showFollowsModal}
        />
      )}
    </TileContainer>
  );
};
export default NameTile;

const TileContainer = styled.section`
  position: relative;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem;
  border-radius: 10px 10px 0 0;
  background: ${({ theme }) => theme.background};
  margin-top: 40px;

  .top {
    display: flex;
    align-items: end;
    margin-top: -42px;
    margin-bottom: 1.25rem;

    .username {
      margin-left: 0.5rem;
      margin-bottom: -0.7rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      overflow: hidden;

      h1 {
        font-size: 2.1rem;
        font-weight: 400;
        min-width: max-content;
      }
    }
  }

  .bottom {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 0.5rem;
    margin-bottom: 1.25rem;

    .box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      border: none;
      border-radius: 5px;

      .stat {
        font-size: 1.4rem;
        line-height: 2rem;
      }
      .large-text {
        font-size: 1.6rem;
        font-weight: 500;
      }
      .small-text {
        color: ${({ theme }) => theme.textLight};
        padding-top: 2px;
        font-size: 0.6rem;
        border-radius: 5px;
      }
    }
  }
`;

const SettingsIcon = styled.div`
  position: absolute;
  top: calc((0.5rem + 27px) * -1);
  right: 0;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.background};
  height: 27px;
  width: 27px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  cursor: pointer;
`;

const FollowBtn = styled.button`
  padding: 0 1rem;
  font-size: 0.8rem;
  border-radius: 5px;
  border: none;
  position: absolute;
  top: calc((0.5rem + 30px) * -1);
  right: 0;
  height: 30px;
  display: grid;
  place-items: center;

  &.followBtn {
    color: ${({ theme }) => theme.accentText};
    box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
    background: ${({ theme }) => theme.accent};
  }
  &.unfollowBtn {
    color: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonMed};
  }
`;
