import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { HOME_PATH } from "~/lib/constants"

export default async function Page() {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/auth/sign-in")
  } else {
    redirect(HOME_PATH)
  }
}
