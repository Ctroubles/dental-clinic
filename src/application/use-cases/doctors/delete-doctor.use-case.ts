import { IDoctorRepository } from "@/application/repositories/doctor.repository.interface"

export type IDeleteDoctorUseCase = ReturnType<typeof deleteDoctorUseCase>

export const deleteDoctorUseCase =
  (doctorRepository: IDoctorRepository) =>
  async (input: { doctorId: string }): Promise<void> => {
    await doctorRepository.delete(input.doctorId)
  }
