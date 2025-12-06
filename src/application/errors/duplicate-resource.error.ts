import { ApplicationError } from "./application.error"

export class DuplicateResourceError extends ApplicationError {
  public static get name(): string {
    return "DuplicateResourceError"
  }
  public readonly name = DuplicateResourceError.name

  constructor(message: string, options?: ErrorOptions) {
    super(DuplicateResourceError.name, message, options)
  }
}
