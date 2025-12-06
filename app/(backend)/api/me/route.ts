import { NextRequest } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { UnauthenticatedError } from "@/application/errors"
import { DataResult } from "@/shared/result-handling"

export const GET = createSecureContext(
  async (_: NextRequest, context: ApiContext) => {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return DataResult.failure(
        new UnauthenticatedError("Usuario no autenticado.")
      )
    }

    return DataResult.success({
      isAuthenticated: !!context.user,
      id: context.user.dbUserId,
      role: context.user.role,
      timestamp: new Date().toISOString(),
      user: context.user,
      clerkUser,
    })
  }
)
