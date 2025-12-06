import { IPatientRepository } from "@/application/repositories/patient.repository.interface"
import { Patient, PatientInsert } from "@/domain/entities/patient"

export type ICreatePatientUseCase = ReturnType<typeof createPatientUseCase>

export const createPatientUseCase =
  (patientRepository: IPatientRepository) =>
  async (
    input: {
      newPatient: PatientInsert
    },
    userId: string
  ): Promise<Patient> => {
    const existingPatient = await patientRepository.findByDni(
      input.newPatient.dni
    )
    if (existingPatient) {
      throw new Error("Patient already exists")
    }
    const patient = await patientRepository.create(input.newPatient, userId)
    return patient
  }
