import { ValidationError } from "@/application/errors"
import { ICreateDoctorUseCase } from "@/application/use-cases/doctors/create-doctor.use-case"
import {
  Doctor,
  DoctorInsert,
  doctorInsertSchema,
} from "@/domain/entities/doctor"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(doctor: Doctor): Doctor {
  return {
    ...doctor,
    id: doctor.id.toString(),
    createdBy: doctor.createdBy.toString(),
    updatedBy: doctor.updatedBy?.toString(),
  }
}

export type ICreateDoctorController = ReturnType<typeof createDoctorController>

export const createDoctorController =
  (createDoctorUseCase: ICreateDoctorUseCase) =>
  async (
    input: {
      newDoctor: DoctorInsert
    },
    userId: string
  ): Promise<DataResult<Doctor>> => {
    const { data, error: parseError } = doctorInsertSchema.safeParse(
      input.newDoctor
    )
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await createDoctorUseCase({ newDoctor: data }, userId)
    return DataResult.success(presenter(response))
  }
