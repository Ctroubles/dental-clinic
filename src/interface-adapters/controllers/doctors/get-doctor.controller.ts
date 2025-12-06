import { NotFoundError } from "@/application/errors"
import { IGetDoctorUseCase } from "@/application/use-cases/doctors/get-doctor.use-case"
import { Doctor } from "@/domain/entities/doctor"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(doctor: Doctor | null): Doctor | null {
  if (!doctor) return null
  return {
    ...doctor,
    id: doctor.id.toString(),
    createdBy: doctor.createdBy.toString(),
    updatedBy: doctor.updatedBy?.toString(),
  }
}

export type IGetDoctorController = ReturnType<typeof getDoctorController>

export const getDoctorController =
  (getDoctorUseCase: IGetDoctorUseCase) =>
  async (doctorId: string): Promise<DataResult<Doctor>> => {
    const doctor = await getDoctorUseCase({ doctorId })
    if (!doctor) {
      return DataResult.failure(
        new NotFoundError(`Doctor con ID ${doctorId} no encontrado.`)
      )
    }
    return DataResult.success(presenter(doctor))
  }
