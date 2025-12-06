import {
  IPageableRequest,
  PageableResult,
} from "@/application/common/pagination"
import {
  ITrackedChargesRepository,
  TrackedChargesFilters,
} from "@/application/repositories/tracked-charges.repository.interface"
import { TrackedCharge } from "@/domain/entities/tracked-charge"

export type IGetTrackedChargesUseCase = ReturnType<
  typeof getTrackedChargesUseCase
>

export interface IGetTrackedChargesUseCaseInput
  extends IPageableRequest<TrackedChargesFilters> {}

export const getTrackedChargesUseCase =
  (trackedChargesRepository: ITrackedChargesRepository) =>
  async (
    input: IGetTrackedChargesUseCaseInput
  ): Promise<PageableResult<TrackedCharge>> => {
    const trackedCharges = await trackedChargesRepository.findAll(
      {
        page: input.page,
        pageSize: input.pageSize,
        filters: input.filters,
      },
      ["patient", "doctor", "item"]
    )
    return trackedCharges
  }
