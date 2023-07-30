import React, { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { useUserState } from "../../store";
import { daysBetween } from "../../utils";
import useInViewEffect from "../hooks/useInViewEffect";
import RightArrow from "../svg/RightArrow";

dayjs.extend(utc);

interface Props {
  changeLogToDate: (date: string) => void;
  selectedDate: string;
}

const DateWidth = 60;

const DateScroll: React.FC<Props> = ({ changeLogToDate, selectedDate }) => {
  const router = useRouter();
  const { user } = useUserState();

  const scrollTopArrow = useRef<HTMLButtonElement>(null);
  const scrollContainer = useRef<HTMLUListElement>(null);

  const [dateCount, setDateCount] = useState(30);

  const infiniteScrollRef = useInViewEffect(() => setDateCount((prev) => prev + 30));

  /**
   * @param numOfDaysToShift optional parameter for how many days to shift the returned date (positive is future, negative is past)
   * @returns the first 10 characters of an ISO date string. Eg: "2021-05-10"
   */
  const formatWorkoutLogKeyString = useCallback(
    (numOfDaysToShift: number = 0) =>
      dayjs().subtract(numOfDaysToShift, "d").local().format().substring(0, 10),
    []
  );

  const handleDateClick = async (numberOfDaysToShift: number) => {
    router.replace("");
    const newDate = formatWorkoutLogKeyString(numberOfDaysToShift);
    if (newDate !== selectedDate) changeLogToDate(newDate);
  };

  const scrollToTop = (e) => {
    e.stopPropagation();
    const dateScrollContainer = document.getElementById("date-scroll");
    dateScrollContainer?.scroll({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const dateElement = document.getElementById(selectedDate);
    if (dateElement)
      scrollContainer.current?.scrollTo({
        left: dateElement.offsetLeft - scrollContainer.current.offsetWidth / 2 + DateWidth / 2,
        behavior: "smooth",
      });
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    const days = daysBetween(dayjs(), selectedDate);
    if (dateCount < Math.abs(days)) setDateCount(Math.abs(days) + 30);
  }, [selectedDate, dateCount]);

  // Format the date for the DateBar
  const renderDate = useMemo(
    () => (numOfDaysToShift: number) => {
      const newDate = formatWorkoutLogKeyString(numOfDaysToShift);
      const dayData = user?.workoutLog[newDate];
      const dayIsSelected = selectedDate === newDate;
      const displayDate = dayjs(newDate).local();

      return (
        <div
          style={{ width: DateWidth, minWidth: DateWidth }}
          className={`date-container button-press ${dayIsSelected ? "selected" : "notSelected"} ${
            dayData ? "hasDayData" : "noDayData"
          }`}
        >
          <div className="small-text">
            <p className="month">{displayDate.format("MMM")}</p>
            <p className="day">{displayDate.format("D")}</p>
          </div>
          <p className="dow">{displayDate.format("ddd")}</p>
          {dayData && <span className="workout-dot" />}
        </div>
      );
    },
    [user?.workoutLog, selectedDate]
  );

  const handleScroll = ({ target }) => {
    const { scrollLeft } = target;
    scrollLeft < -100
      ? scrollTopArrow.current?.classList.add("show")
      : scrollTopArrow.current?.classList.remove("show");
  };

  return (
    <Container>
      <DateScrollContainer ref={scrollContainer} id="date-scroll" onScroll={handleScroll}>
        {Array.from(Array(dateCount).keys()).map((numDaysBefore) => (
          <Day
            onClick={() => handleDateClick(numDaysBefore)}
            key={numDaysBefore}
            id={formatWorkoutLogKeyString(numDaysBefore)}
          >
            {renderDate(numDaysBefore)}
          </Day>
        ))}

        <div className="in-view-detector" ref={infiniteScrollRef} />
      </DateScrollContainer>

      <ScrollTopArrow type="button" onClick={scrollToTop} ref={scrollTopArrow}>
        <RightArrow />
      </ScrollTopArrow>
    </Container>
  );
};
export default DateScroll;

const Container = styled.section`
  width: calc(100% + 1rem);
  max-width: calc(100% + 1rem);
  margin-left: -0.5rem;
  position: relative;
  overflow: hidden;
`;

const DateScrollContainer = styled.ul`
  display: flex;
  align-items: stretch;
  flex-direction: row-reverse;

  overflow-x: auto;
  padding-left: 0.25rem;
  padding-right: 0.75rem;

  .in-view-detector {
    min-width: 1px;
    margin-left: -1px;
    float: left;
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

const ScrollTopArrow = styled.button`
  background: ${({ theme }) => theme.background};
  box-shadow: 0 1px 3px ${({ theme }) => theme.boxShadow},
    inset 0 0 1px 1px ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.textLight};
  border-radius: 5px;
  z-index: 2;
  display: grid;
  place-items: center;

  width: 35px;
  height: 35px;
  margin-left: auto;
  margin-right: 0.5rem;

  position: absolute;
  top: 50%;
  right: 0.5rem;

  will-change: transform;
  transform: translate(75px, -50%);
  transition: transform 0.25s ease;

  &.show,
  &:focus-visible {
    transform: translate(0, -50%);
  }
`;

const Day = styled.li`
  cursor: pointer;
  text-align: center;
  min-height: 100%;
  padding: 0.4rem 0;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);

  .date-container {
    padding: 0.4rem 0;
    height: 100%;
    border-radius: 5px;
    background: transparent;
    transition: background 0.25s ease-in-out;

    .small-text {
      margin-bottom: 1px;
      display: flex;
      justify-content: center;
      p {
        font-size: 0.6rem;
        font-weight: 300;
        letter-spacing: 1px;
        margin: 0 2px;
      }
    }

    .dow {
      margin-bottom: 0.3rem;
      font-size: 1.1rem;
      letter-spacing: 1px;
    }

    .workout-dot {
      display: block;
      margin: auto;
      border-radius: 50%;
      height: 6px;
      width: 6px;
      background: ${({ theme }) => theme.accent};
    }

    &.selected {
      background: ${({ theme }) => theme.background};
      box-shadow: 0 1px 3px ${({ theme }) => theme.boxShadow},
        inset 0 0 0 1px ${({ theme }) => theme.accent};
    }
    &.notSelected {
      color: ${({ theme }) => theme.textLight};
    }
    &.hasDayData {
    }
    &.noDayData {
    }
  }
`;
