import { makeQuery } from "~/lib/api/queryFactory"
import { type IGetLocationsUseCaseInput } from "@/application/use-cases/locations/get-locations.use-case"
import { queryKeys } from "../../constants"
import { getLocationById, getLocations } from "../../requests"

export const { useHook: useGetLocations } = makeQuery(
  (filters?: IGetLocationsUseCaseInput) => ({
    queryFn: () => getLocations(filters),
    queryKey: queryKeys.list(filters),
  })
)

export const { useHook: useGetLocationById } = makeQuery((id: string) => ({
  queryFn: () => getLocationById(id),
  queryKey: queryKeys.detail(id),
  enabled: !!id && id !== "nuevo",
}))
