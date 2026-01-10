import { NextRequest } from "next/server"
import { getInjection } from "~/di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ dni: string }> }
  ) => {
    const { dni } = await params
    const lookupPatientByDniController = getInjection(
      "ILookupPatientByDniController"
    )
    return await lookupPatientByDniController(dni)
  }
)
