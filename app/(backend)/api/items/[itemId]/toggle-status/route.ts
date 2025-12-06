import { NextRequest } from "next/server"
import { getInjection } from "~/di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const PATCH = createSecureContext(
  async (
    _req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ itemId: string }> }
  ) => {
    const { itemId } = await params
    const toggleItemStatusController = getInjection(
      "IToggleItemStatusController"
    )
    return await toggleItemStatusController(itemId, context.user.dbUserId)
  }
)
