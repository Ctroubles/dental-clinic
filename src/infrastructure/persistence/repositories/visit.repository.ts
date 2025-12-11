import { ClientSession, Model, PopulateOptions, Types } from "mongoose"
import { logger } from "~/config"
import {
  IVisitRepository,
  VisitsFilters,
} from "@/application/repositories/visit.repository.interface"
import { Visit, VisitInsert } from "@/domain/entities/visit"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  VisitDocument,
  VisitModel,
} from "@/infrastructure/persistence/mongoose/models"
import { PatientModel } from "@/infrastructure/persistence/mongoose/models"
import { DoctorModel } from "@/infrastructure/persistence/mongoose/models"
import {
  mapVisitDocumentsToEntities,
  mapVisitDocumentToEntity,
} from "../mappers"
import { BaseRepository } from "./base.repository"

export class VisitRepository
  extends BaseRepository<Visit, VisitDocument, VisitsFilters>
  implements IVisitRepository
{
  protected readonly model: Model<VisitDocument>
  protected readonly mapDocumentToEntity: (
    doc: VisitDocument | null
  ) => Visit | null
  protected readonly mapDocumentsToEntities: (
    docs: VisitDocument[]
  ) => Visit[] = docs => {
    return docs
      .map(this.mapDocumentToEntity)
      .filter((visit): visit is Visit => visit !== null)
  }

  constructor() {
    super()
    this.model = VisitModel
    this.mapDocumentToEntity = mapVisitDocumentToEntity
  }

  protected async buildQuery(
    filters?: VisitsFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> & {
      $or?: Array<Record<string, unknown>>
    } = {}

    if (filters?.patientId) {
      query.patientId = new Types.ObjectId(filters.patientId)
    }

    if (filters?.doctorId) {
      query.doctorId = new Types.ObjectId(filters.doctorId)
    }

    if (filters?.search) {
      // TODO: validate and sanitize search input
      const searchRegex = new RegExp(filters.search, "i")

      const matchingPatients = await PatientModel.find({
        $or: [
          { dni: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
        ],
      })
        .select("_id")
        .exec()

      const matchingDoctors = await DoctorModel.find({
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
      })
        .select("_id")
        .exec()

      const patientIds = matchingPatients.map(p => p._id)
      const doctorIds = matchingDoctors.map(d => d._id)

      query.$or = [
        { patientId: { $in: patientIds } },
        { doctorId: { $in: doctorIds } },
      ]
    }

    return query
  }

  protected getPopulateConfig(
    includes?: Array<keyof Visit>
  ): (PopulateOptions | string)[] {
    if (!includes) {
      return []
    }
    return includes.map(include => {
      switch (include) {
        case "patient":
          return {
            path: "patient",
            model: "Patient",
            select: "dni firstName lastName",
          }
        case "doctor":
          return {
            path: "doctor",
            model: "Doctor",
            select: "firstName lastName",
          }
        case "location":
          return {
            path: "location",
            model: "Location",
            select: "name",
          }
        default:
          throw new DatabaseOperationError(`Invalid include: ${include}`)
      }
    })
  }

  async findById(
    id: Visit["id"],
    session?: ClientSession
  ): Promise<Visit | null> {
    try {
      const query = VisitModel.findById(id)
        .populate("patient")
        .populate("doctor")
        .populate("location")
        .populate("payments")
        .populate("charges")

      if (session) {
        query.session(session)
      }

      const visit = await query

      return mapVisitDocumentToEntity(visit)
    } catch (error) {
      logger.error("[VisitRepository] Error finding visit by ID", error)
      throw new DatabaseOperationError(error)
    }
  }

  async findByPatientId(patientId: string): Promise<Visit[]> {
    try {
      const visits = await VisitModel.find({ patientId })
        .sort({ createdAt: -1 })
        .populate("patient")
        .populate("doctor")

      return mapVisitDocumentsToEntities(visits) ?? []
    } catch (error) {
      logger.error(
        "[VisitRepository] Error finding visits by patient ID",
        error
      )
      throw new DatabaseOperationError(error)
    }
  }

  async delete(id: Visit["id"]): Promise<Visit | null> {
    try {
      const visitToDelete = await VisitModel.findById(id)
        .populate("patient")
        .populate("doctor")

      if (!visitToDelete) {
        return null
      }

      await VisitModel.findByIdAndDelete(id)

      return mapVisitDocumentToEntity(visitToDelete)
    } catch (error) {
      logger.error("[VisitRepository] Error deleting visit", error)
      throw new DatabaseOperationError(error)
    }
  }
}
