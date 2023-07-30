import React, { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { Exercise } from "../../types";
import { matchSorter } from "match-sorter";
import ExerciseInfoModal from "../workoutLog/logItem/ExerciseInfoModal";

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
  searchInput: string;
  limit: number;
}

const ExerciseResults = ({ searchInput, limit }: Props) => {
  const [exerciseInfo, setExerciseInfo] = useState<Exercise>();

  const { data: ssrExercises } = useSWR("/api/exercises?default=true", fetcher) as {
    data: Exercise[];
    error: any;
  };

  const exercises = matchSorter(
    ssrExercises?.slice(0, limit || ssrExercises.length) || [],
    searchInput,
    {
      keys: ["name", "muscleGroup", "metric"],
    }
  );

  return (
    <Container>
      <SearchResults>
        {exercises && Boolean(exercises.length)
          ? exercises.map((exercise) => (
              // <Link href={`/teams/${exercise._id}`} >
              <button
                onClick={() => setExerciseInfo(exercise)}
                type="button"
                className="result button-press finder-item"
                key={exercise._id}
              >
                <p>{exercise.name}</p>
                <p className="muscle-group">{exercise.muscleGroup}</p>
              </button>
              // </Link>
            ))
          : searchInput && <p style={{ margin: "1rem 0", fontWeight: 300 }}>No results</p>}
      </SearchResults>

      {exerciseInfo && (
        <ExerciseInfoModal exerciseInfo={exerciseInfo} setExerciseInfo={setExerciseInfo} />
      )}
    </Container>
  );
};

export default ExerciseResults;

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
    text-transform: capitalize;

    p {
      font-weight: 400;
      span {
        font-size: 0.65rem;
      }
    }
    .muscle-group {
      text-align: right;
      font-size: 0.65rem;
      color: ${({ theme }) => theme.textLight};
      font-weight: 300;
    }
  }

  .no-matches p {
    text-align: center;
  }
`;
