import dayjs from "dayjs";
import React, { useState, useEffect, useMemo } from "react";
import styled, { useTheme } from "styled-components";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from "recharts";

import { useUserState, saveUserWeight, useUserDispatch } from "../../store";
import { ChartContainer } from "../Shared/ProgressChart/Chart";

const WeightTile: React.FC = () => {
  const { user } = useUserState();
  const userDispatch = useUserDispatch();

  const theme = useTheme() as any;

  const [inputWeight, setInputWeight] = useState("");
  const [displayWeight, setDisplayWeight] = useState(0);
  const [weightDiff, setWeightDiff] = useState(0);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputWeight(e.target.value);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputWeight) return;
    const weight = Number(inputWeight);

    // send POST req
    const isSaved = await saveUserWeight(userDispatch, user!._id, {
      weight,
      date: dayjs().toISOString(),
    });

    if (isSaved) {
      // update weightDiff only if user has weight defined
      if (displayWeight) setWeightDiff(weightDiff - (displayWeight - weight));
      // change displayWeight to newly inputWeight
      setDisplayWeight(weight);
    }

    // Clear weight input
    setInputWeight("");
  };

  useEffect(() => {
    if (!!user?.weight?.length) {
      const curr = user.weight[user.weight.length - 1];
      const first = user.weight[0];
      setDisplayWeight(curr.weight);
      setWeightDiff(curr.weight - first.weight);
    }
  }, [user?.weight]);

  const weightData = useMemo(
    () =>
      user?.weight?.map(({ weight, date }) => ({
        date: dayjs(date).format("MMM D, YY"),
        weight,
      })) || [],
    [user?.weight]
  );

  return (
    <WeightContainer>
      <h3 className="title">Weight</h3>

      <div className="innerInfo">
        <form method="post" onSubmit={handleSave}>
          <p>Current</p>
          <div>
            <input type="number" name="weight" onChange={handleWeightChange} value={inputWeight} />
            <button type="submit" disabled={!inputWeight}>
              Save
            </button>
          </div>
        </form>

        <div className="weightDiff">
          {weightDiff > 0 ? <p>Total gain</p> : <p>Total loss</p>}
          <span>
            {Math.abs(weightDiff).toFixed(1)} {user?.preferences?.weightUnit || "lb"}s
          </span>
        </div>

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weightData}
              margin={{ top: 20, right: 20, left: -25, bottom: 0 }}
              // onClick={(data) => setSelectedDate(data?.activeLabel || "")}
            >
              <CartesianGrid strokeDasharray="1 5" />
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.accent} stopOpacity={0.7} />
                  <stop offset="90%" stopColor={theme.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="weight"
                stroke={theme.accent}
                fillOpacity={1}
                fill="url(#colorUv)"
                dot={{ stroke: theme.accent, strokeWidth: 1.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </WeightContainer>
  );
};
export default WeightTile;

const WeightContainer = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  .innerInfo {
    width: 100%;
    padding: 0.5rem;
    background: ${({ theme }) => theme.buttonMedGradient};
    border-radius: 5px;

    & > div,
    & > form {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
    }

    form {
      div {
        display: flex;
        align-items: center;
      }
      input {
        text-align: center;
        width: 5rem;
        margin: 0 0.5rem;
        padding: 0.1rem 0.5rem;
        border: none;
        font-size: inherit;
        border-radius: 4px;
        color: ${({ theme }) => theme.text};
        border: 1px solid ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.background};

        -moz-appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        &:focus {
          border: 1px solid ${({ theme }) => theme.accent};
          outline: none;
        }
      }

      button {
        font-size: 0.8rem;
        padding: 0 1rem;
        height: 100%;
        border-radius: 4px;
        border: none;
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accent};
        transition: all 0.2s ease;

        &:disabled {
          color: ${({ theme }) => theme.border};
          background: ${({ theme }) => theme.medOpacity};
        }
      }
    }
  }

  span {
    font-weight: thin;
    color: ${({ theme }) => theme.text};
  }

  .weightDiff {
    margin: 0.5rem 0;
  }
`;
