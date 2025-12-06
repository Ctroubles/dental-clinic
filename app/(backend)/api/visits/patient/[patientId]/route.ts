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
    const getVisitsByPatientController = getInjection(
      "IGetVisitsByPatientController"
    )
    return await getVisitsByPatientController(patientId)
  }
)
