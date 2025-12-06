import { NotFoundError } from "@/application/errors"
import { IDeleteVisitUseCase } from "@/application/use-cases/visits/delete-visit.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IDeleteVisitController = ReturnType<typeof deleteVisitController>

export const deleteVisitController =
  (deleteVisitUseCase: IDeleteVisitUseCase) =>
  async (input: { visitId: string }): Promise<DataResult<void>> => {
    const deletedVisit = await deleteVisitUseCase(input)

    if (!deletedVisit) {
      return DataResult.failure(
        new NotFoundError(`Visita con ID ${input.visitId} no encontrada.`)
      )
    }

    return DataResult.success(null)
  }
