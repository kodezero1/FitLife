import { round } from '.'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export const getCurrYearMonthDay = () => {
  const date = dayjs()
  const currYear = date.get('year')
  const currMonth = date.get('month')
  const currDay = date.get('date')

  return { year: currYear, month: currMonth, day: currDay }
}

/**
 *
 * @param previous ISO date string or Dayjs object
 * @param current ISO date string or Dayjs object
 * @returns
 */
export const timeSince = (previous: string | dayjs.Dayjs, current: string | dayjs.Dayjs = dayjs()) => {
  return dayjs(previous).from(current)
}

/**
 *
 * @param iso1 ISO date string or Dayjs object
 * @param iso2 ISO date string or Dayjs object
 * @returns the number of days between two dates - can be negative if iso1 is after iso2
 */
export const daysBetween = (iso1: string | dayjs.Dayjs, iso2: string | dayjs.Dayjs) => {
  return dayjs(iso2).diff(dayjs(iso1), 'day')
}

/**
 *
 * @param date valid date string
 * @returns
 */
export const formatWorkoutLogDate = (date?: string | dayjs.Dayjs) => {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * @param date1 iso date string
 * @param date2 iso date string
 * @returns boolean signifying whether the two iso dates are the same day
 */
export const areTheSameDate = (date1: string, date2: string): boolean => {
  if (!date1 || !date2) return false
  return date1.substring(0, 10) === date2.substring(0, 10)
}

/**
 *
 * @param date1 ISO date string
 * @param date2 ISO date string
 * @returns true if the first date is before the second date, otherwise false
 */
export function dateCompare(date1: string, date2: string) {
  return dayjs(date1).isBefore(dayjs(date2))
}

/**
 *
 * @param duration time in milliseconds
 * @returns object with hours, minutes, seconds, and milliseconds
 */
export const msToTime = (duration: number) => {
  duration = duration * 100
  let milliseconds: number = round((duration % 1000) / 100, 0)
  let seconds: number = Math.floor((duration / 1000) % 60)
  let minutes: number = Math.floor((duration / (1000 * 60)) % 60)
  let hours: number = Math.floor(duration / (1000 * 60 * 60))
  return { hours, minutes, seconds, milliseconds }
}

/**
 *
 * @param hours
 * @param minutes
 * @param seconds
 * @param milliseconds
 * @returns milliseconds based on provided time parameters
 */
export const timeToMs = (hours: number, minutes: number, seconds: number, milliseconds: number) => {
  const hoursMs = hours * (1000 * 60 * 60)
  const minutesMs = minutes * (1000 * 60)
  const secondsMs = seconds * 1000
  return (hoursMs + minutesMs + secondsMs + milliseconds) / 100
}

/**
 *
 * @param ms milliseconds
 * @returns formatted string based on provided milliseconds
 */
export const formatMilliseconds = (ms: number) => {
  const { hours, minutes, seconds, milliseconds } = msToTime(ms)
  const pad = (digit: number) => (digit < 10 ? '0' + digit : digit.toString())
  const formattedMs = `${pad(milliseconds) === '00' ? '' : `.${pad(milliseconds)}`}`
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}${formattedMs}`
    : `${pad(minutes)}:${pad(seconds)}${formattedMs}`
}
