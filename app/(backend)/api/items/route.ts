import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { type IGetItemsUseCaseInput } from "@/application/use-cases/items/get-items.use-case"
import { ItemType } from "@/domain/enums"

export const GET = createSecureContext((req: NextRequest) => {
  const getItemsController = getInjection("IGetItemsController")
  const isActiveParam = req.nextUrl.searchParams.get("isActive")

  const input: IGetItemsUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
      type: req.nextUrl.searchParams.get("type") as ItemType | undefined,
      isActive: isActiveParam === null ? undefined : isActiveParam === "true",
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 100,
  }

  return getItemsController(input)
})

export const POST = createSecureContext(
  async (req: NextRequest, context: ApiContext) => {
    const user = context.user
    const data = await req.json()

    const createItemController = getInjection("ICreateItemController")
    return createItemController({ newItem: data }, user.dbUserId)
  }
)
