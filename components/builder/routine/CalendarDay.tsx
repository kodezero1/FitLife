import React from "react";
import styled from "styled-components";

import { CalendarData } from "./Calendar";

interface Props {
  dayData: CalendarData["isoDate"];
  year: number;
  month: number;
  day: number;
  datesSelected: { [date: string]: boolean };
  setDatesSelected: React.Dispatch<React.SetStateAction<{ [date: string]: boolean }>>;
  showWorkoutTags: boolean;
  multiSelectMode: boolean;
  copyWorkoutsMode: boolean;
  copyWorkoutsToStartDate?: (date: string) => void;
  isMobileDevice: boolean;
}

const CalendarDay: React.FC<Props> = ({
  dayData,
  year,
  month,
  day,
  datesSelected,
  setDatesSelected,
  showWorkoutTags,
  multiSelectMode,
  copyWorkoutsMode,
  copyWorkoutsToStartDate,
  isMobileDevice,
}) => {
  const formatDate = (y: string | number, m: string | number, d: string | number) => {
    y = y.toString();
    m = m.toString();
    d = d.toString();
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  };

  const dayIsSelected = datesSelected[formatDate(year, month, day)];

  const handleTouchStart = () => {
    const targetDate = formatDate(year, month, day);

    if (copyWorkoutsMode && copyWorkoutsToStartDate) {
      copyWorkoutsToStartDate(targetDate);
    } else if (multiSelectMode) {
      // If day is already selected, remove it. Otherwise, add it.
      dayIsSelected
        ? setDatesSelected((prev) => {
            var copy = Object.assign({}, prev);
            delete copy[targetDate];
            return copy;
          })
        : setDatesSelected({ ...datesSelected, [targetDate]: true });
    } else {
      // It day is the only day selected, remove it. Otherwise, make it the only day selected
      dayIsSelected && Object.keys(datesSelected).length === 1
        ? setDatesSelected({})
        : setDatesSelected({ [targetDate]: true });
    }
  };

  const handleTouchMove = (e) => {
    if (copyWorkoutsMode) return;

    let target: any | null;
    const touch = e.touches[0] || e.changedTouches[0];
    target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target?.classList.contains("date")) {
      const targetDate = formatDate(year, month, target.innerText);
      if (!datesSelected[targetDate]) {
        setDatesSelected({ ...datesSelected, [targetDate]: true });
      }
    }
  };

  return (
    <Container
      className={`day 
    ${dayIsSelected && "selected"}
    ${dayData && "hasWorkout"}
    ${dayIsSelected && dayData && "selectedAndHasWorkout"}
    `}
      onTouchStart={() => isMobileDevice && handleTouchStart()}
      onTouchMove={(e) => isMobileDevice && handleTouchMove(e)}
      onMouseDown={() => !isMobileDevice && handleTouchStart()}
    >
      <div className="date">{day}</div>

      {showWorkoutTags && dayIsSelected && dayData && (
        <Tag>
          <p>{dayData.workoutName || dayData.workout?.name || "On the fly"}</p>
          <span />
        </Tag>
      )}
    </Container>
  );
};
export default CalendarDay;

const Container = styled.div`
  margin: 2px;
  color: ${({ theme }) => theme.textLight};
  position: relative;
  user-select: none;
  transition: border-radius 0.25s ease-out;
  touch-action: none;

  .date {
    border-radius: 5px;
    display: grid;
    place-items: center;
    height: 40px;
    width: 40px;
    margin: auto;
    font-weight: 300;
    cursor: pointer;
  }

  &.selected .date {
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.text};
  }
  &.hasWorkout .date {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
  }
  &.selectedAndHasWorkout .date {
    background: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accentText};
  }
`;

const Tag = styled.div`
  display: flex;
  flex-direction: column;
  pointer-events: none;

  max-width: 150px;
  padding: 0.15rem 0.25rem;
  z-index: 99;
  border-radius: 3px;

  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  background: ${({ theme }) => theme.buttonMed};
  color: ${({ theme }) => theme.text};

  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: customFadeInUp;

  filter: drop-shadow(0px 0px 1px ${({ theme }) => theme.boxShadow});

  @keyframes customFadeInUp {
    from {
      top: -15px;
      opacity: 0;
    }
    to {
      top: -20px;
      opacity: 1;
    }
  }

  p {
    font-weight: 400;
    font-size: 0.75rem;
    overflow-x: hidden;
    overflow-y: visible;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span {
    height: 0;
    width: 0;
    margin: 0 auto;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-top-color: ${({ theme }) => theme.buttonMed};
      border-bottom: 0;
      margin-left: -10px;
      margin-bottom: -10px;
    }
  }
`;
