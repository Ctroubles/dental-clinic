import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ doctorId: string }> }
  ) => {
    const { doctorId } = await params
    const getDoctorController = getInjection("IGetDoctorController")
    return await getDoctorController(doctorId)
  }
)

export const PUT = createSecureContext(
  async (
    req: NextRequest,
    context: ApiContext,
    { params }: { params: Promise<{ doctorId: string }> }
  ) => {
    const user = context.user
    const { doctorId } = await params
    const data = await req.json()

    const updateDoctorController = getInjection("IUpdateDoctorController")
    return await updateDoctorController(
      { doctor: { ...data, id: doctorId } },
      user.dbUserId
    )
  }
)

export const DELETE = createSecureContext(
  async (
    _req: NextRequest,
    _context: ApiContext,
    { params }: { params: Promise<{ doctorId: string }> }
  ) => {
    const { doctorId } = await params
    const deleteDoctorController = getInjection("IDeleteDoctorController")
    return await deleteDoctorController({ doctorId })
  }
)
