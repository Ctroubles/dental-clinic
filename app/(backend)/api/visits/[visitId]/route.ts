import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ visitId: string }> }
  ) => {
    const { visitId } = await params

    const getVisitController = getInjection("IGetVisitController")
    return await getVisitController(visitId)
  }
)

export const PUT = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ visitId: string }> }
  ) => {
    const updateVisitController = getInjection("IUpdateVisitController")

    const user = context.user
    const { visitId } = await params
    const data = await req.json()

    return await updateVisitController(
      { visit: { ...data, id: visitId } },
      user.dbUserId
    )
  }
)

export const DELETE = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ visitId: string }> }
  ) => {
    const deleteVisitController = getInjection("IDeleteVisitController")
    const { visitId } = await params
    return await deleteVisitController({ visitId })
  }
)
