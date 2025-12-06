import { MongooseError } from "mongoose"
import { InfrastructureError } from "./infrastructure.error"

export class DatabaseOperationError extends InfrastructureError {
  public static get name(): string {
    return "DatabaseOperationError"
  }
  public readonly name = DatabaseOperationError.name

  constructor(error: unknown, options?: ErrorOptions) {
    const message =
      error instanceof MongooseError
        ? `Error connecting to the database in ORM (MongooseError): ${error.message}`
        : error instanceof Error
          ? `Error connecting to the database (Error): ${error.message}`
          : typeof error === "string"
            ? `Error connecting to the database (String): ${error}`
            : `Unknown error connecting to the database (UnknownError): ${error}`

    super(DatabaseOperationError.name, message, options)
  }
}
