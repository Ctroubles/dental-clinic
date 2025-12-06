import { IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"

export const cargosQueryKeys = {
  base: ["tracked-charges"] as const,
  baseList: () => [...cargosQueryKeys.base, "list"] as const,
  list: (request: IGetTrackedChargesUseCaseInput) => {
    return [...cargosQueryKeys.baseList(), request] as const
  },
  detail: (id: string) => [...cargosQueryKeys.base, "detail", id] as const,
  create: () => [...cargosQueryKeys.base, "create"] as const,
  update: (id: string) => [...cargosQueryKeys.base, "update", id] as const,
  delete: (id: string) => [...cargosQueryKeys.base, "delete", id] as const,
  patientBase: () => [...cargosQueryKeys.base, "patient"] as const,
  byPatient: (patientId: string) =>
    [...cargosQueryKeys.patientBase(), patientId] as const,
  visitBase: () => [...cargosQueryKeys.base, "visit"] as const,
  byVisit: (visitId: string) =>
    [...cargosQueryKeys.visitBase(), visitId] as const,
}
