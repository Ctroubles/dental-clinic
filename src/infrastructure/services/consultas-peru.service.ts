import { logger } from "~/config"
import {
  IPatientLookupService,
  PatientLookupData,
} from "@/application/services/patient-lookup.service.interface"
import { PatientInsert } from "@/domain/entities/patient"

/**
 * Raw API response structure from consultasperu.com
 */
interface ConsultasPeruApiResponse {
  success: boolean
  message: string
  data: {
    number: string
    full_name: string
    name: string
    surname: string
    verification_code: string
    date_of_birth: string
    gender: "M" | "F" | undefined
    first_last_name: string
    second_last_name: string
    department: string | null
    province: string | null
    district: string | null
    address: string
    ubigeo: string | null
  } | null
}

/**
 * Implementation of patient lookup service using consultasperu.com API
 * @see https://consultasperu.com - Peruvian DNI lookup service
 */
export class ConsultasPeruService implements IPatientLookupService {
  private readonly apiUrl = "https://api.consultasperu.com/api/v1/query"
  private readonly apiToken: string

  constructor() {
    const token = process.env.CONSULTAS_PERU_API_TOKEN
    if (!token) {
      logger.warn(
        "[ConsultasPeruService] CONSULTAS_PERU_API_TOKEN not configured. Service will not work."
      )
    }
    this.apiToken = token || ""
  }

  async lookupByDni(dni: string): Promise<PatientInsert | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: this.apiToken,
          // eslint-disable-next-line camelcase
          type_document: "dni",
          // eslint-disable-next-line camelcase
          document_number: dni,
        }),
      })

      if (!response.ok) {
        logger.error("[ConsultasPeruService] API request failed", {
          status: response.status,
          statusText: response.statusText,
        })
        return null
      }

      const data: ConsultasPeruApiResponse = await response.json()

      if (!data.success || !data.data) {
        logger.info("[ConsultasPeruService] DNI not found", { dni })
        return null
      }

      const lookupData = this.mapApiResponse(data.data)
      return this.formatPatientData(lookupData)
    } catch (error) {
      logger.error("[ConsultasPeruService] Error looking up patient", {
        dni,
        error,
      })
      return null
    }
  }

  private mapApiResponse(
    apiData: NonNullable<ConsultasPeruApiResponse["data"]>
  ): PatientLookupData {
    logger.info("[ConsultasPeruService] Mapping API response", { apiData })
    return {
      number: apiData.number,
      fullName: apiData.full_name,
      name: apiData.name,
      surname: apiData.surname,
      verificationCode: apiData.verification_code,
      dateOfBirth: new Date(apiData.date_of_birth),
      gender: apiData.gender,
      firstLastName: apiData.first_last_name,
      secondLastName: apiData.second_last_name,
      department: apiData.department,
      province: apiData.province,
      district: apiData.district,
      address: apiData.address,
      ubigeo: apiData.ubigeo,
    }
  }

  private formatPatientData(lookupData: PatientLookupData): PatientInsert {
    const formatGender = (
      gender: "M" | "F" | undefined
    ): "M" | "F" | undefined => {
      if (gender === "M") return "M"
      if (gender === "F") return "F"
      return undefined
    }

    const createOrigin = (): string | null => {
      const parts = [
        lookupData.district,
        lookupData.province,
        lookupData.department,
      ].filter(Boolean)

      return parts.length > 0 ? parts.join(", ") : null
    }

    return {
      dni: lookupData.number,
      firstName: lookupData.name,
      lastName: lookupData.surname,
      phone: null,
      origin: createOrigin(),
      dateOfBirth: lookupData.dateOfBirth,
      gender: formatGender(lookupData.gender) as "M" | "F",
    }
  }
}
