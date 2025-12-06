import { BaseError } from "@/shared/errors/base-error"

export class Result {
  protected constructor(
    private readonly _isSuccess: boolean,
    private readonly _error: BaseError
  ) {
    if (this.isFailure && this.error.isNone) {
      throw new TypeError("Invalid error: Failure results must have an error")
    }

    if (this.isSuccess && !this.error.isNone) {
      throw new TypeError("Invalid error: Success results must have no error")
    }
  }

  get isSuccess(): boolean {
    return this.isSuccess
  }

  get isFailure(): boolean {
    return !this.isSuccess
  }

  get error(): BaseError {
    return this.error
  }

  static success(): Result {
    return new Result(true, BaseError.None)
  }

  static failure(error: BaseError): Result {
    if (error.isNone) {
      throw new TypeError("Failure result must have a non-None error")
    }
    return new Result(false, error)
  }
}
