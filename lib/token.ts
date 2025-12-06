export async function getAuthToken(): Promise<string | null> {
  // SERVER
  if (typeof window === "undefined") {
    const { getServerAuthToken } = await import("./token.server")

    return getServerAuthToken()
  }

  // CLIENT
  // window.Clerk is initialized after the library is loaded.
  // @ts-expect-error: Clerk is not defined in the browser
  const token = await window.Clerk?.session?.getToken()
  return token
}
