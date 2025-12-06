import { NextRequest } from "next/server"
import { getInjection } from "~/di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ trackedChargeId: string }> }
  ) => {
    const { trackedChargeId } = await params
    const getTrackedChargeController = getInjection(
      "IGetTrackedChargeController"
    )
    return await getTrackedChargeController(trackedChargeId)
  }
)

export const PUT = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ trackedChargeId: string }> }
  ) => {
    const { trackedChargeId } = await params
    const user = context.user
    const data = await req.json()

    const updateTrackedChargeController = getInjection(
      "IUpdateTrackedChargeController"
    )
    return await updateTrackedChargeController(
      { trackedChargeId, updatedTrackedCharge: data },
      user.dbUserId
    )
  }
)

export const DELETE = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ trackedChargeId: string }> }
  ) => {
    const { trackedChargeId } = await params
    const deleteTrackedChargeController = getInjection(
      "IDeleteTrackedChargeController"
    )
    return await deleteTrackedChargeController(trackedChargeId)
  }
)
