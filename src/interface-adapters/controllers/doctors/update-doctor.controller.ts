import { NotFoundError } from "@/application/errors"
import { IUpdateDoctorUseCase } from "@/application/use-cases/doctors/update-doctor.use-case"
import { Doctor, DoctorInsert } from "@/domain/entities/doctor"
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
      data: DoctorInsert
      id: string
    },
    userId: string
  ): Promise<DataResult<Doctor>> => {
    const doctor = await updateDoctorUseCase(
      {
        id: input.id,
        data: input.data,
      },
      userId
    )

    if (!doctor) {
      return DataResult.failure(
        new NotFoundError(`Doctor con ID ${input.id} no encontrado.`)
      )
    }

    return DataResult.success(presenter(doctor))
  }
