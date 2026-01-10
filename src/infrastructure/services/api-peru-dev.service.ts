import { logger } from "~/config"
import { IPatientLookupService } from "@/application/services/patient-lookup.service.interface"
import { PatientInsert } from "@/domain/entities/patient"

/**
 * Raw API response structure from apiperu.dev
 * @see https://apiperu.dev/api/dni
 */
interface ApiPeruDevResponse {
  success: boolean
  data: {
    numero: string
    nombre_completo: string
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    codigo_verificacion: string
  } | null
}

/**
 * Implementation of patient lookup service using apiperu.dev API
 * Note: This API only returns basic info (DNI, names). No date of birth, gender, or location.
 * @see https://apiperu.dev - Peruvian DNI lookup service
 */
export class ApiPeruDevService implements IPatientLookupService {
  private readonly apiUrl = "https://apiperu.dev/api/dni"
  private readonly apiToken: string

  constructor() {
    const token = process.env.API_PERU_DEV_TOKEN
    if (!token) {
      logger.warn(
        "[ApiPeruDevService] API_PERU_DEV_TOKEN not configured. Service will not work."
      )
    }
    this.apiToken = token || ""
  }

  async lookupByDni(dni: string): Promise<PatientInsert | null> {
    if (!this.apiToken) {
      logger.error("[ApiPeruDevService] API token not configured")
      return null
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: JSON.stringify({ dni }),
      })

      if (!response.ok) {
        logger.error("[ApiPeruDevService] API request failed", {
          status: response.status,
          statusText: response.statusText,
        })
        return null
      }

      const data: ApiPeruDevResponse = await response.json()

      if (!data.success || !data.data) {
        logger.info("[ApiPeruDevService] DNI not found", { dni })
        return null
      }

      return this.formatPatientData(data.data)
    } catch (error) {
      logger.error("[ApiPeruDevService] Error looking up patient", {
        dni,
        error,
      })
      return null
    }
  }

  private formatPatientData(
    apiData: NonNullable<ApiPeruDevResponse["data"]>
  ): PatientInsert {
    logger.info("[ApiPeruDevService] Formatting patient data", { apiData })
    return {
      dni: apiData.numero,
      firstName: apiData.nombres,
      lastName:
        `${apiData.apellido_paterno} ${apiData.apellido_materno}`.trim(),
      phone: null,
      origin: null,
      dateOfBirth: new Date(), // API doesn't provide date of birth
      gender: undefined as unknown as "M" | "F", // API doesn't provide gender
    }
  }
}
