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
          return {
            path: "visits",
            populate: [
              {
                path: "doctor",
              },
              {
                path: "payments",
              },
              {
                path: "location",
              },
              {
                path: "charges",
              },
            ],
            options: {
              sort: {
                date: -1,
              },
            },
          }
        case "charges":
          return {
            path: "charges",
            populate: [
              {
                path: "item",
              },
              {
                path: "doctor",
              },
            ],
            options: {
              sort: {
                createdAt: -1,
              },
            },
          }
        default:
          return include
      }
    })
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

  async create(patient: PatientInsert, createdBy: string): Promise<Patient> {
    const newPatient = await PatientModel.create({ ...patient, createdBy })
    if (!newPatient) {
      throw new DatabaseOperationError("No se pudo crear el paciente.")
    }
    const newPatientEntity = mapPatientDocumentToEntity(newPatient)
    if (!newPatientEntity) {
      throw new DatabaseOperationError("No se pudo mapear el paciente.")
    }
    return newPatientEntity
  }

  async delete(id: Patient["id"]): Promise<void> {
    await PatientModel.findByIdAndDelete(id)
  }
}
