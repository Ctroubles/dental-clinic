import { ValidationError } from "@/application/errors"
import { ICreatePatientUseCase } from "@/application/use-cases/patients/create-patient.use-case"
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

export type ICreatePatientController = ReturnType<
  typeof createPatientController
>

export const createPatientController =
  (createPatientUseCase: ICreatePatientUseCase) =>
  async (
    input: {
      newPatient: PatientInsert
    },
    userId: string
  ): Promise<DataResult<Patient>> => {
    const processedPatient = {
      ...input.newPatient,
      dateOfBirth: input.newPatient.dateOfBirth
        ? new Date(input.newPatient.dateOfBirth)
        : input.newPatient.dateOfBirth,
    }

    const { data, error: parseError } =
      patientInsertSchema.safeParse(processedPatient)
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await createPatientUseCase({ newPatient: data }, userId)
    return DataResult.success(presenter(response))
  }
