import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    const getLocationController = getInjection("IGetLocationController")
    return getLocationController({ id })
  }
)

export const PUT = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    const data = await req.json()
    const updateLocationController = getInjection("IUpdateLocationController")
    return updateLocationController(
      { location: { ...data, id, updatedBy: context.user.id } },
      context.user.dbUserId
    )
  }
)

export const DELETE = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    const deleteLocationController = getInjection("IDeleteLocationController")
    return deleteLocationController({ id })
  }
)
