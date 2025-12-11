import { NotFoundError, ValidationError } from "@/application/errors"
import { IUpdateLocationUseCase } from "@/application/use-cases/locations/update-location.use-case"
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

export type IUpdateLocationController = ReturnType<
  typeof updateLocationController
>

export const updateLocationController =
  (updateLocationUseCase: IUpdateLocationUseCase) =>
  async (
    input: { id: string; data: LocationInsert },
    updatedBy: string
  ): Promise<DataResult<Location>> => {
    const { data, error: parseError } = locationInsertSchema.safeParse(
      input.data
    )
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }

    const response = await updateLocationUseCase({
      id: input.id,
      data,
      updatedBy,
    })

    if (!response) {
      return DataResult.failure(
        new NotFoundError("Ubicación a actualizar no encontrada.")
      )
    }

    return DataResult.success(presenter(response))
  }
