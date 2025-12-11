import { Model, PopulateOptions } from "mongoose"
import { logger } from "~/config"
import {
  DoctorsFilters,
  IDoctorRepository,
} from "@/application/repositories/doctor.repository.interface"
import { Doctor, DoctorInsert } from "@/domain/entities/doctor"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  DoctorDocument,
  DoctorModel,
} from "@/infrastructure/persistence/mongoose/models"
import {
  mapDoctorDocumentsToEntities,
  mapDoctorDocumentToEntity,
} from "../mappers"
import { BaseRepository } from "./base.repository"

export class DoctorRepository
  extends BaseRepository<Doctor, DoctorDocument, DoctorInsert, DoctorsFilters>
  implements IDoctorRepository
{
  protected readonly model: Model<DoctorDocument>
  protected readonly mapDocumentToEntity: (
    doc: DoctorDocument | null
  ) => Doctor | null
  protected readonly mapDocumentsToEntities: (
    docs: DoctorDocument[]
  ) => Doctor[]

  constructor() {
    super()
    this.model = DoctorModel
    this.mapDocumentToEntity = mapDoctorDocumentToEntity
    this.mapDocumentsToEntities = mapDoctorDocumentsToEntities
  }

  protected async buildQuery(
    filters?: DoctorsFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> = {}

    if (filters?.gender) {
      query.gender = filters.gender
    }

    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, "i")
      query.$or = [{ firstName: searchRegex }, { lastName: searchRegex }]
    }

    return query
  }

  protected override getPopulateConfig(
    includes?: Array<keyof Doctor>
  ): (PopulateOptions | string)[] {
    const populateConfig: (PopulateOptions | string)[] = []

    return populateConfig
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    try {
      const doctor = (await DoctorModel.findOne({
        userId,
      })) as DoctorDocument | null
      if (!doctor) {
        return null
      }
      return mapDoctorDocumentToEntity(doctor)
    } catch (error) {
      logger.error("[DoctorRepository] Error finding doctor by user ID", error)
      throw new DatabaseOperationError(error)
    }
  }

  async create(doctor: DoctorInsert, createdBy: string): Promise<Doctor> {
    try {
      const doctorData = {
        ...doctor,
        createdBy,
      }
      const newDoctor = await DoctorModel.create(doctorData)
      if (!newDoctor) {
        throw new DatabaseOperationError("No se pudo crear el doctor.")
      }
      const newDoctorEntity = mapDoctorDocumentToEntity(newDoctor)
      if (!newDoctorEntity) {
        throw new DatabaseOperationError("No se pudo mapear el doctor.")
      }

      return newDoctorEntity
    } catch (error) {
      logger.error("[DoctorRepository] Error creating doctor", error)
      throw new DatabaseOperationError(error)
    }
  }

  async delete(id: Doctor["id"]): Promise<void> {
    try {
      await DoctorModel.findByIdAndDelete(id)
    } catch (error) {
      logger.error("[DoctorRepository] Error deleting doctor", error)
      throw new DatabaseOperationError(error)
    }
  }
}
