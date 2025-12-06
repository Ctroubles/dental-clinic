import { BaseError } from "@/shared/errors/base-error"

export abstract class DomainError extends BaseError {
  public static get name(): string {
    return "DomainError"
  }
  public readonly name = DomainError.name
}
