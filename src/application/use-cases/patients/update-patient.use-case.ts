import { NotFoundError } from "@/application/errors"
import { IPatientRepository } from "@/application/repositories/patient.repository.interface"
import { Patient, PatientInsert } from "@/domain/entities/patient"

export type IUpdatePatientUseCase = ReturnType<typeof updatePatientUseCase>

export const updatePatientUseCase =
  (patientRepository: IPatientRepository) =>
  async (
    {
      patientId,
      updatedPatient,
    }: { patientId: string; updatedPatient: PatientInsert },
    userId: string
  ): Promise<Patient> => {
    const existingPatient = await patientRepository.findById(patientId)

    if (!existingPatient) {
      throw new NotFoundError(`Paciente con id ${patientId} no encontrado`)
    }

    const patientToUpdate: Patient = {
      ...existingPatient,
      ...updatedPatient,
      id: patientId,
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const result = await patientRepository.update(patientToUpdate)
    if (!result) {
      throw new NotFoundError(`Paciente con id ${patientId} no encontrado`)
    }
    return result
  }
