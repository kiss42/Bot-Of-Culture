import dayjs from 'dayjs'

export const toNormalDate = (timestamp: number | string | Date): string => {
  return dayjs(timestamp).format('MMMM D, YYYY')
}
