import React from "react";
import styled from "styled-components";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Bar,
} from "recharts";
import { ChartData } from ".";
import { Exercise } from "../../../types";
import { formatMilliseconds } from "../../../utils";
import { useThemeState } from "../../Themes/useThemeState";

interface Props {
  data: ChartData;
  metric: Exercise["metric"];
  style: React.CSSProperties;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const Chart: React.FC<Props> = ({ data, metric, style, setSelectedDate }) => {
  const { theme } = useThemeState();

  return (
    <ChartContainer style={style}>
      {metric === "weight" && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: -25, bottom: 0 }}
            onClick={(data) => setSelectedDate(data?.activeLabel || "")}
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
      )}

      {metric === "time" && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            margin={{ top: 20, right: 20, left: -8, bottom: 0 }}
            data={data}
            onClick={(data) => setSelectedDate(data?.activeLabel || "")}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(val) => formatMilliseconds(val).split(".")[0]} />
            <Tooltip formatter={(value, name, props) => [props.payload.timeString]} />
            <Bar dataKey="timeMs" fill={theme.accent} label={"date"} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};
export default Chart;

export const ChartContainer = styled.div`
  overflow: hidden;
  background: ${({ theme }) => theme.medOpacity};
  width: 100%;
  height: 200px;
  border-radius: 5px 5px 5px 5px;

  line,
  text {
    fill: ${({ theme }) => theme.textLight} !important;
    stroke: ${({ theme }) => theme.border} !important;
  }
  text {
    stroke-width: 0px;
    font-size: 0.65rem;
  }

  .recharts-rectangle.recharts-tooltip-cursor {
    fill: ${({ theme }) => theme.medOpacity} !important;
  }

  .recharts-default-tooltip {
    padding: 0.15rem 0.5rem !important;
    font-size: 0.8rem !important;
    background: ${({ theme }) => theme.body} !important;
    border-radius: 5px;
    border: 1px solid ${({ theme }) => theme.border} !important;
    text-align: center;

    * {
      color: ${({ theme }) => theme.text} !important;
    }
  }
`;
