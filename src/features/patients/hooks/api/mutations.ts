import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { makeMutation } from "~/lib/api/queryFactory"
import { queryKeys } from "@/features/patients/constants"
import {
  createPatient,
  lookUpPatientInfoByDni,
  updatePatient,
} from "@/features/patients/requests"
import { PatientInsert } from "@/domain/entities/patient"

export const { useMut: useLookUpPatientInfoByDni } = makeMutation(
  ({ dni }: { dni: string }) => ({
    mutationFn: (dni: string) => lookUpPatientInfoByDni(dni),
    mutationKey: queryKeys.lookUp(dni),
    onSuccess: () => {
      toast.success("Información del paciente encontrada correctamente")
    },
  })
)

export const { useMut: useCreatePatient } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: createPatient,
    mutationKey: queryKeys.create(),
    onSuccess: () => {
      toast.success("Paciente creado correctamente")
      queryClient.invalidateQueries({ queryKey: queryKeys.list() })
    },
  }
})

export const { useMut: useUpdatePatient } = makeMutation(() => {
  const queryClient = useQueryClient()

  return {
    mutationFn: ({
      patientId,
      patient,
    }: {
      patientId: string
      patient: PatientInsert
    }) => updatePatient(patientId, patient),
    onSuccess: (patientData, { patientId }) => {
      toast.success("Paciente actualizado correctamente")
      queryClient.invalidateQueries({ queryKey: queryKeys.list() })
      // queryClient.invalidateQueries({ queryKey: salesKeys.list() });
    },
  }
})
