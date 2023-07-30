import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { formatRoutineForCalendar } from "../../utils";
import { getRoutineFromId } from "../../api-lib/fetchers";
// Components
import Calendar from "../builder/routine/Calendar";
// Interface
import { Routine } from "../../types";

interface Props {
  routine: Routine;
}

const RoutineCalendar: React.FC<Props> = ({ routine }) => {
  const [datesSelected, setDatesSelected] = useState({});
  const [calendarData, setCalendarData] = useState({});

  // Get the routine data from DB and format it for calendar
  useEffect(() => {
    const getCalendarData = async () => {
      const routineData = await getRoutineFromId(routine._id);

      if (routineData) setCalendarData(formatRoutineForCalendar(routineData.workoutPlan));
    };
    getCalendarData();
  }, [routine]);

  return (
    <Container>
      <h3 className="title">Schedule</h3>

      <Calendar
        data={calendarData}
        datesSelected={datesSelected}
        setDatesSelected={setDatesSelected}
      />
    </Container>
  );
};
export default RoutineCalendar;

const Container = styled.div`
  background: ${({ theme }) => theme.background};
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;
