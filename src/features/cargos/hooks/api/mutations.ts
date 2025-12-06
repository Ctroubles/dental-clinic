import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { makeMutation } from "~/lib/api/queryFactory"
import { cargosQueryKeys } from "@/features/cargos/constants"
import {
  createCargo,
  deleteCargo,
  registerChargesForVisit,
  updateCargo,
} from "@/features/cargos/requests"
import { paymentQueryKeys } from "@/features/payments"
import { visitsQueryKeys } from "@/features/visits/constants"
import { RegisterChargesForVisitInput } from "@/application/use-cases/visits/register-charges-for-visit"
import { TrackedChargeInsert } from "@/domain/entities/tracked-charge"

export const { useMut: useCreateCargo } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: createCargo,
    mutationKey: cargosQueryKeys.create(),
    onSuccess: () => {
      toast.success("Cargo creado correctamente")
      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.baseList(),
        exact: false,
      })
    },
  }
})

export const { useMut: useUpdateCargo } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({
      cargoId,
      cargo,
    }: {
      cargoId: string
      cargo: TrackedChargeInsert
    }) => updateCargo(cargoId, cargo),
    onSuccess: (_, { cargoId, cargo }) => {
      toast.success("Cargo actualizado correctamente")
      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.baseList(),
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.detail(cargoId),
      })
      console.log(cargo)
      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.byPatient(cargo.patientId),
        exact: false,
      })
    },
  }
})

export const { useMut: useDeleteCargo } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: (cargoId: string) => deleteCargo(cargoId),
    onSuccess: () => {
      toast.success("Cargo eliminado correctamente")
      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.baseList(),
        exact: false,
      })
    },
  }
})

export const { useMut: useRegisterChargesForVisit } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: registerChargesForVisit,
    onSuccess: ({ patientId, doctorId, visitId, trackedCharges }) => {
      toast.success("Cargos registrados exitosamente.")
      queryClient.invalidateQueries({
        queryKey: visitsQueryKeys.list(),
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: visitsQueryKeys.getById(visitId),
      })
      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.baseList(),
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: paymentQueryKeys.baseList(),
        exact: false,
      })

      queryClient.invalidateQueries({
        queryKey: cargosQueryKeys.byPatient(patientId),
        exact: false,
      })
    },
  }
})
