import { IDoctorRepository } from "@/application/repositories/doctor.repository.interface"
import { Doctor } from "@/domain/entities/doctor"

export type IUpdateDoctorUseCase = ReturnType<typeof updateDoctorUseCase>

export const updateDoctorUseCase =
  (doctorRepository: IDoctorRepository) =>
  async (
    input: {
      doctor: Doctor
    },
    userId: string
  ): Promise<Doctor | null> => {
    const doctorToUpdate: Doctor = {
      ...input.doctor,
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const result = await doctorRepository.update(doctorToUpdate)
    return result
  }
