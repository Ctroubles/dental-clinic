import { Payment } from "@/domain/entities/payment"

/**
 * Formats the payment method for display
 */
export function formatPaymentMethod(method: Payment["method"]): string {
  const methodMap = {
    cash: "Efectivo",
    yape: "Yape",
    plin: "Plin",
    card: "Tarjeta",
    transfer: "Transferencia",
  }
  return methodMap[method] || method
}

/**
 * Gets the color class for payment method
 */
export function getPaymentMethodColor(method: Payment["method"]): string {
  const colorMap = {
    cash: "text-green-600",
    yape: "text-purple-600",
    plin: "text-blue-600",
    card: "text-orange-400",
    transfer: "text-gray-400",
  }
  return colorMap[method] || "text-gray-600"
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

/**
 * Formats date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
