import { DuplicateResourceError } from "@/application/errors"
import { IDoctorRepository } from "@/application/repositories/doctor.repository.interface"
import { Doctor, DoctorInsert } from "@/domain/entities/doctor"

export type ICreateDoctorUseCase = ReturnType<typeof createDoctorUseCase>

export const createDoctorUseCase =
  (doctorRepository: IDoctorRepository) =>
  async (
    input: {
      newDoctor: DoctorInsert
    },
    userId: string
  ): Promise<Doctor> => {
    if (input.newDoctor.userId) {
      const existingDoctor = await doctorRepository.findByUserId(
        input.newDoctor.userId
      )
      if (existingDoctor) {
        throw new DuplicateResourceError("Doctor with this user already exists")
      }
    }

    const doctor = await doctorRepository.create(input.newDoctor, userId)
    return doctor
  }
