import { currentUser } from "@clerk/nextjs/server"

export interface AuthUser {
  id: string
  role: string
  dbUserId: string
}

/**
 * Simple auth helper - extracts user data from Clerk
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const user = await currentUser()

  if (!user) return null

  const metadata = user.publicMetadata
  const role = metadata?.role as string
  const dbUserId = metadata?.dbUserId as string

  if (!dbUserId || !role) return null

  return {
    id: user.id,
    role,
    dbUserId,
  }
}
