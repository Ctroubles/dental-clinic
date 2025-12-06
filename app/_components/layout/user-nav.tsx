"use client"

import { useRouter } from "next/navigation"
import { SignOutButton, useUser } from "@clerk/nextjs"
import { Button } from "~/app/_components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/app/_components/ui/dropdown-menu"
import { UserAvatarProfile } from "~/app/_components/user-avatar-profile"

export function UserNav() {
  const { user } = useUser()
  const router = useRouter()
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <UserAvatarProfile user={user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {user.fullName}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/admin/perfil")}>
              Profile
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Billing</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
            {/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <SignOutButton redirectUrl="/auth/sign-in">
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
}
