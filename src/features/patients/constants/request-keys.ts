import { type IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"

export const queryKeys = {
  base: ["patients"] as const,
  list: (request?: IGetPatientsUseCaseInput) =>
    [...queryKeys.base, "list", request] as const,
  lookUp: (dni: string) => [...queryKeys.base, "lookUp", dni] as const,
  detail: (id: string) => [...queryKeys.base, "detail", id] as const,
  create: () => [...queryKeys.base, "create"] as const,
  update: (id: string) => [...queryKeys.base, "update", id] as const,
}
