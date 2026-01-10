import { logger } from "~/config"
import { IPatientLookupService } from "@/application/services/patient-lookup.service.interface"
import { PatientInsert } from "@/domain/entities/patient"

/**
 * Raw API response structure from decolecta.com
 * @see https://api.decolecta.com/v1/reniec/dni
 */
interface DecolectaApiResponse {
  first_name: string
  first_last_name: string
  second_last_name: string
  full_name: string
  document_number: string
}

/**
 * Implementation of patient lookup service using decolecta.com API
 * Note: This API only returns basic info (DNI, names). No date of birth, gender, or location.
 * @see https://api.decolecta.com - Peruvian RENIEC lookup service
 */
export class DecolectaService implements IPatientLookupService {
  private readonly apiUrl = "https://api.decolecta.com/v1/reniec/dni"
  private readonly apiToken: string

  constructor() {
    const token = process.env.DECOLECTA_API_TOKEN
    if (!token) {
      logger.warn(
        "[DecolectaService] DECOLECTA_API_TOKEN not configured. Service will not work."
      )
    }
    this.apiToken = token || ""
  }

  async lookupByDni(dni: string): Promise<PatientInsert | null> {
    if (!this.apiToken) {
      logger.error("[DecolectaService] API token not configured")
      return null
    }

    try {
      const url = `${this.apiUrl}?numero=${dni}`

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
        },
      })

      if (!response.ok) {
        logger.error("[DecolectaService] API request failed", {
          status: response.status,
          statusText: response.statusText,
        })
        return null
      }

      const data: DecolectaApiResponse = await response.json()

      if (!data.document_number) {
        logger.info("[DecolectaService] DNI not found", { dni })
        return null
      }

      return this.formatPatientData(data)
    } catch (error) {
      logger.error("[DecolectaService] Error looking up patient", {
        dni,
        error,
      })
      return null
    }
  }

  private formatPatientData(apiData: DecolectaApiResponse): PatientInsert {
    return {
      dni: apiData.document_number,
      firstName: apiData.first_name,
      lastName: `${apiData.first_last_name} ${apiData.second_last_name}`.trim(),
      phone: null,
      origin: null,
      dateOfBirth: new Date(), // API doesn't provide date of birth
      gender: undefined as unknown as "M" | "F", // API doesn't provide gender
    }
  }
}
