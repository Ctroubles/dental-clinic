import { toast } from "sonner"
import { logger } from "~/config"
import { apiFetch } from "~/lib/api/apiFetch"
import { ApiError } from "~/lib/api/errors"
import { PageableResult } from "@/application/common/pagination"
import { type IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"
import { Patient, PatientInsert } from "@/domain/entities/patient"
import { formatPatientLookupData } from "./helpers"

/**
 * Looks up patient information by DNI from external API and formats it for the form
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
  const body = {
    token: "61d90ae549638c975025a8874e2d73b12db278b33ff2fcaae0727e483ad737cb",
    // eslint-disable-next-line camelcase
    type_document: "dni",
    // eslint-disable-next-line camelcase
    document_number: dni,
  }

  const response = await apiFetch<PatientLookupResponse>(
    "",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    {
      baseUrl: "https://api.consultasperu.com/api/v1/query",
    }
  ).catch(error => {
    logger.error("[lookUpPatientInfoByDni] error", error)
    toast.error("No se pudo encontrar el paciente")
    throw new ApiError({
      message: "No se pudo encontrar el paciente",
      code: "400",
    })
  })

  if (!response) {
    return null
  }

  if (!isSuccessfulLookup(response)) {
    return null
  }

  return formatPatientLookupData(response.data)
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

// TODO: Remove this

/**
 * Raw patient lookup data structure from external API
 * This represents the response from the Peruvian government's DNI lookup service
 */

/**
 * Individual patient data from the lookup API
 * Contains all available information about a person based on their DNI
 */
export interface PatientLookupData {
  /** DNI number (8 digits) */
  number: string

  /** Full name in "SURNAME, FIRST_NAME" format */
  full_name: string

  /** First name(s) only */
  name: string

  /** Complete surname(s) */
  surname: string

  /** Verification digit for DNI validation */
  verification_code: string

  /** Date of birth in YYYY-MM-DD format */
  date_of_birth: Date

  /** Gender as string (e.g., "Femenino", "Masculino") */
  gender: "M" | "F" | undefined

  /** First last name (paternal surname) */
  first_last_name: string

  /** Second last name (maternal surname) */
  second_last_name: string

  /** Department/State (can be null) */
  department: string | null

  /** Province (can be null) */
  province: string | null

  /** District (can be null) */
  district: string | null

  /** Address information (can be empty string) */
  address: string

  /** Ubigeo code (geographic code, can be null) */
  ubigeo: string | null
}

/**
 * Complete API response structure for patient lookup
 * Wraps the patient data with API metadata
 */
export interface PatientLookupResponse {
  /** Indicates if the API request was successful */
  success: boolean

  /** Human-readable message describing the response */
  message: string

  /** The actual patient data (null if lookup failed) */
  data: PatientLookupData | null
}

/**
 * Utility type to check if a response is successful
 */
export type SuccessfulLookupResponse = PatientLookupResponse & {
  success: true
  data: PatientLookupData
}

/**
 * Utility type for failed lookup responses
 */
export type FailedLookupResponse = PatientLookupResponse & {
  success: false
  data: null
}

/**
 * Type guard to check if a lookup response is successful
 *
 * @param response - The response to check
 * @returns True if the response is successful and contains data
 *
 * @example
 * ```typescript
 * if (isSuccessfulLookup(response)) {
 *   // response.data is guaranteed to be PatientLookupData
 *   console.log(response.data.full_name);
 * }
 * ```
 */
export function isSuccessfulLookup(
  response: PatientLookupResponse
): response is SuccessfulLookupResponse {
  return response.success && response.data !== null
}
