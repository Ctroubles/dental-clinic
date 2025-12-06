import { NotFoundError } from "@/application/errors"
import { IPatientRepository } from "@/application/repositories/patient.repository.interface"
import { Patient } from "@/domain/entities/patient"

export type IGetPatientUseCase = ReturnType<typeof getPatientUseCase>

export const getPatientUseCase =
  (patientRepository: IPatientRepository) =>
  async ({ patientId }: { patientId: string }): Promise<Patient> => {
    const patient = await patientRepository.findById(patientId)

    if (!patient) {
      throw new NotFoundError(`Patient with id ${patientId} not found`)
    }

    return patient
  }
