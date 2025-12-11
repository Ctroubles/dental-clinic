import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { makeMutation } from "~/lib/api/queryFactory"
import { visitsQueryKeys } from "@/features/visits/constants"
import {
  createVisit,
  deleteVisit,
  updateVisit,
} from "@/features/visits/requests"
import { VisitInsert } from "@/domain/entities/visit"

export const { useMut: useCreateVisit } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: createVisit,
    mutationKey: visitsQueryKeys.create(),
    onSuccess: () => {
      toast.success("Visita creada correctamente")
      queryClient.invalidateQueries({
        queryKey: visitsQueryKeys.baseList(),
        exact: false,
      })
    },
  }
})

export const { useMut: useUpdateVisit } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({ visitId, visit }: { visitId: string; visit: VisitInsert }) =>
      updateVisit(visitId, visit),
    onSuccess: (_, { visitId }) => {
      toast.success("Visita actualizada correctamente")
      queryClient.invalidateQueries({
        queryKey: visitsQueryKeys.baseList(),
        exact: false,
      })

      queryClient.invalidateQueries({
        queryKey: visitsQueryKeys.getById(visitId),
      })
    },
  }
})

export const { useMut: useDeleteVisit } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({ visitId }: { visitId: string }) => deleteVisit(visitId),
    onSuccess: () => {
      toast.success("Visita eliminada correctamente")
      queryClient.invalidateQueries({ queryKey: visitsQueryKeys.list() })
    },
  }
})
