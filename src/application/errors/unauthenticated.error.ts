import { ApplicationError } from "./application.error"

export class UnauthenticatedError extends ApplicationError {
  public static get name(): string {
    return "UnauthenticatedError"
  }
  public readonly name = UnauthenticatedError.name

  constructor(message: string, options?: ErrorOptions) {
    super(UnauthenticatedError.name, message, options)
  }
}
