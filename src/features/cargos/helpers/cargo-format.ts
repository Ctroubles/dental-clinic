import { TrackedCharge } from "@/domain/entities/tracked-charge"

/**
 * Formats the payment status for display
 */
export function formatPaymentStatus(
  status: TrackedCharge["paymentStatus"]
): string {
  const statusMap = {
    paid: "Pagado",
    partiallyPaid: "Pago Parcial",
    unpaid: "Sin Pagar",
  }
  return statusMap[status] || status
}

/**
 * Formats the progress status for display
 */
export function getChargeProgressStatusLabel(
  status: TrackedCharge["progressStatus"]
): string {
  const statusMap = {
    inProgress: "En Progreso",
    completed: "Completado",
    cancelled: "Cancelado",
    onHold: "En Espera",
  }
  return statusMap[status] || status
}

/**
 * Formats the item type for display
 */
export function formatItemType(type: TrackedCharge["type"]): string {
  const typeMap = {
    service: "Servicio",
    product: "Producto",
  }
  return typeMap[type] || type
}

/**
 * Calculates the remaining amount to be paid
 */
export function calculateRemainingAmount(
  totalPrice: number,
  paidAmount: number
): number {
  return Math.max(0, totalPrice - paidAmount)
}

/**
 * Determines the payment status based on amounts
 */
export function determinePaymentStatus(
  totalPrice: number,
  paidAmount: number
): TrackedCharge["paymentStatus"] {
  if (paidAmount === 0) return "unpaid"
  if (paidAmount >= totalPrice) return "paid"
  return "partiallyPaid"
}

/**
 * Gets the color class for payment status
 */
export function getPaymentStatusColor(
  status: TrackedCharge["paymentStatus"]
): string {
  const colorMap = {
    paid: "bg-green-600 text-white",
    partiallyPaid: "bg-yellow-600 text-white",
    unpaid: "bg-red-600 text-white",
  }
  return colorMap[status] || "text-gray-600"
}

/**
 * Gets the color class for progress status
 */
export function getProgressStatusColor(
  status: TrackedCharge["progressStatus"]
): string {
  const colorMapOutline = {
    inProgress: "text-yellow-600",
    completed: "text-green-600",
    cancelled: "text-red-600",
    onHold: "text-yellow-600",
  }

  const colorMap = {
    inProgress: "bg-yellow-600 text-white",
    completed: "bg-green-600 text-white",
    cancelled: "bg-red-600 text-white",
    onHold: "bg-yellow-600 text-white",
  }

  return colorMap[status] || colorMap[status] || "text-gray-600"
}

/**
 * Formats currency amount for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount)
}
