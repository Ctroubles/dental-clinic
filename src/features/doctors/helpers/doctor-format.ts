import { Doctor, DoctorInsert } from "@/domain/entities/doctor"

/**
 * Helper function to format doctor data for display
 * Transforms doctor data to user-friendly format
 *
 * @param doctor - The doctor data to format
 * @returns Formatted doctor data for display
 *
 * @example
 * ```typescript
 * const formattedDoctor = formatDoctorData(doctor);
 * // Returns formatted data with:
 * // - formattedName: "Dr. Juan Pérez"
 * // - hasPhone: true/false
 * // - hasUser: true/false
 * ```
 */
export function formatDoctorData(doctor: DoctorInsert | Doctor) {
  const formatName = (firstName: string, lastName: string): string => {
    const first = firstName?.trim() || ""
    const last = lastName?.trim() || ""

    if (!first && !last) return "Sin nombre"
    if (!first) return last
    if (!last) return first
    return `${first} ${last}`
  }

  const getFullName = (): string => {
    return formatName(doctor.firstName, doctor.lastName)
  }

  const getDisplayName = (): string => {
    const fullName = getFullName()
    return `Dr. ${fullName}`
  }

  const hasPhone = (phone: string | null | undefined): boolean => {
    return Boolean(phone && phone.trim().length > 0)
  }

  const hasUser = (userId: string | null | undefined): boolean => {
    return Boolean(userId)
  }

  const hasGender = (gender: string | null | undefined): boolean => {
    return Boolean(gender && gender.trim().length > 0)
  }

  return {
    ...doctor,
    formattedName: getDisplayName(),
    fullName: getFullName(),
    hasPhone: hasPhone(doctor.phone),
    hasGender: hasGender(doctor.gender),
    hasUser: "userId" in doctor ? hasUser(doctor.userId) : false,
  }
}

/**
 * Helper function to format doctor summary for cards or lists
 * Creates a concise summary of doctor information
 *
 * @param doctor - The doctor data to summarize
 * @returns Summary object with key doctor information
 */
export function formatDoctorSummary(doctor: DoctorInsert | Doctor) {
  const formatted = formatDoctorData(doctor)

  return {
    id: "id" in doctor ? doctor.id : "unknown",
    userId: "userId" in doctor ? doctor.userId : null,
    name: formatted.fullName,
    displayName: formatted.formattedName,
    phone: doctor.phone || "Sin teléfono",
    hasUser: formatted.hasUser,
  }
}
