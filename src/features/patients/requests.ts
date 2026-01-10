import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"
import { Patient, PatientInsert } from "@/domain/entities/patient"

/**
 * Looks up patient information by DNI from backend API
 * @param dni - The 8-digit DNI number to look up
 * @returns Promise with formatted patient data ready for the form, or null if not found
 *
 * @example
 * ```typescript
 * const patientData = await lookUpPatientInfoByDni("27421688");
 * if (patientData) {
 *   form.reset(patientData); // Ready to use in the form
 * }
 * ```
 */
export async function lookUpPatientInfoByDni(
  dni: string
): Promise<PatientInsert | null> {
  const response = await apiFetch<PatientInsert>(`patients/lookup/${dni}`, {
    method: "GET",
  })

  return response
}

export async function createPatient(member: PatientInsert) {
  const response = await apiFetch<Patient>("patients", {
    method: "POST",
    body: JSON.stringify(member),
  })
  return response
}

export async function getPatients(request?: IGetPatientsUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request?.filters?.search) {
    searchParams.set("search", request.filters.search)
  }
  if (request?.filters?.gender) {
    searchParams.set("gender", request.filters.gender)
  }

  if (request?.page) {
    searchParams.set("page", request.page.toString())
  }

  if (request?.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `patients?${queryString}` : "patients"

  const response = await apiFetch<PageableResult<Patient>>(url, {
    method: "GET",
  })
  return response
}

export async function getPatientById(patientId: string) {
  const response = await apiFetch<Patient>(`patients/${patientId}`, {
    method: "GET",
  })
  return response
}

export async function updatePatient(patientId: string, member: PatientInsert) {
  const response = await apiFetch<Patient>(`patients/${patientId}`, {
    method: "PUT",
    body: JSON.stringify(member),
  })
  return response
}
