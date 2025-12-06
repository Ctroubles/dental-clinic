import { BaseError } from "@/shared/errors/base-error"

type SuccessDataResult<T> = {
  readonly isSuccess: true
  readonly error: BaseError
  readonly data: T
}
type FailureDataResult = {
  readonly isSuccess: false
  readonly error: BaseError
  readonly data: null
}
export type DataResultType<T> = SuccessDataResult<T> | FailureDataResult

export class DataResult<T> {
  private constructor(
    private readonly _data: T | null,
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
    return this._isSuccess
  }

  get isFailure(): boolean {
    return !this._isSuccess
  }

  get error(): BaseError {
    return this._error
  }

  get data(): T | null {
    return this._data
  }

  static success<T>(data: T): DataResult<T> & SuccessDataResult<T> {
    return new DataResult<T>(data, true, BaseError.None) as DataResult<T> &
      SuccessDataResult<T>
  }

  static failure<T>(
    error: BaseError,
    data?: T | null
  ): DataResult<T> & FailureDataResult {
    return new DataResult<T>(data ?? null, false, error) as DataResult<T> &
      FailureDataResult
  }

  /**
   * Maps the value to a new type if successful
   */
  // map<U>(fn: (value: T) => U): DataResult<U> {
  //   if (this.isFailure) {
  //     return DataResult.failure<U>(this.error, null)
  //   }
  //   // TypeScript knows data is T here because isSuccess is true
  //   return DataResult.success(fn(this.data as T))
  // }

  /**
   * Maps the value to a new DataResult if successful
   */
  // flatMap<U>(fn: (value: T) => DataResult<U>): DataResult<U> {
  //   if (this.isFailure) {
  //     return DataResult.failure<U>(this.error)
  //   }
  //   // TypeScript knows data is T here because isSuccess is true
  //   return fn(this.data as T)
  // }
}
