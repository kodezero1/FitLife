import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { getAllTeams } from "../../api-lib/controllers";

interface Props {
  searchInput: string;
  limit: number;
}

const TeamsResults = ({ searchInput, limit }) => {
  const { data: initialTeams = [] } = getAllTeams();

  const items =
    initialTeams &&
    initialTeams
      .slice(0, limit || initialTeams.length)
      .filter((team) => team.teamName.toLowerCase().includes(searchInput));

  return (
    <Container>
      <SearchResults>
        {items && Boolean(items.length)
          ? items.map((team) => (
              <Link href={`/teams/${team._id}`} key={team._id}>
                <li className="result button-press finder-item">
                  <p>{team.teamName}</p>
                  <p className="members">
                    {team.members.length} <span>members</span>
                  </p>
                </li>
              </Link>
            ))
          : searchInput && <p style={{ margin: "1rem 0", fontWeight: 300 }}>No results</p>}
      </SearchResults>
    </Container>
  );
};

export default TeamsResults;

const Container = styled.section`
  width: 100%;
  flex: 1;
  padding-bottom: 0.25rem;
`;

const SearchResults = styled.ul`
  display: flex;
  flex-direction: column;

  .result {
    text-align: left;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    border-radius: 5px;
    cursor: pointer;

    p {
      font-weight: 400;
      span {
        font-size: 0.65rem;
      }
    }
    .members {
      font-size: 0.85rem;
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
    }
  }

  .no-matches p {
    text-align: center;
  }
`;
