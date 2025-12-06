import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import { HOME_PATH } from "~/lib/constants"

export default async function Dashboard() {
  const { userId } = await auth()

  const user = await currentUser()

  if (!userId || !user) {
    return redirect("/auth/sign-in")
  } else {
    redirect(HOME_PATH)
  }
}
