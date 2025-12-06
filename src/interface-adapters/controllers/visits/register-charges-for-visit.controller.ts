import {
  IRegisterChargesForVisitUseCase,
  RegisterChargesForVisitInput,
  RegisterChargesForVisitResult,
} from "@/application/use-cases/visits/register-charges-for-visit"
import { DataResult } from "@/shared/result-handling/data-result"

export type IRegisterChargesForVisitController = ReturnType<
  typeof registerChargesForVisitController
>

export const registerChargesForVisitController =
  (registerChargesForVisitUseCase: IRegisterChargesForVisitUseCase) =>
  async (
    input: RegisterChargesForVisitInput,
    userId: string
  ): Promise<DataResult<RegisterChargesForVisitResult>> => {
    const result = await registerChargesForVisitUseCase(input, userId)
    return DataResult.success(result)
  }
