import { dateToHumanReadable } from "~/lib/utils"
import { Visit, VisitInsert } from "@/domain/entities/visit"

/**
 * Helper function to format visit data for display
 * Transforms visit data to user-friendly format
 *
 * @param visit - The visit data to format
 * @returns Formatted visit data for display
 *
 * @example
 * ```typescript
 * const formattedVisit = formatVisitData(visit);
 * // Returns formatted data with:
 * // - formattedDate: "15 Ene 2025, 10:30"
 * // - hasNotes: true/false
 * // - chargeCount: 3
 * // - hasInvoice: true/false
 * ```
 */
export function formatVisitData(visit: VisitInsert | Visit) {
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateToHumanReadable(dateObj)
  }

  // Note: chargeIds removed from Visit entity
  // Charge count should be calculated using VisitChargesService
  const getChargeCount = (): number => {
    return 0 // Will be calculated separately using Payment → Invoice → Visit relationship
  }

  const hasNotes = (notes: string | null | undefined): boolean => {
    return Boolean(notes && notes.trim().length > 0)
  }

  const hasInvoice = (invoiceId: string | null | undefined): boolean => {
    return Boolean(invoiceId)
  }

  return {
    ...visit,
    formattedDate: formatDate(visit.date),
    chargeCount: getChargeCount(), // Will be calculated separately
    hasNotes: hasNotes(visit.notes),
    hasInvoice: "invoiceId" in visit ? hasInvoice(visit.invoiceId) : false,
  }
}

/**
 * Helper function to format visit summary for cards or lists
 * Creates a concise summary of visit information
 *
 * @param visit - The visit data to summarize
 * @returns Summary object with key visit information
 */
export function formatVisitSummary(visit: VisitInsert | Visit) {
  const formatted = formatVisitData(visit)

  return {
    id: "id" in visit ? visit.id : "unknown",
    patientId: visit.patientId,
    doctorId: visit.doctorId,
    date: formatted.formattedDate,
    notes: visit.notes || "Sin notas",
    chargeCount: formatted.chargeCount,
    hasInvoice: formatted.hasInvoice,
  }
}
