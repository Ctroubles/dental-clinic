import { ValidationError } from "@/application/errors"
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
    const session = await patientRepository.startSession()

    try {
      session.startTransaction()

      const existingPatient = await patientRepository.findOne(
        {
          dni: input.newPatient.dni,
        },
        session
      )

      if (existingPatient) {
        throw new ValidationError(
          `El paciente con DNI ${input.newPatient.dni} ya existe`
        )
      }

      const patient = await patientRepository.create(
        input.newPatient,
        userId,
        session
      )

      session.commitTransaction()

      return patient
    } catch (error) {
      session.abortTransaction()
      session.endSession()
      throw error
    }
  }
