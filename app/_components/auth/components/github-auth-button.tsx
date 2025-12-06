"use client"

import { useSearchParams } from "next/navigation"
import { Icons } from "~/app/_components/icons"
import { Button } from "~/app/_components/ui/button"

export default function GithubSignInButton() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => console.log("continue with github clicked")}
    >
      <Icons.github className="mr-2 h-4 w-4" />
      Continue with Github
    </Button>
  )
}
