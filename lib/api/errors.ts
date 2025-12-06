export interface ApiErrorPayload {
  message: string
  code: string
}

export class ApiError extends Error {
  code?: string

  constructor(payload: ApiErrorPayload) {
    const msg = payload.message || payload.code || "Unknown error"

    super(msg)

    this.name = "ApiError"
    this.message = msg
    this.code = payload.code
  }
}
