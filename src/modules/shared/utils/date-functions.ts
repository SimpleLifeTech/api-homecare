import { differenceInMinutes } from "date-fns"

export function calculateRemainingDays(dataString: string): number {
  const currentDate = new Date()
  const providedDate = new Date(dataString)

  const oneDayInMilliseconds = 24 * 60 * 60 * 1000
  const timeDifferenceInMilliseconds = providedDate.getTime() - currentDate.getTime()

  const remainingDays = Math.ceil(timeDifferenceInMilliseconds / oneDayInMilliseconds)
  return remainingDays
}

export function isValidToken(tokenSentAt: Date, minutesToCheck: number): boolean {
  const diff = differenceInMinutes(new Date(), tokenSentAt)

  return diff > minutesToCheck ? true : false
}
