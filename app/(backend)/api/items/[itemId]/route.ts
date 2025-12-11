import { NextRequest } from "next/server"
import { getInjection } from "~/di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ itemId: string }> }
  ) => {
    const { itemId } = await params
    const getItemController = getInjection("IGetItemController")
    return await getItemController(itemId)
  }
)

export const PUT = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ itemId: string }> }
  ) => {
    const { itemId } = await params
    const user = context.user
    const data = await req.json()

    const updateItemController = getInjection("IUpdateItemController")
    return await updateItemController({ id: itemId, data }, user.dbUserId)
  }
)

export const DELETE = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ itemId: string }> }
  ) => {
    const { itemId } = await params
    const deleteItemController = getInjection("IDeleteItemController")
    return await deleteItemController(itemId)
  }
)
