export interface IUserWordUsage {
  planId: number
  planActiveName: string
  wordLimit: number
  usedWord: number
  percentage: number
  dateExpiration: Date
  isOverLimit: boolean
  planActivePrice: number
}
