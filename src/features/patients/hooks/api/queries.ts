import { makeQuery } from "~/lib/api/queryFactory"
import { type IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"
import { queryKeys } from "../../constants"
import { getPatientById, getPatients } from "../../requests"

export const { useHook: useGetPatients } = makeQuery(
  (filters?: IGetPatientsUseCaseInput) => ({
    queryFn: () => getPatients(filters),
    queryKey: queryKeys.list(filters),
  })
)

export const { useHook: useGetPatientById } = makeQuery(
  (patientId: string) => ({
    queryFn: () => getPatientById(patientId),
    queryKey: queryKeys.detail(patientId),
    enabled: !!patientId && patientId !== "nuevo",
  })
)
