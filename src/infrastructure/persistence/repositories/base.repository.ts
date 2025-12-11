import mongoose, { Model, PopulateOptions } from "mongoose"
import {
  IPageableRequest,
  PageableResult,
} from "@/application/common/pagination"
import { IBaseRepository } from "@/application/repositories/base.repository.interface"
import { PersistenceSession } from "@/application/repositories/persistence-session.interface"
import { DatabaseOperationError } from "../errors"

export abstract class BaseRepository<
  TEntity,
  TDocument,
  TEntityInsert,
  TFilters = Record<string, unknown>,
> implements IBaseRepository<TEntity, TEntityInsert, TFilters>
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

  async create(
    entity: TEntityInsert,
    createdBy: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<TEntity> {
    try {
      const entityData = {
        ...entity,
        createdBy,
      }

      const result = session
        ? await this.model.create([entityData], { session })
        : await this.model.create(entityData)

      const newDocument = Array.isArray(result) ? result[0] : result

      if (!newDocument) {
        throw new DatabaseOperationError(
          "There was an error creating the resource."
        )
      }

      const newEntity = this.mapDocumentToEntity(newDocument)
      if (!newEntity) {
        throw new DatabaseOperationError(
          "There was an error mapping the resource."
        )
      }
      return newEntity
    } catch (error) {
      throw new DatabaseOperationError(error)
    }
  }

  async update(
    id: string,
    entity: TEntityInsert,
    updatedBy: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<TEntity | null> {
    try {
      const entityData = {
        ...entity,
        updatedBy,
      }

      const query = this.model.findByIdAndUpdate(id, entityData, {
        new: true,
      })

      if (session) {
        query.session(session)
      }

      const updatedDocument = await query

      if (!updatedDocument) {
        return null
      }

      const updatedEntity = this.mapDocumentToEntity(updatedDocument)
      if (!updatedEntity) {
        throw new DatabaseOperationError(
          "There was an error mapping the resource."
        )
      }
      return updatedEntity
    } catch (error) {
      throw new DatabaseOperationError(error)
    }
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

  async findById(
    id: string,
    session?: mongoose.mongo.ClientSession
  ): Promise<TEntity | null> {
    const query = this.model.findById(id)

    if (session) {
      query.session(session)
    }

    const document = await query

    return this.mapDocumentToEntity(document)
  }

  async findOne(
    filters: TFilters,
    session?: mongoose.mongo.ClientSession
  ): Promise<TEntity | null> {
    const query = await this.buildQuery(filters)

    const dbQuery = this.model.findOne(query)

    if (session) {
      dbQuery.session(session)
    }

    const document = await dbQuery

    return this.mapDocumentToEntity(document)
  }
}
