import { NotFoundError } from "@/application/errors"
import { IGetPatientUseCase } from "@/application/use-cases/patients/get-patient.use-case"
import { Patient } from "@/domain/entities/patient"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(patient: Patient): Patient {
  return {
    ...patient,
    id: patient.id.toString(),
    createdBy: patient.createdBy.toString(),
    updatedBy: patient.updatedBy?.toString(),
  }
}

export type IGetPatientController = ReturnType<typeof getPatientController>

export const getPatientController =
  (getPatientUseCase: IGetPatientUseCase) =>
  async (patientId: string): Promise<DataResult<Patient>> => {
    const response = await getPatientUseCase({ patientId })
    if (!response) {
      return DataResult.failure(
        new NotFoundError(`Paciente con ID ${patientId} no encontrado.`)
      )
    }
    return DataResult.success(presenter(response))
  }
