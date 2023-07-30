import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import dayjs from "dayjs";
// Utils
import { getCurrYearMonthDay } from "../../../utils";
// Interfaces
import { Workout, Routine } from "../../../types";
// Components
import CalendarDay from "./CalendarDay";
import CalendarTools from "./CalendarTools";
import LeftArrow from "../../svg/LeftArrow";
import RightArrow from "../../svg/RightArrow";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface CalendarData {
  [isoDate: string]: { workout_id?: string; workout?: Workout; workoutName?: string };
}

interface Props {
  data: CalendarData;
  datesSelected: { [date: string]: boolean };
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  deleteWorkoutsOnSelectedDates?: () => void;
  undoRoutineStack?: Routine[];
  undoRoutine?: () => void;
  selectedDaysFromPlan?: Routine["workoutPlan"];
  copyWorkoutsToStartDate?: (date: string) => void;
}

const Calendar: React.FC<Props> = ({
  data,
  datesSelected,
  setDatesSelected,
  deleteWorkoutsOnSelectedDates,
  undoRoutineStack,
  undoRoutine,
  selectedDaysFromPlan,
  copyWorkoutsToStartDate,
}) => {
  const router = useRouter();

  const [showWorkoutTags, setShowWorkoutTags] = useState(true);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [copyWorkoutsMode, setCopyWorkoutsMode] = useState(false);
  const [{ year, month }, setYearMonthDay] = useState(getCurrYearMonthDay());
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  const getDayData = (isoString: string) => {
    return data[isoString.substring(0, 10)];
  };

  const incrementMonth = () => {
    const newMonth = (month + 1) % 12;
    newMonth === 0
      ? setYearMonthDay((prev) => ({ ...prev, month: newMonth, year: year + 1 }))
      : setYearMonthDay((prev) => ({ ...prev, month: newMonth }));
  };

  const decrementMonth = () => {
    const newMonth = month - 1 < 0 ? 11 : month - 1;
    newMonth === 11
      ? setYearMonthDay((prev) => ({ ...prev, month: newMonth, year: year - 1 }))
      : setYearMonthDay((prev) => ({ ...prev, month: newMonth }));
  };

  useEffect(() => {
    if (year && month > -1) setDaysInMonth(dayjs(`${year}-${month + 1}-${0}`).daysInMonth());
  }, [year, month]);

  useEffect(() => {
    setIsMobileDevice(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent));
  }, []);

  return (
    <Container>
      {router.pathname === "/builder" && (
        <CalendarTools
          datesSelected={datesSelected}
          deleteWorkoutsOnSelectedDates={deleteWorkoutsOnSelectedDates}
          setDatesSelected={setDatesSelected}
          multiSelectMode={multiSelectMode}
          setMultiSelectMode={setMultiSelectMode}
          showWorkoutTags={showWorkoutTags}
          setShowWorkoutTags={setShowWorkoutTags}
          copyWorkoutsMode={copyWorkoutsMode}
          setCopyWorkoutsMode={setCopyWorkoutsMode}
          undoRoutineStack={undoRoutineStack}
          undoRoutine={undoRoutine}
          selectedDaysFromPlan={selectedDaysFromPlan}
        />
      )}

      <MonthCtrl>
        <button className="arrow" onClick={decrementMonth}>
          <LeftArrow />
        </button>
        <div onClick={() => setYearMonthDay(getCurrYearMonthDay())}>
          <p className="month">{MONTHS[month]}</p>
          <p className="year">{year}</p>
        </div>
        <button className="arrow" onClick={incrementMonth}>
          <RightArrow />
        </button>
      </MonthCtrl>

      <DaysOfTheWeek>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <li key={day}>{day}</li>
        ))}
      </DaysOfTheWeek>

      <DaysCtrl>
        {[...Array(dayjs(`${year}-${month + 1}`).day())].map((_, i) => (
          <div className="fillerDay" key={i}></div>
        ))}

        {[...Array(daysInMonth)].map((_, i) => (
          <CalendarDay
            key={i}
            dayData={getDayData(dayjs(`${year}-${month + 1}-${i + 1}`).toISOString())}
            year={year}
            month={month + 1}
            day={i + 1}
            datesSelected={datesSelected}
            setDatesSelected={setDatesSelected}
            showWorkoutTags={showWorkoutTags}
            multiSelectMode={multiSelectMode}
            copyWorkoutsMode={copyWorkoutsMode}
            copyWorkoutsToStartDate={copyWorkoutsToStartDate}
            isMobileDevice={isMobileDevice}
          />
        ))}
      </DaysCtrl>
    </Container>
  );
};
export default Calendar;

const Container = styled.div`
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;
`;

const MonthCtrl = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  div {
    align-items: center;
    margin: 0.5rem 0;
    cursor: pointer;

    .month {
      font-size: 1.3rem;
      width: 150px;
      font-weight: 300;
    }
    .year {
      font-size: 0.6rem;
      color: ${({ theme }) => theme.textLight};
    }
  }
  .arrow {
    color: ${({ theme }) => theme.textLight};
    background: inherit;
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: center;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
`;

const DaysOfTheWeek = styled.ul`
  display: flex;
  margin: 0 calc(0.25rem + 1.5px);

  li {
    flex: 1;
    font-weight: 300;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const DaysCtrl = styled.div`
  padding: 0.25rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
`;
