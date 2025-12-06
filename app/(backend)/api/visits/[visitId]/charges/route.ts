import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { ValidationError } from "@/application/errors"
import { registerChargesForVisitInputSchema } from "@/application/use-cases/visits/register-charges-for-visit"
import { DataResult } from "@/shared/result-handling/data-result"
import { logger } from "~/config"

export const POST = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ visitId: string }> }
  ) => {
    const { visitId } = await params
    const user = context.user
    const data = await req.json()

    const registerChargesForVisitController = getInjection(
      "IRegisterChargesForVisitController"
    )

    const rawInput = {
      visitId,
      lines: data.lines,
      paymentMethod: data.paymentMethod,
    }

    const input = registerChargesForVisitInputSchema.safeParse(rawInput)
    if (!input.success) {
      logger.error(`Invalid input: ${JSON.stringify(rawInput, null, 2)}`)
      logger.error(`Validation error: ${JSON.stringify(input, null, 2)}`)
      return DataResult.failure(new ValidationError(input.error))
    }

    return await registerChargesForVisitController(input.data, user.dbUserId)
  }
)
