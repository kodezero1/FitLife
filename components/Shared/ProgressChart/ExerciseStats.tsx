import dayjs from "dayjs";
import React from "react";
import styled from "styled-components";
import { useUserState } from "../../../store";
import { ExerciseHistory, Exercise, WeightSet, TimeSet } from "../../../types";
import { formatMilliseconds, formatSetRepsAndWeight } from "../../../utils";

interface Props {
  exerciseHistory: ExerciseHistory;
  metric: Exercise["metric"];
}

const ExerciseStats: React.FC<Props> = ({ exerciseHistory, metric }) => {
  const { user } = useUserState();

  const getMaxNumber = (arr: number[]) => Math.max(...arr);
  const getMinNumber = (arr: number[]) => Math.min(...arr);

  const allSets = exerciseHistory.map(({ sets }) => sets).flat();

  // WEIGHT
  const getWeightsFromSets = (sets: WeightSet[]) =>
    sets.flatMap(({ weight }) => formatSetRepsAndWeight(weight));

  const getMaxWeight = (sets: WeightSet[]) =>
    sets.length ? getMaxNumber(getWeightsFromSets(sets)) : 0;

  const getTotalWeightVolume = (sets: WeightSet[]) =>
    sets.reduce(
      (acc, curr) =>
        (acc += formatSetRepsAndWeight(curr.weight) * formatSetRepsAndWeight(curr.reps)),
      0
    );

  const getDiffInMaxWeight = () => {
    if (!exerciseHistory.length) return 0;
    const diffInMaxWeight =
      getMaxWeightFromSets(exerciseHistory[0].sets as WeightSet[]) -
      getMaxWeightFromSets(exerciseHistory[exerciseHistory.length - 1].sets as WeightSet[]);
    return diffInMaxWeight || 0;
  };

  const getMaxWeightFromSets = (sets: WeightSet[]) => getMaxNumber(getWeightsFromSets(sets));
  const getMinWeightFromSets = (sets: WeightSet[]) => getMinNumber(getWeightsFromSets(sets));

  // TIME
  const getMaxTime = (sets: TimeSet[]) => getMaxNumber(sets.flatMap(({ duration }) => duration));

  const getTotalTime = (sets: TimeSet[]) => sets.reduce((acc, curr) => acc + curr.duration, 0);

  const getBestDay = () => {
    const dayTotals = exerciseHistory.map(({ date, sets }) => ({
      date,
      totalDuration: getTotalTime(sets as TimeSet[]),
    }));
    let max = 0;
    let maxDate = "";
    dayTotals.forEach(({ date, totalDuration }) => {
      if (totalDuration > max) {
        max = totalDuration;
        maxDate = date;
      }
    });
    return { date: maxDate, dayTotal: max };
  };

  return (
    <Container>
      {metric === "weight" && (
        <>
          <div className="tile max">
            <span className="title">Max weight</span>
            <p className="large-num">
              {getMaxWeight(allSets as WeightSet[]).toLocaleString()}
              <span> {user?.preferences?.weightUnit || "lb"}s</span>
            </p>
          </div>

          <div className="tile increase">
            <span className="title">
              Diff since{" "}
              {dayjs(exerciseHistory[exerciseHistory.length - 1]?.date || dayjs()).format(
                "MMM D, 'YY"
              )}
            </span>
            <p className="large-num">
              {getDiffInMaxWeight().toLocaleString()}
              <span> {user?.preferences?.weightUnit || "lb"}s</span>
            </p>
          </div>

          <div className="tile count">
            <span className="title">Total sets</span>
            <p className="small-num">{allSets.length.toLocaleString()}</p>
          </div>

          <div className="tile volume">
            <span className="title">Total volume</span>
            <p className="small-num">
              {getTotalWeightVolume(allSets as WeightSet[]).toLocaleString()}
              <span> {user?.preferences?.weightUnit || "lb"}s</span>
            </p>
          </div>
        </>
      )}

      {metric === "time" && (
        <>
          <div className="tile max">
            <span className="title">Longest Set</span>
            <p className="large-num">{formatMilliseconds(getMaxTime(allSets as TimeSet[]))}</p>
          </div>

          <div className="tile increase">
            <span className="title">Best day: {dayjs(getBestDay().date).format("MMM D, 'YY")}</span>
            <p className="large-num">{formatMilliseconds(getBestDay().dayTotal)}</p>
          </div>

          <div className="tile count">
            <span className="title">Total sets</span>
            <p className="small-num">{allSets.length.toLocaleString()}</p>
          </div>

          <div className="tile volume">
            <span className="title">Total time</span>
            <p className="small-num">{formatMilliseconds(getTotalTime(allSets as TimeSet[]))}</p>
          </div>
        </>
      )}

      <div className="tile logged">
        <span className="title">Logged</span>
        <p className="small-num">
          {exerciseHistory.length.toLocaleString()}{" "}
          <span>{exerciseHistory.length > 1 ? "times" : "time"}</span>
        </p>
      </div>
    </Container>
  );
};

export default ExerciseStats;

const Container = styled.div`
  flex: 1;
  height: 150px;
  width: 100%;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.4fr;
  grid-template-rows: 1fr 0.8fr;
  justify-content: center;
  grid-gap: 0.5rem;

  .tile {
    padding: 1rem 0 0;
    background: ${({ theme }) => theme.background};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.buttonMed};
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .title {
      position: absolute;
      top: 0.25rem;
      left: 0.5rem;
      font-weight: 300;
      font-size: 0.8rem;
    }

    .large-num {
      font-size: 2rem;
      font-weight: 300;
      min-width: max-content;

      span {
        font-weight: 300;
        font-size: 0.85rem;
      }
    }

    .small-num {
      font-size: 1.5rem;
      font-weight: 300;
      min-width: max-content;

      span {
        font-weight: 300;
        font-size: 0.65rem;
      }
    }
  }

  .max {
    grid-column: 1 / span 2;
  }
  .increase {
    grid-column: 3 / span 2;
  }
  .count {
    grid-column: 1 / span 1;
  }
  .volume {
    grid-column: 2 / span 2;
  }
  .logged {
    grid-column: 4 / span 1;
  }
`;
