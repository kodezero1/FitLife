export const round = (value: number, precision: number) => {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

export const formatSetRepsAndWeight = (val: number | string) => {
  return parseFloat(val as string) === -1 ? 0 : parseFloat(val as string)
}
