import { ApplicationError } from "./application.error"

export class AuthenticationError extends ApplicationError {
  public static get name(): string {
    return "AuthenticationError"
  }
  public readonly name = AuthenticationError.name

  constructor(message: string, options?: ErrorOptions) {
    super(AuthenticationError.name, message, options)
  }
}
