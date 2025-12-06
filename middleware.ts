import { type NextRequest, NextResponse } from "next/server"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher(["/admin(.*)"])

const ALLOWED_ROLES = ["god", "admin", "employee"] as const
const ALLOWED_ROLES_SET = new Set(ALLOWED_ROLES)

type Role = (typeof ALLOWED_ROLES)[number]
type ClaimsMinimal = { metadata?: { role?: Role } }

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = await auth.protect()
    if (!userId) return NextResponse.redirect(new URL("/auth/sign-in", req.url))

    const role =
      (sessionClaims as ClaimsMinimal | undefined)?.metadata?.role || null
    if (!role || !ALLOWED_ROLES_SET.has(role)) {
      return NextResponse.redirect(new URL("/logout", req.url))
    }
  }
})

export const config = {
  matcher: [
    // skip all next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // always run for api and trpc routes
    "/(api|trpc)(.*)",
    // always run for admin routes
    "/admin(.*)",
  ],
}
