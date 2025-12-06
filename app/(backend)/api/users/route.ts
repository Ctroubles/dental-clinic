import ensureDbConnection from "@/infrastructure/persistence/mongoose/init-db"
import { UserModel } from "@/infrastructure/persistence/mongoose/models/user.model"

export const GET = async () => {
  await ensureDbConnection()

  const users = await UserModel.find()
  return Response.json({
    status: "success",
    users,
  })
}
