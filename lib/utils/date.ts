export function dateToHumanReadable(date: Date | string): string {
  if (!date) return "--"

  const dateObj = typeof date === "string" ? new Date(date) : date

  const isValidDate = !isNaN(dateObj.getTime())

  if (!isValidDate) return "Fecha inválida"

  return new Date(dateObj).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}
