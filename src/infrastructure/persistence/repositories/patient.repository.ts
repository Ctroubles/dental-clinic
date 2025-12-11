import { Model, PopulateOptions } from "mongoose"
import {
  IPatientRepository,
  PatientsFilters,
} from "@/application/repositories/patient.repository.interface"
import { Patient, PatientInsert } from "@/domain/entities/patient"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  PatientDocument,
  PatientModel,
} from "@/infrastructure/persistence/mongoose/models"
import {
  mapPatientDocumentsToEntities,
  mapPatientDocumentToEntity,
} from "../mappers"
import { BaseRepository } from "./base.repository"

export class PatientRepository
  extends BaseRepository<
    Patient,
    PatientDocument,
    PatientInsert,
    PatientsFilters
  >
  implements IPatientRepository
{
  protected readonly model: Model<PatientDocument>
  protected readonly mapDocumentToEntity: (
    doc: PatientDocument | null
  ) => Patient | null
  protected readonly mapDocumentsToEntities: (
    docs: PatientDocument[]
  ) => Patient[]

  constructor() {
    super()
    this.model = PatientModel
    this.mapDocumentToEntity = mapPatientDocumentToEntity
    this.mapDocumentsToEntities = mapPatientDocumentsToEntities
  }

  protected async buildQuery(
    filters?: PatientsFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> = {}

    if (filters?.gender) {
      query.gender = filters.gender
    }

    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, "i")
      query.$or = [
        { dni: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
      ]
    }

    if (filters?.dni) {
      query.dni = filters.dni
    }

    return query
  }

  protected getPopulateConfig(
    includes?: (keyof PatientDocument)[]
  ): (PopulateOptions | string)[] {
    if (!includes) {
      return []
    }

    return includes.map(include => {
      switch (include) {
        case "visits":
          return "visits"
        case "charges":
          return "charges"
        default:
          return include
      }
    })
  }

  async findById(id: Patient["id"]): Promise<Patient | null> {
    const patient = await PatientModel.findById(id)
      .populate({
        path: "visits",
        populate: [
          {
            path: "doctor",
            select: "firstName lastName",
          },
          {
            path: "payments",
            populate: {
              path: "charge",
            },
          },
        ],
      })
      .populate({
        path: "charges",
        populate: [
          {
            path: "item",
            select: "name",
          },
          {
            path: "doctor",
            select: "firstName lastName",
          },
        ],
      })

    if (!patient) {
      return null
    }

    return mapPatientDocumentToEntity(patient)
  }

  async findByDni(dni: Patient["dni"]): Promise<Patient | null> {
    const patient = await PatientModel.findOne({
      dni,
    })

    if (!patient) {
      return null
    }
    return mapPatientDocumentToEntity(patient)
  }

  async delete(id: Patient["id"]): Promise<void> {
    await PatientModel.findByIdAndDelete(id)
  }
}
