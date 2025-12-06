import { IGetVisitsUseCaseInput } from "@/application/use-cases/visits/get-visits.use-case"

export const visitsQueryKeys = {
  base: ["visits"] as const,
  list: (request?: IGetVisitsUseCaseInput) =>
    [...visitsQueryKeys.base, "list", request] as const,
  getById: (id: string) => [...visitsQueryKeys.base, "detail", id] as const,
  create: () => [...visitsQueryKeys.base, "create"] as const,
  update: (id: string) => [...visitsQueryKeys.base, "update", id] as const,
  byPatient: (patientId: string) =>
    [...visitsQueryKeys.base, "byPatient", patientId] as const,
}
