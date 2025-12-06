import {
  AuthenticationError,
  DuplicateResourceError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  ValidationError,
} from "@/application/errors"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import { BaseError } from "@/shared/errors/base-error"
import { DataResult } from "@/shared/result-handling/data-result"

export const mapResultToResponse = <T>(
  result: DataResult<T>,
  requestId: string
) => {
  let status: number
  if (result.isSuccess) {
    status = 200
  } else if (result.error.code === AuthenticationError.name) {
    status = 401
  } else if (result.error.code === UnauthenticatedError.name) {
    status = 401
  } else if (result.error.code === UnauthorizedError.name) {
    status = 403
  } else if (result.error.code === NotFoundError.name) {
    status = 404
  } else if (result.error.code === DuplicateResourceError.name) {
    status = 409
  } else if (result.error.code === ValidationError.name) {
    status = 400
  } else if (result.error.code === DatabaseOperationError.name) {
    status = 500
  } else {
    status = 500
  }

  const headers: HeadersInit = {
    "X-Request-ID": requestId,
  }

  const responseBody: {
    isSuccess: boolean
    isFailure: boolean
    data: T | null
    error: BaseError
    requestId: string
  } = {
    isSuccess: result.isSuccess,
    isFailure: result.isFailure,
    error: result.error,
    requestId,
    data: result.data,
  }

  return Response.json(responseBody, {
    headers,
    status,
  })
}
