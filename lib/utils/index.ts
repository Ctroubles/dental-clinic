import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export * from "./date"

export const getEntityFullname = (
  entity:
    | {
        firstName?: string
        lastName?: string
      }
    | undefined
    | null
): string => {
  const firstName = entity?.firstName?.trim() || ""
  const lastName = entity?.lastName?.trim() || ""

  if (!firstName && !lastName) return "--"
  if (!firstName) return lastName
  if (!lastName) return firstName
  return `${firstName} ${lastName}`
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount)
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`
}
