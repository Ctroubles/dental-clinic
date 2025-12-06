export interface ApiResponse<T> {
  isSuccess: boolean
  isFailure: boolean
  error?: {
    code: string
    description: string
  }
  data?: T | null
}

/**
 * Represents a valid API response data.
 */
export type ApiResponseData =
  | string
  | number
  | boolean
  | null
  | { [prop: string]: ApiResponseData }
  | ApiResponseData[]
