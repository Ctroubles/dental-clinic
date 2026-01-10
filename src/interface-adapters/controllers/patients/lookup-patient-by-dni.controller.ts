import { NotFoundError } from "@/application/errors"
import { ILookupPatientByDniUseCase } from "@/application/use-cases/patients/lookup-patient-by-dni.use-case"
import { PatientInsert } from "@/domain/entities/patient"
import { DataResult } from "@/shared/result-handling/data-result"

export type ILookupPatientByDniController = ReturnType<
  typeof lookupPatientByDniController
>

export const lookupPatientByDniController =
  (lookupPatientByDniUseCase: ILookupPatientByDniUseCase) =>
  async (dni: string): Promise<DataResult<PatientInsert>> => {
    const response = await lookupPatientByDniUseCase({ dni })

    if (!response) {
      return DataResult.failure(
        new NotFoundError(`No se encontró información para el DNI ${dni}`)
      )
    }

    return DataResult.success(response)
  }
