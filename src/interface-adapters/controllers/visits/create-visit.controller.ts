import { ValidationError } from "@/application/errors"
import { ICreateVisitUseCase } from "@/application/use-cases/visits/create-visit.use-case"
import { Visit, VisitInsert, visitInsertSchema } from "@/domain/entities/visit"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(visit: Visit): Visit {
  return {
    ...visit,
    id: visit.id.toString(),
    createdBy: visit.createdBy.toString(),
    updatedBy: visit.updatedBy?.toString(),
  }
}

export type ICreateVisitController = ReturnType<typeof createVisitController>

export const createVisitController =
  (createVisitUseCase: ICreateVisitUseCase) =>
  async (
    input: {
      newVisit: VisitInsert
    },
    userId: string
  ): Promise<DataResult<Visit>> => {
    const { data, error: parseError } = visitInsertSchema.safeParse({
      ...input.newVisit,
      date: new Date(input.newVisit.date),
    })
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await createVisitUseCase({ newVisit: data }, userId)
    return DataResult.success(presenter(response))
  }
