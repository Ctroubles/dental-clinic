import mongoose, { Model, PopulateOptions } from "mongoose"
import {
  IPageableRequest,
  PageableResult,
} from "@/application/common/pagination"
import { IBaseRepository } from "@/application/repositories/base.repository.interface"
import { PersistenceSession } from "@/application/repositories/persistence-session.interface"

export abstract class BaseRepository<
  TEntity,
  TDocument,
  TFilters = Record<string, unknown>,
> implements IBaseRepository<TEntity, TFilters>
{
  protected abstract model: Model<TDocument>
  protected abstract mapDocumentToEntity(doc: TDocument | null): TEntity | null
  protected abstract mapDocumentsToEntities(docs: TDocument[]): TEntity[] | null
  protected abstract buildQuery(
    test?: TFilters
  ): Promise<Record<string, unknown>>
  protected abstract getPopulateConfig(
    includes?: Array<keyof TEntity>
  ): (PopulateOptions | string)[]

  async startSession(): Promise<PersistenceSession> {
    const session = await mongoose.startSession()

    if (!session.id) {
      throw new Error("Session ID is missing")
    }
    return session
  }

  async findAll(
    request: IPageableRequest<TFilters>,
    includes?: Array<keyof TEntity>
  ): Promise<PageableResult<TEntity>> {
    const query = await this.buildQuery(request.filters)

    const mongooseQuery = this.model.find(query)

    const populateConfig = this.getPopulateConfig(includes)

    if (populateConfig.length > 0) {
      for (const populate of populateConfig) {
        mongooseQuery.populate(populate as PopulateOptions)
      }
    }
    mongooseQuery.sort({ createdAt: -1 })
    mongooseQuery.skip((request.page - 1) * request.pageSize)
    mongooseQuery.limit(request.pageSize)

    const [records, totalRecords] = await Promise.all([
      mongooseQuery.exec(),
      this.model.countDocuments(query).exec(),
    ])

    const entities = this.mapDocumentsToEntities(records) || []

    return new PageableResult<TEntity>(
      entities,
      totalRecords,
      request.page,
      request.pageSize
    )
  }

  async findById(id: string): Promise<TEntity | null> {
    const document = await this.model.findById(id)
    return this.mapDocumentToEntity(document)
  }
}
