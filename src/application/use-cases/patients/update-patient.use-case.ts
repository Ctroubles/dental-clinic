import { NotFoundError, ValidationError } from "@/application/errors"
import { IPatientRepository } from "@/application/repositories/patient.repository.interface"
import { Patient, PatientInsert } from "@/domain/entities/patient"

export type IUpdatePatientUseCase = ReturnType<typeof updatePatientUseCase>

export const updatePatientUseCase =
  (patientRepository: IPatientRepository) =>
  async (
    { id, data }: { id: string; data: PatientInsert },
    userId: string
  ): Promise<Patient> => {
    const session = await patientRepository.startSession()
    try {
      session.startTransaction()
      const currentPatient = await patientRepository.findById(
        id,
        ["visits", "charges"],
        session
      )

      if (!currentPatient) {
        throw new NotFoundError(`Paciente con id ${id} no encontrado`)
      }

      if (currentPatient.dni !== data.dni) {
        const existingPatient = await patientRepository.findOne(
          { dni: data.dni },
          session
        )

        if (existingPatient) {
          throw new ValidationError(`El paciente con DNI ${data.dni} ya existe`)
        }
      }

      const result = await patientRepository.update(id, data, userId)

      if (!result) {
        throw new NotFoundError(
          `Hubo un error al actualizar el paciente. Es posible que el paciente haya sido eliminado.`
        )
      }

      session.commitTransaction()

      return result
    } catch (error) {
      session.abortTransaction()
      session.endSession()
      throw error
    }
  }
