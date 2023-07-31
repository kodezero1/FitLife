import { useEffect, useState } from "react";
import styled from "styled-components";
import { matchSorter } from "match-sorter";
// Components
import WorkoutTile from "./WorkoutTile";
// Interfaces
import { Workout } from "../../types";
// API
import { getPublicWorkouts } from "../../api-lib/controllers";

interface Props {
  searchInput: string;
  limit: number;
}

const WorkoutsResults = ({ searchInput, limit }) => {
  const [searchResults, setSearchResults] = useState<Workout[]>(new Array(15).fill({}));
  const [sortingMethod, setSortingMethod] = useState<"popular" | "recent" | "name">("recent");

  const { data: initialWorkouts, isLoading } = getPublicWorkouts();

  const sortWorkoutsBy = (workouts: Workout[], keyword: "popular" | "recent" | "name") => {
    setSortingMethod(keyword);

    switch (keyword) {
      case "popular":
        setSearchResults([...workouts].sort((a, b) => b.numLogged - a.numLogged));
        break;
      case "recent":
        setSearchResults(
          [...workouts].sort((a, b) => b.date_created.localeCompare(a.date_created))
        );
        break;
      case "name":
        setSearchResults([...workouts].sort((a, b) => a.name.localeCompare(b.name)));
        break;
    }
  };

  useEffect(() => {
    if (!initialWorkouts) return;

    if (searchInput === "") {
      sortWorkoutsBy(initialWorkouts, sortingMethod);
    } else {
      setSearchResults(
        matchSorter(initialWorkouts, searchInput, {
          keys: ["creatorName", "name"],
        })
      );
    }
  }, [searchInput, initialWorkouts]);

  return (
    <Container>
      {Boolean(searchResults.length > 1) && (
        <SortOptions>
          <li>
            <button
              onClick={() => sortWorkoutsBy(searchResults, "recent")}
              className={sortingMethod === "recent" ? "highlight" : ""}
            >
              Recent
            </button>
          </li>
          <li>
            <button
              onClick={() => sortWorkoutsBy(searchResults, "popular")}
              className={sortingMethod === "popular" ? "highlight" : ""}
            >
              Popular
            </button>
          </li>
          <li>
            <button
              onClick={() => sortWorkoutsBy(searchResults, "name")}
              className={sortingMethod === "name" ? "highlight" : ""}
            >
              A — Z
            </button>
          </li>
        </SortOptions>
      )}

      <div className="workout-tile-list">
        {Boolean(searchResults.length)
          ? searchResults
              .slice(0, limit || searchResults.length)
              .map(
                (workout, i) =>
                  workout && (
                    <WorkoutTile
                      key={workout._id || i}
                      index={i}
                      isLoading={isLoading}
                      workout={workout}
                    />
                  )
              )
          : searchInput && <p style={{ margin: "1rem 0", fontWeight: 300 }}>No results</p>}
      </div>
    </Container>
  );
};
export default WorkoutsResults;

const Container = styled.section`
  width: 100%;
  flex: 1;
`;

const SortOptions = styled.ul`
  display: flex;
  align-items: center;
  margin: 0.5rem 0 0.25rem;

  button {
    font-size: 0.75rem;
    margin-left: 0.5rem;
    min-width: 85px;
    padding: 0.25rem;
    color: ${({ theme }) => theme.textLight};
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.lowOpacity};
    border-radius: 4px;
    cursor: pointer;

    &.highlight {
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.accent};
      background: ${({ theme }) => theme.buttonMedGradient};
      font-weight: 500;
    }
  }
`;
