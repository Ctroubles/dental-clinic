import { IPatientLookupService } from "@/application/services/patient-lookup.service.interface"
import { PatientInsert } from "@/domain/entities/patient"

export type ILookupPatientByDniUseCase = ReturnType<
  typeof lookupPatientByDniUseCase
>

export const lookupPatientByDniUseCase =
  (patientLookupService: IPatientLookupService) =>
  async ({ dni }: { dni: string }): Promise<PatientInsert | null> => {
    return await patientLookupService.lookupByDni(dni)
  }
