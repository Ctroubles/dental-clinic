import { IGetLocationsUseCaseInput } from "@/application/use-cases/locations/get-locations.use-case"

export const queryKeys = {
  all: ["locations"] as const,
  baseList: () => [...queryKeys.all, "list"] as const,
  list: (request?: IGetLocationsUseCaseInput) =>
    [...queryKeys.baseList(), request] as const,
  detail: (id: string) => [...queryKeys.all, "detail", id] as const,
  create: () => [...queryKeys.all, "create"] as const,
  update: (id: string) => [...queryKeys.all, "update", id] as const,
  delete: (id: string) => [...queryKeys.all, "delete", id] as const,
}
