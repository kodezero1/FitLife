import { useState } from "react";
import styled from "styled-components";
// Components
import SearchBar from "../components/finder/SearchBar";
import WorkoutsResults from "../components/finder/WorkoutsResults";
import UsersResults from "../components/finder/UsersResults";
import TeamsResults from "../components/finder/TeamsResults";
import ExerciseResults from "../components/finder/ExerciseResults";

/**
 * TODO:
 *
 * The display for a finder is comprised of:
 *  - curated categories of workouts to pick from
 *  - top 6 reccomended workouts
 *  - users with the most workouts created
 *  - teams available to join
 *
 */

const Sections = [
  { title: "workouts", defaultLimit: 6, Component: WorkoutsResults },
  { title: "users", defaultLimit: 5, Component: UsersResults },
  { title: "teams", defaultLimit: 5, Component: TeamsResults },
  { title: "exercises", defaultLimit: Infinity, Component: ExerciseResults },
];

const SectionStyles = {
  expanded: { height: "auto", marginTop: "0.75rem" },
  collapsed: { height: "0px", overflow: "hidden", pointerEvents: "none", marginTop: "0" },
};

const TitleStyles = {
  expanded: { height: "1.5rem" },
  collapsed: { height: "0px", opacity: 0, pointerEvents: "none" },
};

export default function finder() {
  const [searchCategory, setSearchCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");

  return (
    <WorkoutFeedContainer>
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />

      <SearchCategories>
        <ul>
          {Sections.map(({ title }) => (
            <li key={title}>
              <button
                className={title === searchCategory ? "highlight" : ""}
                onClick={() =>
                  searchCategory === title ? setSearchCategory("") : setSearchCategory(title)
                }
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </SearchCategories>

      {Sections.map(({ title, defaultLimit, Component }) => (
        <div
          className="section-wrap"
          key={title}
          style={
            searchCategory === title || searchCategory === ""
              ? SectionStyles.expanded
              : SectionStyles.collapsed
          }
        >
          <Title style={searchCategory === "" ? TitleStyles.expanded : TitleStyles.collapsed}>
            {title}
          </Title>
          <Component searchInput={searchInput} limit={searchCategory === "" ? defaultLimit : 0} />
        </div>
      ))}
    </WorkoutFeedContainer>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-bottom: 1.5rem;

  .section-wrap {
    background: ${({ theme }) => theme.background};
  }
  .finder-item {
    background: transparent;
    background: ${({ theme }) => theme.darkBg};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.border};
    margin: 0.25rem 0.5rem;
  }

  .workout-tile-list > div {
    margin: 0.5rem 0.5rem;
  }
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.textLight};
  text-align: left;
  margin: 0.25rem 0.5rem 0;
  font-weight: 300;
  font-size: 1rem;
  text-transform: capitalize;
  transition: height 0.2s ease-out, opacity 0.1s ease;
`;

const SearchCategories = styled.div`
  background: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  position: sticky;
  top: 0.5rem;
  z-index: 99;
  padding: 0 0 0.5rem;

  ul {
    display: flex;
    height: 100%;
    width: 100%;
    max-width: 100%;
    overflow-x: scroll;
    padding-left: 0.25rem;
    padding-right: 0.5rem;

    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }

    button {
      font-size: 0.75rem;
      background: ${({ theme }) => theme.lowOpacity};
      padding: 0.25rem 1.5rem;
      margin: 0 0.25rem;
      font-weight: 300;
      color: ${({ theme }) => theme.textLight};
      border-radius: 4px;
      text-transform: capitalize;
      border: 1px solid ${({ theme }) => theme.border};
      cursor: pointer;

      &.highlight {
        border: 1px solid ${({ theme }) => theme.accent};
        background: ${({ theme }) => theme.buttonMedGradient};
        color: ${({ theme }) => theme.text};
      }
    }
  }
`;
