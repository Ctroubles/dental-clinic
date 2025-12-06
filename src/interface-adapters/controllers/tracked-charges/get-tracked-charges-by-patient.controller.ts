import { IGetTrackedChargesByPatientUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges-by-patient.use-case"
import { TrackedCharge } from "@/domain/entities/tracked-charge"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetTrackedChargesByPatientController = ReturnType<
  typeof getTrackedChargesByPatientController
>

export const getTrackedChargesByPatientController =
  (getTrackedChargesByPatientUseCase: IGetTrackedChargesByPatientUseCase) =>
  async (patientId: string): Promise<DataResult<TrackedCharge[]>> => {
    const trackedCharges = await getTrackedChargesByPatientUseCase(patientId)
    return DataResult.success(trackedCharges)
  }
