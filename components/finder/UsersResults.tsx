import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { matchSorter } from "match-sorter";
import { useQuery } from "react-query";
// API
import { getUsersFromIdArr, queryShortUsersByUsername } from "../../api-lib/fetchers";
// Context
import { useUserDispatch, useUserState, addToRecentlyViewedUsers } from "../../store";
// Hooks
import useDebouncedState from "../hooks/useDebouncedState";
// Interfaces
import { ShortUser } from "../../types";

interface Props {
  searchInput: string;
  limit: number;
}

const UsersResults = ({ searchInput, limit }) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();

  const [searchResults, setSearchResults] = useState<ShortUser[] | null>(null);
  const debouncedInput = useDebouncedState(searchInput, 100);

  const { data: recentlyViewedUsers = [] } = useQuery(
    ["recently-viewed-users"],
    () => getUsersFromIdArr(user?.recentlyViewedUsers || []),
    { enabled: !!user }
  );

  useEffect(() => {
    const search = async () => {
      const users = await queryShortUsersByUsername(debouncedInput);
      if (users && users)
        setSearchResults(
          matchSorter(users, debouncedInput, {
            keys: ["username"],
          })
        );
    };

    debouncedInput ? search() : setSearchResults(null);
  }, [debouncedInput]);

  return (
    <Container>
      {searchResults && searchInput ? (
        // User has something typed in to the search input
        <SearchResults>
          {Boolean(searchResults.length)
            ? searchResults
                .slice(0, limit || searchResults.length)
                .map(({ _id, username, profileImgUrl }) => (
                  <Link href={`users/${username}`} key={_id}>
                    <li
                      className="result"
                      onClick={() => addToRecentlyViewedUsers(dispatch, user!._id, _id)}
                    >
                      {profileImgUrl ? (
                        <img src={profileImgUrl} alt={username} />
                      ) : (
                        <Image src="/favicon.png" height="30" width="30" alt="FitSync Logo" />
                      )}

                      <p>{username}</p>
                    </li>
                  </Link>
                ))
            : searchInput && <p style={{ margin: "1rem 0", fontWeight: 300 }}>No results</p>}
        </SearchResults>
      ) : (
        recentlyViewedUsers &&
        Boolean(recentlyViewedUsers.length) && (
          // User has nothing in search input, so show recently viewed users
          <SearchResults>
            <h3 className="recent-title">Recent</h3>
            {recentlyViewedUsers
              .slice(0, limit || recentlyViewedUsers.length)
              .map(({ _id, username, profileImgUrl }) => (
                <Link href={`users/${username}`} key={_id}>
                  <li
                    className="result button-press finder-item"
                    onClick={() => addToRecentlyViewedUsers(dispatch, user!._id, _id)}
                  >
                    {profileImgUrl ? (
                      <img src={profileImgUrl} alt={username} />
                    ) : (
                      <Image src="/favicon.png" height="30" width="30" alt="FitSync Logo" />
                    )}

                    <p>{username}</p>
                  </li>
                </Link>
              ))}
          </SearchResults>
        )
      )}
    </Container>
  );
};

export default UsersResults;

const Container = styled.section`
  width: 100%;
  flex: 1;
  padding-bottom: 0.25rem;
`;

const SearchResults = styled.ul`
  display: flex;
  flex-direction: column;

  .recent-title {
    text-align: left;
    margin-left: 1rem;
    font-size: 0.85rem;
    font-weight: 300;
  }

  .result {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.1s ease-out;

    img {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      object-fit: cover;
    }

    p {
      transition: all 0.1s ease-out;
      margin-left: 1rem;
      text-align: left;
      flex: 1;
      font-weight: 400;
    }
  }
  .no-matches p {
    text-align: left;
  }
`;
