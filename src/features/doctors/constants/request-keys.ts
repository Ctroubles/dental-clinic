import { IGetDoctorsUseCaseInput } from "@/application/use-cases/doctors/get-doctors.use-case"

export const queryKeys = {
  base: ["doctors"] as const,
  list: (request?: IGetDoctorsUseCaseInput) =>
    [...queryKeys.base, "list", request] as const,
  detail: (id: string) => [...queryKeys.base, "detail", id] as const,
  create: () => [...queryKeys.base, "create"] as const,
  update: (id: string) => [...queryKeys.base, "update", id] as const,
}
