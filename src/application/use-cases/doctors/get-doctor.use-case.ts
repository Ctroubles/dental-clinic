import { IDoctorRepository } from "@/application/repositories/doctor.repository.interface"
import { Doctor } from "@/domain/entities/doctor"

export type IGetDoctorUseCase = ReturnType<typeof getDoctorUseCase>

export const getDoctorUseCase =
  (doctorRepository: IDoctorRepository) =>
  async (input: { doctorId: string }): Promise<Doctor | null> => {
    const doctor = await doctorRepository.findById(input.doctorId)
    return doctor
  }
