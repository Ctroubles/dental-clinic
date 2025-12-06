import { NotFoundError, ValidationError } from "@/application/errors"
import { IUpdatePatientUseCase } from "@/application/use-cases/patients/update-patient.use-case"
import {
  Patient,
  PatientInsert,
  patientInsertSchema,
} from "@/domain/entities/patient"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(patient: Patient): Patient {
  return {
    ...patient,
    id: patient.id.toString(),
    createdBy: patient.createdBy.toString(),
    updatedBy: patient.updatedBy?.toString(),
  }
}

export type IUpdatePatientController = ReturnType<
  typeof updatePatientController
>

export const updatePatientController =
  (updatePatientUseCase: IUpdatePatientUseCase) =>
  async (
    input: { patientId: string; updatedPatient: PatientInsert },
    userId: string
  ): Promise<DataResult<Patient>> => {
    // Convert dateOfBirth string back to Date object if it exists
    const processedPatient = {
      ...input.updatedPatient,
      dateOfBirth: input.updatedPatient.dateOfBirth
        ? new Date(input.updatedPatient.dateOfBirth)
        : input.updatedPatient.dateOfBirth,
    }

    const { data, error: parseError } =
      patientInsertSchema.safeParse(processedPatient)
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await updatePatientUseCase(
      { patientId: input.patientId, updatedPatient: data },
      userId
    )
    if (!response) {
      return DataResult.failure(
        new NotFoundError(`Paciente con ID ${input.patientId} no encontrado.`)
      )
    }
    return DataResult.success(presenter(response))
  }
