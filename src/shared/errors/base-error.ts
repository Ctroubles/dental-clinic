import { logger } from "~/config/logger"

export class BaseError extends Error {
  public static get name(): string {
    return "BaseError"
  }
  public readonly name = BaseError.name

  public static readonly None = new BaseError("", "")

  constructor(
    public readonly code: string,
    public readonly description: string,
    options?: ErrorOptions
  ) {
    super(description, options)
  }

  get isNone(): boolean {
    return BaseError.None === this
  }
}
