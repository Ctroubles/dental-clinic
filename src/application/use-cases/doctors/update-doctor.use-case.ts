import { IDoctorRepository } from "@/application/repositories/doctor.repository.interface"
import { Doctor, DoctorInsert } from "@/domain/entities/doctor"

export type IUpdateDoctorUseCase = ReturnType<typeof updateDoctorUseCase>

export const updateDoctorUseCase =
  (doctorRepository: IDoctorRepository) =>
  async (
    input: {
      id: string
      data: DoctorInsert
    },
    updatedBy: string
  ): Promise<Doctor | null> => {
    const result = await doctorRepository.update(
      input.id,
      input.data,
      updatedBy
    )
    return result
  }
