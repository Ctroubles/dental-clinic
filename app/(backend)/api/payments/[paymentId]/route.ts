import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ paymentId: string }> }
  ) => {
    const { paymentId } = await params
    const getPaymentByIdController = getInjection("IGetPaymentByIdController")
    return await getPaymentByIdController(paymentId)
  }
)
