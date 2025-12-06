import { NotFoundError } from "@/application/errors"
import { IUpdateDoctorUseCase } from "@/application/use-cases/doctors/update-doctor.use-case"
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

export type IUpdateDoctorController = ReturnType<typeof updateDoctorController>

export const updateDoctorController =
  (updateDoctorUseCase: IUpdateDoctorUseCase) =>
  async (
    input: {
      doctor: Doctor
    },
    userId: string
  ): Promise<DataResult<Doctor>> => {
    const doctor = await updateDoctorUseCase(input, userId)
    if (!doctor) {
      return DataResult.failure(
        new NotFoundError(`Doctor con ID ${input.doctor.id} no encontrado.`)
      )
    }
    return DataResult.success(presenter(doctor))
  }
