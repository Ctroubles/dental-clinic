import { makeQuery } from "~/lib/api/queryFactory"
import { type IGetDoctorsUseCaseInput } from "@/application/use-cases/doctors/get-doctors.use-case"
import { queryKeys } from "../../constants"
import { getDoctorById, getDoctors } from "../../requests"

export const { useHook: useGetDoctors } = makeQuery(
  (filters?: IGetDoctorsUseCaseInput) => ({
    queryFn: () => getDoctors(filters),
    queryKey: queryKeys.list(filters),
  })
)

export const { useHook: useGetDoctorById } = makeQuery((doctorId: string) => ({
  queryFn: () => getDoctorById(doctorId),
  queryKey: queryKeys.detail(doctorId),
  enabled: !!doctorId && doctorId !== "nuevo",
}))
