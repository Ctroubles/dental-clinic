import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ patientId: string }> }
  ) => {
    const { patientId } = await params
    const getTrackedChargesByPatientController = getInjection(
      "IGetTrackedChargesByPatientController"
    )
    return await getTrackedChargesByPatientController(patientId)
  }
)
