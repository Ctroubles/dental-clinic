"use server"

export async function getServerAuthToken() {
  if (typeof window !== "undefined") {
    console.warn("[getServerAuthToken] should not be called on the client")
    return null
  }

  const { auth } = await import("@clerk/nextjs/server")
  const { getToken } = await auth()
  const token = await getToken()
  return token
}
