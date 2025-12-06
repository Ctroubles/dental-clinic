import { BaseError } from "@/shared/errors/base-error"

export abstract class InfrastructureError extends BaseError {
  public static get name(): string {
    return "InfrastructureError"
  }
  public readonly name = InfrastructureError.name
}
