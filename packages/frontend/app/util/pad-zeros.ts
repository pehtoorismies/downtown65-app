export const prefixZero = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`
}
export const suffixZero = (value: number): string => {
  return value < 10 ? `${value}0` : `${value}`
}
