import { ApplicationError } from "./application.error"

export class UnauthorizedError extends ApplicationError {
  public static get name(): string {
    return "UnauthorizedError"
  }
  public readonly name = UnauthorizedError.name

  constructor(message: string, options?: ErrorOptions) {
    super(UnauthorizedError.name, message, options)
  }
}
