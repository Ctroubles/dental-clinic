import { NotFoundError } from "@/application/errors"
import { IDeleteDoctorUseCase } from "@/application/use-cases/doctors/delete-doctor.use-case"
import { IGetDoctorUseCase } from "@/application/use-cases/doctors/get-doctor.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IDeleteDoctorController = ReturnType<typeof deleteDoctorController>

export const deleteDoctorController =
  (
    deleteDoctorUseCase: IDeleteDoctorUseCase,
    getDoctorUseCase: IGetDoctorUseCase
  ) =>
  async (input: { doctorId: string }): Promise<DataResult<void>> => {
    const doctor = await getDoctorUseCase({ doctorId: input.doctorId })
    if (!doctor) {
      return DataResult.failure(
        new NotFoundError(`Doctor con ID ${input.doctorId} no encontrado.`)
      )
    }
    await deleteDoctorUseCase(input)
    return DataResult.success(null)
  }
