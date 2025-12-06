import { randomUUID } from "crypto"
import { NextRequest } from "next/server"
import { logger } from "~/config"
import { runInScope } from "~/di/container"
// import { runInScopeAsync } from "~/di/container"
import { AuthUser, getAuthUser } from "~/lib/auth"
import { ApplicationError, UnauthenticatedError } from "@/application/errors"
import { ServerError } from "@/interface-adapters/errors"
import { mapResultToResponse } from "@/interface-adapters/results/map-result-to-response"
import { BaseError } from "@/shared/errors/base-error"
import { DataResult } from "@/shared/result-handling"

/**
 * Context interface for custom data injection
 */
export interface ApiContext {
  user: AuthUser
  timestamp: string
  requestId: string
  [key: string]: unknown
}

/**
 * Universal API handler that:
 * - Ensures database connection
 * - Injects authenticated user in context
 * - Preserves all Next.js route parameters
 * - Allows custom context injection
 * - Maintains full Next.js functionality
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createSecureContext<R, T extends any[] = []>(
  handler: (
    req: NextRequest,
    context: ApiContext,
    ...args: T
  ) => Promise<DataResult<R>>,
  customContext: Partial<ApiContext> = {}
) {
  return async (req: NextRequest, ...args: T): Promise<Response> => {
    const requestId = randomUUID()

    const resultPromise = (async (): Promise<DataResult<R>> => {
      try {
        const { ensureDbConnection } = await import(
          "@/infrastructure/persistence/mongoose/init-db"
        )
        await ensureDbConnection()

        const user = await getAuthUser()

        if (!user) {
          const error = new UnauthenticatedError("Usuario no autenticado.")
          return DataResult.failure(error)
        }

        const context: ApiContext = {
          ...customContext,
          user,
          timestamp: new Date().toISOString(),
          requestId,
        }

        // // Run handler within a dependency injection scope
        // // This ensures scoped bindings (like repositories) are properly resolved
        // // Using runInScopeAsync ensures the scope stays active until all async operations complete
        // return await runInScopeAsync(() => handler(req, context, ...args))
        // return await runInScope(() => handler(req, context, ...args))
        return await handler(req, context, ...args)
      } catch (error) {
        if (error instanceof ApplicationError) {
          return DataResult.failure(error)
        }

        if (error instanceof BaseError) {
          logger.error(
            "[createSecureContext] Unexpected BaseError (non-ApplicationError) reached secure context. Should have been handled earlier. Investigation required.",
            {
              requestId,
              errorType: error.constructor.name,
              originalMessage: error.message,
              error,
              path: req.url,
            }
          )
        } else {
          logger.error(
            "[createSecureContext] Unknown error caught in secure context. Unexpected runtime error. Investigation required.",
            {
              requestId,
              errorType:
                error instanceof Error ? error.constructor.name : typeof error,
              originalMessage:
                error instanceof Error ? error.message : String(error),
              path: req.url,
              error,
            }
          )
        }

        return DataResult.failure(new ServerError(requestId, { cause: error }))
      }
    })()

    return resultPromise.then(result => mapResultToResponse(result, requestId))
  }
}
