import { makeQuery } from "~/lib/api/queryFactory"
import { type IGetVisitsUseCaseInput } from "@/application/use-cases/visits/get-visits.use-case"
import { visitsQueryKeys } from "../../constants"
import { getVisitById, getVisits } from "../../requests"

export const { useHook: useGetVisits } = makeQuery(
  (request?: IGetVisitsUseCaseInput) => ({
    queryFn: () => getVisits(request),
    queryKey: visitsQueryKeys.list(request),
  })
)

export const { useHook: useGetVisitById } = makeQuery((visitId: string) => ({
  queryFn: () => getVisitById(visitId),
  queryKey: visitsQueryKeys.getById(visitId),
  enabled: !!visitId && visitId !== "nueva",
}))
