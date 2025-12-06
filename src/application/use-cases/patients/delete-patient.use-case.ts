import { NotFoundError } from "@/application/errors"
import { IPatientRepository } from "@/application/repositories/patient.repository.interface"

export type IDeletePatientUseCase = ReturnType<typeof deletePatientUseCase>

export const deletePatientUseCase =
  (patientRepository: IPatientRepository) =>
  async ({ patientId }: { patientId: string }): Promise<void> => {
    const existingPatient = await patientRepository.findById(patientId)

    if (!existingPatient) {
      throw new NotFoundError(`Patient with id ${patientId} not found`)
    }

    await patientRepository.delete(patientId)
  }
