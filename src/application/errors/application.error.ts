import { BaseError } from "@/shared/errors/base-error"

export abstract class ApplicationError extends BaseError {
  public static get name(): string {
    return "ApplicationError"
  }
  public readonly name = ApplicationError.name

  // constructor(message: string, options?: ErrorOptions) {
  //   super(ApplicationError.name, message, options)
  // }
}
