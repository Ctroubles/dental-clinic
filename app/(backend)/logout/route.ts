import { redirect } from "next/navigation"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function GET() {
  // 1) Lee la sesión actual (no necesitas middleware aquí)
  const { sessionId } = await auth()

  // 2) Revoca SOLO la sesión actual (si existe)
  if (sessionId) {
    const client = await clerkClient()
    await client.sessions.revokeSession(sessionId)
  }

  // 3) Redirige a donde quieras: login, landing pública, etc.
  redirect("/auth/sign-in") // o redirect('/')
}
