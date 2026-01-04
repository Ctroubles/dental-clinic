import {
  IPageableRequest,
  PageableResult,
} from "@/application/common/pagination"
import { PersistenceSession } from "./persistence-session.interface"

export interface IBaseRepository<
  TEntity,
  IEntityInsert,
  TFilters = Record<string, unknown>,
> {
  startSession(): Promise<PersistenceSession>
  findAll(
    request: IPageableRequest<TFilters>,
    includes?: Array<keyof TEntity>
  ): Promise<PageableResult<TEntity>>
  findById(
    id: string,
    includes?: Array<keyof TEntity>,
    session?: PersistenceSession
  ): Promise<TEntity | null>
  create(
    entity: IEntityInsert,
    createdBy: string,
    session?: PersistenceSession
  ): Promise<TEntity>
  update(
    id: string,
    entity: IEntityInsert,
    updatedBy: string,
    session?: PersistenceSession
  ): Promise<TEntity | null>
  findOne(
    filters: TFilters,
    session?: PersistenceSession
  ): Promise<TEntity | null>
}
