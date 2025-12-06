import { IGetVisitsByPatientUseCase } from "@/application/use-cases/visits/get-visits-by-patient.use-case"
import { Visit } from "@/domain/entities/visit"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(visit: Visit): Visit {
  return {
    ...visit,
    id: visit.id.toString(),
    createdBy: visit.createdBy.toString(),
    updatedBy: visit.updatedBy?.toString(),
  }
}

export type IGetVisitsByPatientController = ReturnType<
  typeof getVisitsByPatientController
>

export const getVisitsByPatientController =
  (getVisitsByPatientUseCase: IGetVisitsByPatientUseCase) =>
  async (patientId: string): Promise<DataResult<Visit[]>> => {
    const response = await getVisitsByPatientUseCase({ patientId })
    return DataResult.success(response.map(presenter))
  }
