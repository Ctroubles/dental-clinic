import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { makeMutation } from "~/lib/api/queryFactory"
import { queryKeys } from "@/features/locations/constants"
import {
  createLocation,
  deleteLocation,
  updateLocation,
} from "@/features/locations/requests"
import { Location, LocationInsert } from "@/domain/entities/location"

// Types for query data
interface LocationsListResponse {
  locations: Location[]
}

export const { useMut: useCreateLocation } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: createLocation,
    mutationKey: queryKeys.create(),
    onSuccess: data => {
      toast.success("Ubicación creada correctamente")

      console.log("[useCreateLocation] data", data)

      queryClient.invalidateQueries({
        queryKey: queryKeys.baseList(),
        exact: false,
      })

      queryClient.setQueryData(queryKeys.detail(data.id), data)
    },
  }
})

export const { useMut: useUpdateLocation } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({ id, location }: { id: string; location: Location }) =>
      updateLocation(id, location),
    onSuccess: (locationData, { id }) => {
      toast.success("Ubicación actualizada correctamente")

      // Update the specific location in the detail query cache
      queryClient.setQueryData(queryKeys.detail(id), locationData)

      // Update the location in the list query cache
      queryClient.setQueryData(
        queryKeys.list(),
        (oldData: Location[] | undefined) => {
          if (!oldData) return oldData
          return oldData.map(location =>
            location.id === id ? locationData : location
          )
        }
      )
    },
  }
})

export const { useMut: useDeleteLocation } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: deleteLocation,
    mutationKey: queryKeys.delete(""),
    onSuccess: (_, id) => {
      toast.success("Ubicación eliminada correctamente")

      // Remove the location from the list query cache
      queryClient.setQueryData(
        queryKeys.list(),
        (oldData: Location[] | undefined) => {
          if (!oldData) return oldData
          return oldData.filter((location: Location) => location.id !== id)
        }
      )

      // Remove the detail query cache
      queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
    },
  }
})
