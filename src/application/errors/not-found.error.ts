import { ApplicationError } from "./application.error"

export class NotFoundError extends ApplicationError {
  public static get name(): string {
    return "NotFoundError"
  }
  public readonly name = NotFoundError.name

  constructor(message: string, options?: ErrorOptions) {
    super(NotFoundError.name, message, options)
  }
}
