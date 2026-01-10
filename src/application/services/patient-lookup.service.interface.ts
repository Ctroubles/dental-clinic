import { PatientInsert } from "@/domain/entities/patient"

/**
 * Patient lookup data from external API
 */
export interface PatientLookupData {
  /** DNI number (8 digits) */
  number: string
  /** Full name in "SURNAME, FIRST_NAME" format */
  fullName: string
  /** First name(s) only */
  name: string
  /** Complete surname(s) */
  surname: string
  /** Verification digit for DNI validation */
  verificationCode: string
  /** Date of birth */
  dateOfBirth: Date
  /** Gender */
  gender: "M" | "F" | undefined
  /** First last name (paternal surname) */
  firstLastName: string
  /** Second last name (maternal surname) */
  secondLastName: string
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
 * Interface for patient lookup service
 * Defines the contract for looking up patient information by DNI
 */
export interface IPatientLookupService {
  /**
   * Look up patient information by DNI from external API
   * @param dni - The 8-digit DNI number to look up
   * @returns Promise with patient data ready for insertion, or null if not found
   */
  lookupByDni(dni: string): Promise<PatientInsert | null>
}
