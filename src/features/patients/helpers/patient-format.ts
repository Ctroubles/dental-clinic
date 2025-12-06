import { PatientInsert } from "@/domain/entities/patient"

/**
 * Helper function to convert patient lookup data to PatientInputType
 * Transforms the raw API data to match the patient form schema
 *
 * @param lookupData - The raw patient lookup data
 * @returns PatientInputType compatible data for the form
 *
 * @example
 * ```typescript
 * const patientData = formatPatientLookupData(response.data);
 * // Returns PatientInputType with:
 * // - dni: "27421688"
 * // - firstName: "JUANA EDY"
 * // - lastName: "GONZALEZ CARDENAS"
 * // - dateOfBirth: "1971-05-15" (in YYYY-MM-DD format)
 * // - gender: "F" (converted from "Femenino")
 * // - origin: null (if no location data)
 * // - phone: null
 * ```
 */
export function formatPatientLookupData(lookupData: {
  number: string
  name: string
  surname: string
  date_of_birth: Date
  gender: "M" | "F" | undefined
  department: string | null
  province: string | null
  district: string | null
}): PatientInsert {
  // Convert date from YYYY-MM-DD to YYYY-MM-DD format (keep as is)
  const formatDateOfBirth = (dateString: Date): Date => {
    return dateString // Already in YYYY-MM-DD format
  }

  // Convert gender from Spanish to single letter
  const formatGender = (
    gender: "M" | "F" | undefined
  ): "M" | "F" | undefined => {
    if (gender?.toLowerCase().includes("masculino")) return "M"
    if (gender?.toLowerCase().includes("femenino")) return "F"
    return undefined
  }

  // Create origin from location data if available
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
    dateOfBirth: formatDateOfBirth(lookupData.date_of_birth),
    gender: formatGender(lookupData.gender) as "M" | "F",
  }
}
