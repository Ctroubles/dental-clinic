import { NotFoundError } from "@/application/errors"
import { IUpdateVisitUseCase } from "@/application/use-cases/visits/update-visit.use-case"
import { Visit, VisitInsert } from "@/domain/entities/visit"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(visit: Visit): Visit {
  return {
    ...visit,
    id: visit.id.toString(),
    createdBy: visit.createdBy.toString(),
    updatedBy: visit.updatedBy?.toString(),
  }
}

export type IUpdateVisitController = ReturnType<typeof updateVisitController>

export const updateVisitController =
  (updateVisitUseCase: IUpdateVisitUseCase) =>
  async (
    input: { id: string; data: VisitInsert },
    updatedBy: string
  ): Promise<DataResult<Visit>> => {
    const updatedVisit = await updateVisitUseCase(
      { id: input.id, data: input.data },
      updatedBy
    )

    if (!updatedVisit) {
      return DataResult.failure(
        new NotFoundError(`Visita con ID ${input.id} no encontrada.`)
      )
    }
    return DataResult.success(presenter(updatedVisit))
  }
