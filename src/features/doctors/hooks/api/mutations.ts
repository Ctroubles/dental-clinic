import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { makeMutation } from "~/lib/api/queryFactory"
import { queryKeys } from "@/features/doctors/constants"
import { createDoctor, updateDoctor } from "@/features/doctors/requests"
import { DoctorInsert } from "@/domain/entities/doctor"

export const { useMut: useCreateDoctor } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: createDoctor,
    mutationKey: queryKeys.create(),
    onSuccess: () => {
      toast.success("Doctor creado correctamente")
      queryClient.invalidateQueries({ queryKey: queryKeys.list() })
    },
  }
})

export const { useMut: useUpdateDoctor } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({
      doctorId,
      doctor,
    }: {
      doctorId: string
      doctor: DoctorInsert
    }) => updateDoctor(doctorId, doctor),
    onSuccess: (_, { doctorId }) => {
      toast.success("Doctor actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: queryKeys.list() })
    },
  }
})
