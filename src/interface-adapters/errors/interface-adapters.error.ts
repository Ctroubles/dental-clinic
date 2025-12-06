import { BaseError } from "@/shared/errors/base-error"

export class InterfaceAdaptersError extends BaseError {
  public static get name(): string {
    return "InterfaceAdaptersError"
  }
  public readonly name = InterfaceAdaptersError.name
}
