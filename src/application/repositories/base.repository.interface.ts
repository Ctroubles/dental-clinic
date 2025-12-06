import {
  IPageableRequest,
  PageableResult,
} from "@/application/common/pagination"
import { PersistenceSession } from "./persistence-session.interface"

export interface IBaseRepository<TEntity, TFilters = Record<string, unknown>> {
  startSession(): Promise<PersistenceSession>
  findAll(
    request: IPageableRequest<TFilters>,
    includes?: Array<keyof TEntity>
  ): Promise<PageableResult<TEntity>>
  findById(id: string): Promise<TEntity | null>
}
