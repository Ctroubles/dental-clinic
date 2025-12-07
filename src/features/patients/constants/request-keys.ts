import { type IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"

export const patientKeys = {
  base: ["patients"] as const,
  baseList: () => [...patientKeys.base, "list"] as const,
  list: (request?: IGetPatientsUseCaseInput) =>
    [...patientKeys.baseList(), request] as const,
  lookUp: (dni: string) => [...patientKeys.base, "lookUp", dni] as const,
  detail: (id: string) => [...patientKeys.base, "detail", id] as const,
  create: () => [...patientKeys.base, "create"] as const,
  update: (id: string) => [...patientKeys.base, "update", id] as const,
}
