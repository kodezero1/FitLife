import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { User } from "../../types";
import { daysBetween, formatWorkoutLogDate } from "../../utils";

dayjs.extend(utc);

interface Props {
  profile: User;
}

const LogHistoryChart: React.FC<Props> = ({ profile }) => {
  const grid = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!grid.current) return;
    grid.current.scroll({ left: grid.current.scrollWidth });
  }, [grid]);

  const renderDot = (numOfDaysToShift: number) => {
    const date = dayjs().subtract(numOfDaysToShift, "d").local();
    const dayData = profile.workoutLog[formatWorkoutLogDate(date)];

    return (
      <div
        className={`${dayData ? "hasDayData" : "noDayData"} 
        ${date.isSame(profile.accountCreated, "D") && "account-created"}`}
      >
        {date.date() === 1 && (
          <span className="month-text">
            {date.month() === 0 ? <span>{date.format("YYYY")}</span> : date.format("MMM")}
          </span>
        )}
      </div>
    );
  };

  const accountCreated = dayjs(dayjs(profile.accountCreated).format("YYYY-MM-DD")).local();
  const daysSinceAccountCreated = daysBetween(accountCreated, dayjs().local()) + 1; // +1 to include current day
  const minNumCols = 29;
  const daysInWeek = 7;
  const minDaysShown = minNumCols * daysInWeek - (daysInWeek - 1 - dayjs().local().day());

  const numDaysShown = Math.max(
    daysSinceAccountCreated + accountCreated.day() + 7, // +7 to pad start date by 1 week
    minDaysShown
  );

  const currWeekBuffer = 6 - dayjs().local().day();

  return (
    <DateGrid ref={grid}>
      {[...Array(numDaysShown).keys()].reverse().map((numDays) => (
        <li className="date" key={numDays}>
          {renderDot(numDays)}
        </li>
      ))}

      {[...Array(currWeekBuffer)].map((_, i) => (
        <li key={"curr_weekly_buffer_" + i} />
      ))}

      {["", "M", "", "W", "", "F", ""].map((day, i) => (
        <li className="day-text" key={"day_text_" + i}>
          {day}
        </li>
      ))}
    </DateGrid>
  );
};
export default LogHistoryChart;

const DateGrid = styled.ul`
  position: relative;
  padding: 1.3rem 0.25rem 0.2rem;

  scroll-behavior: auto;

  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 1px 5px;

  overflow-x: auto;
  width: 100%;
  border-radius: 5px;

  .day-text {
    font-size: 0.5rem;
    color: ${({ theme }) => theme.textLight};
    line-height: 0.5rem;
  }

  .date {
    max-width: 10px;
    height: 10px;
    margin: auto;

    .month-text {
      position: absolute;
      top: 0.3rem;
      font-size: 0.65rem;
      line-height: 0.7rem;
      color: ${({ theme }) => theme.textLight};
      transform: translateX(-50%);
      font-weight: 300;

      span {
        font-weight: 400;
      }
    }

    div {
      border-radius: 7px;
      padding: 0.25rem 0.25rem;
      transition: all 0.2s ease-in-out;

      &.account-created {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.text};
      }

      &.noDayData {
        background: ${({ theme }) => theme.lowOpacity};
      }
      &.hasDayData {
        background: ${({ theme }) => theme.accent};
      }
    }
  }

  @media (max-width: 425px) {
    /* Remove scroll bar on mobile */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
