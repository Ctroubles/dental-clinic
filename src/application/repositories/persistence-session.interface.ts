export interface PersistenceSession {
  startTransaction(): void
  commitTransaction(): Promise<void>
  abortTransaction(): Promise<void>
  endSession(): void
}
