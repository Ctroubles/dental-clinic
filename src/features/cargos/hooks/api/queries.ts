import { makeQuery } from "~/lib/api/queryFactory"
import { IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import { cargosQueryKeys } from "../../constants"
import {
  getCargos,
  getCargosByPatient,
  getCargosByVisit,
  getTrackedChargeById,
} from "../../requests"

export const { useHook: useGetCargos } = makeQuery(
  (request: IGetTrackedChargesUseCaseInput) => ({
    queryFn: () => getCargos(request),
    queryKey: cargosQueryKeys.list(request),
  })
)

export const { useHook: useGetTrackedChargeById } = makeQuery(
  (trackedChargeId: string) => ({
    queryFn: () => getTrackedChargeById(trackedChargeId),
    queryKey: cargosQueryKeys.detail(trackedChargeId),
  })
)

export const { useHook: useGetCargosByPatient } = makeQuery(
  (patientId: string) => ({
    queryFn: () => getCargosByPatient(patientId),
    queryKey: cargosQueryKeys.byPatient(patientId),
  })
)

export const { useHook: useGetCargosByVisit } = makeQuery(
  (visitId: string) => ({
    queryFn: () => getCargosByVisit(visitId),
    queryKey: cargosQueryKeys.byVisit(visitId),
  })
)
