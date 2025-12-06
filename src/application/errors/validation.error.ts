import { ZodError } from "zod"
import { ApplicationError } from "./application.error"
import { logger } from "~/config"

export class ValidationError<T> extends ApplicationError {
  public static get name(): string {
    return "ValidationError"
  }
  public readonly name = ValidationError.name

  constructor(error: ZodError<T>)
  constructor(message: string, options?: ErrorOptions)
  constructor(
    errorOrMessage: ZodError<string> | string,
    options?: ErrorOptions
  ) {
    if (errorOrMessage instanceof ZodError) {
      const errorsMessages = errorOrMessage.errors
        .map(error => error.message)
        .join(", ")

      logger.error("Validation errorOrMessage.errors (ZodError): ", errorOrMessage.errors)
      logger.error("Validation error (ZodError): ", errorsMessages)

      // console.log("TEST flatten METHOD: ", errorOrMessage.flatten())
      super(ValidationError.name, errorsMessages, { cause: errorOrMessage })
    } else {
      logger.error("Validation error (string): ", errorOrMessage)
      super(ValidationError.name, errorOrMessage, options)
    }
  }
}
