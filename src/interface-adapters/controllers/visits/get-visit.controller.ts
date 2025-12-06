import { NotFoundError, ValidationError } from "@/application/errors"
import { IGetVisitByIdUseCase } from "@/application/use-cases/visits/get-visit.use-case"
import { mongoObjectId } from "@/domain/entities/_base"
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

export type IGetVisitByIdController = ReturnType<typeof getVisitByIdController>

export const getVisitByIdController =
  (getVisitUseCase: IGetVisitByIdUseCase) =>
  async (visitId: string): Promise<DataResult<Visit>> => {
    const validationResult = controllerValidator(visitId)
    if (!validationResult.success) {
      return DataResult.failure(validationResult.error)
    }

    const visitFound = await getVisitUseCase({ visitId: validationResult.data })

    if (!visitFound) {
      return DataResult.failure(
        new NotFoundError(`Visita con ID ${visitId} no encontrada.`)
      )
    }

    return DataResult.success(presenter(visitFound))
  }

const controllerValidator = (visitId: string) => {
  const parseResult = mongoObjectId.safeParse(visitId)
  if (!parseResult.success) {
    return {
      success: false as const,
      error: new ValidationError(parseResult.error),
    }
  }
  return {
    success: true as const,
    data: parseResult.data,
  }
}
