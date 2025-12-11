export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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

export const getEntityInitials = (
  entity:
    | {
        firstName?: string
        lastName?: string
      }
    | string
): string => {
  // If the entity is a string, we assume it's a full name concatenated with a space
  if (typeof entity === "string") {
    const reversed = entity.split(" ").reverse()
    if (!reversed.length) return "--"

    if (reversed.length > 2) {
      const lastName = reversed.slice(0, -1).join(" ")
      const firstName = reversed.slice(-1)[0]
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
    }

    return `${reversed[0].charAt(0).toUpperCase()}${reversed[1].charAt(0).toUpperCase()}`
  }

  const firstName = entity?.firstName?.trim() || ""
  const lastName = entity?.lastName?.trim() || ""

  if (!firstName && !lastName) return "--"
  if (!firstName) return lastName
  if (!lastName) return firstName
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}
