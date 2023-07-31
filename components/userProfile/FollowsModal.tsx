import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
// Context
import { useUserDispatch, useUserState } from "../../store";
import { getUsersFromIdArr } from "../../api-lib/fetchers";
import { useFollowMutation, useUnfollowMutation } from "../../api-lib/controllers";
// Components
import LoadingSpinner from "../LoadingSpinner";
import Modal from "../Shared/Modal";

interface Props {
  modalData: { idArr: string[]; type: "followers" | "following" };
  setShowFollowsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFollowsModal: boolean;
  profileUsername: string;
}

const FollowsModal: React.FC<Props> = ({
  modalData,
  profileUsername,
  setShowFollowsModal,
  showFollowsModal,
}) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();
  const queryClient = useQueryClient();

  const { mutate: followUser } = useFollowMutation(queryClient);
  const { mutate: unfollowUser } = useUnfollowMutation(queryClient);

  const handleFollowClick = (mem_id: string) =>
    followUser({ dispatch, userId: user!._id, otherId: mem_id });

  const handleUnfollowClick = (mem_id: string) =>
    unfollowUser({ dispatch, userId: user!._id, otherId: mem_id });

  const { data: members, isLoading } = useQuery(
    ["user-followers", modalData.type, profileUsername],
    () => getUsersFromIdArr(modalData.idArr)
  );

  return (
    <Modal removeModal={() => setShowFollowsModal(false)} isOpen={showFollowsModal}>
      <MembersList>
        <h3 className="title">{modalData.type}</h3>

        {isLoading && <LoadingSpinner />}

        {members && Boolean(members.length) ? (
          <ul>
            {members?.map((member) => (
              <li key={member._id} className="button-press">
                <Link href={`/users/${member.username}`}>{member.username}</Link>

                {user?.following?.includes(member._id) ? (
                  <button
                    className="following"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnfollowClick(member._id);
                    }}
                  >
                    Following
                  </button>
                ) : (
                  user!._id !== member._id && (
                    <button
                      className="follow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollowClick(member._id);
                      }}
                    >
                      Follow
                    </button>
                  )
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul>{!isLoading && <li className="no-items">None</li>}</ul>
        )}
      </MembersList>
    </Modal>
  );
};

export default FollowsModal;

const MembersList = styled.div`
  margin: 50px auto 0;
  padding: 0.5rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  max-width: 400px;
  width: 95%;
  position: relative;

  .title {
    text-transform: capitalize;
  }

  ul {
    max-height: 75vh;
    overflow-y: auto;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding-right: 0.5rem;
      margin-top: 0.5rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonMedGradient};
      cursor: pointer;

      a {
        flex: 1;
        text-align: left;
        padding: 0.7rem 0.5rem;
      }

      button {
        min-width: max-content;
        cursor: pointer;
        border-radius: 4px;
        border: none;
        padding: 0.2rem 0.5rem;
        transition: all 0.2s ease;
        font-size: 0.7rem;

        &.follow {
          background: ${({ theme }) => theme.accent};
          color: ${({ theme }) => theme.accentText};
        }

        &.following {
          background: ${({ theme }) => theme.buttonLight};
          color: ${({ theme }) => theme.textLight};
          padding: 0.2rem 0.5rem;
        }
      }
    }
    .no-items {
      background: none;
      padding: 0.7rem 0.5rem;
      justify-content: center;
    }
  }
`;
