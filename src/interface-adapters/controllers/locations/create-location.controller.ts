import { ValidationError } from "@/application/errors"
import { ICreateLocationUseCase } from "@/application/use-cases/locations/create-location.use-case"
import {
  Location,
  LocationInsert,
  locationInsertSchema,
} from "@/domain/entities/location"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(location: Location): Location {
  return {
    ...location,
    id: location.id.toString(),
    createdBy: location.createdBy.toString(),
    updatedBy: location.updatedBy?.toString(),
  }
}

export type ICreateLocationController = ReturnType<
  typeof createLocationController
>

export const createLocationController =
  (createLocationUseCase: ICreateLocationUseCase) =>
  async (
    input: {
      newLocation: LocationInsert
    },
    userId: string
  ): Promise<DataResult<Location>> => {
    const { data, error: parseError } = locationInsertSchema.safeParse(
      input.newLocation
    )
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await createLocationUseCase({ newLocation: data }, userId)
    return DataResult.success(presenter(response))
  }
