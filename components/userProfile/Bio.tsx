import React, { useState } from "react";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
// Context
import { saveUserBio, useUserDispatch } from "../../store";
// Interfaces
import { User } from "../../types";

interface Props {
  profile: Omit<User, "workoutLog">;
  isProfileOwner: boolean;
}
const Bio: React.FC<Props> = ({ profile, isProfileOwner }) => {
  const userDispatch = useUserDispatch();

  const [editing, setEditing] = useState(false);
  const [bioEdits, setBioEdits] = useState(profile.bio || "");

  const handleEditClick = () => setEditing(true);

  const handleCancleClick = () => {
    setEditing(false);
    setBioEdits(profile.bio || "");
  };

  const { mutate: mutateBio, isLoading } = (function (bioEdits) {
    const queryClient = useQueryClient();
    return useMutation(() => saveUserBio(userDispatch, profile._id, bioEdits), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user-profile", profile.username]);
        setEditing(false);
      },
    });
  })(bioEdits);

  const handleBioChange = ({ target }) => setBioEdits(target.value);

  useEffect(() => {
    setBioEdits(profile.bio || "");
  }, [profile.bio]);

  return (
    <BioContainer>
      <div className="topbar">
        <h3 className="title">Bio</h3>

        {isProfileOwner && !editing && <button onClick={handleEditClick}>Edit</button>}

        {editing && <button onClick={handleCancleClick}>Cancel</button>}
      </div>

      {editing ? (
        <textarea
          value={bioEdits}
          onChange={handleBioChange}
          placeholder="Add a summary about your fitness experience or share your workout goals."
          autoFocus
          onFocus={({ target }) => {
            const val = target.value;
            target.value = "";
            target.value = val;
          }}
        />
      ) : (
        <p>{bioEdits || "None"}</p>
      )}

      {editing && (
        <SaveBtn onClick={() => mutateBio()} disabled={isLoading}>
          Save
        </SaveBtn>
      )}
    </BioContainer>
  );
};
export default Bio;

const BioContainer = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    button {
      border-radius: 3px;
      padding: 0.2rem 0.5rem;
      border: none;
      background: ${({ theme }) => theme.lowOpacity};
      color: ${({ theme }) => theme.textLight};
      font-size: 0.7rem;
      font-weight: 300;
    }
  }

  textarea,
  p {
    white-space: pre-wrap;
    line-height: 1.3rem;
    font-size: 1rem;
    font-weight: 300;
    letter-spacing: 0.04em;
    margin: 0;
    color: ${({ theme }) => theme.text};
    border-radius: 5px;
    height: fit-content;
  }

  textarea {
    font-family: inherit;
    width: 100%;
    min-height: 75px;
    resize: vertical;
    padding: 0.25rem;
    border: none;
    background: ${({ theme }) => theme.medOpacity};
    margin: 0;
    border: 2px solid ${({ theme }) => theme.body};

    &:focus {
      outline: none;
      border: 2px solid ${({ theme }) => theme.accent};
    }
  }

  p {
    padding: calc(0.25rem + 2px);
  }
`;

const SaveBtn = styled.button`
  float: right;
  border-radius: 3px;
  padding: 0.2rem 0.75rem;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.accentText};
  background: ${({ theme }) => theme.accent};
`;
