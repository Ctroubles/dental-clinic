import { currentUser } from "@clerk/nextjs/server"

export async function getSession() {
  const user = await currentUser()
  // return user?.sessionClaims;
}
