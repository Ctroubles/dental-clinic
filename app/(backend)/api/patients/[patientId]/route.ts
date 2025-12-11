import { NextRequest } from "next/server"
import { getInjection } from "~/di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ patientId: string }> }
  ) => {
    const { patientId } = await params
    const getPatientController = getInjection("IGetPatientController")
    return await getPatientController(patientId)
  }
)

export const PUT = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ patientId: string }> }
  ) => {
    const { patientId } = await params
    const user = context.user
    const data = await req.json()

    const updatePatientController = getInjection("IUpdatePatientController")
    return await updatePatientController({ id: patientId, data }, user.dbUserId)
  }
)

export const DELETE = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ patientId: string }> }
  ) => {
    const { patientId } = await params
    const deletePatientController = getInjection("IDeletePatientController")
    return await deletePatientController(patientId)
  }
)
