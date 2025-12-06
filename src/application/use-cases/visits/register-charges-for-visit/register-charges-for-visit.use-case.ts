import { logger } from "~/config"
import { NotFoundError, ValidationError } from "@/application/errors"
import { IPaymentRepository } from "@/application/repositories/payment.repository.interface"
import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { PaymentInsert } from "@/domain/entities/payment"
import { TrackedChargeInsert } from "@/domain/entities/tracked-charge"
import { ensureTransactionSupport } from "@/infrastructure/persistence/mongoose/transaction-support"
import {
  ChargeLine,
  ExistingChargeLine,
  NewChargeLine,
  RegisterChargesForVisitInput,
  RegisterChargesForVisitResult,
} from "./dto"
import { calculateChargePaymentStatus } from "./helpers"

export interface IRegisterChargesForVisitUseCase {
  (
    input: RegisterChargesForVisitInput,
    userId: string
  ): Promise<RegisterChargesForVisitResult>
}

export function registerChargesForVisitUseCase(
  trackedChargesRepository: ITrackedChargesRepository,
  paymentRepository: IPaymentRepository,
  visitRepository: IVisitRepository
): IRegisterChargesForVisitUseCase {
  return async (
    input: RegisterChargesForVisitInput,
    userId: string
  ): Promise<RegisterChargesForVisitResult> => {
    const { visitId, lines, paymentMethod } = input

    await ensureTransactionSupport()

    const session = await trackedChargesRepository.startSession()
    session.startTransaction()

    logger.info(
      `[RegisterChargesForVisitUseCase] Starting transaction with session`
    )

    try {
      const visit = await visitRepository.findById(visitId, session)
      if (!visit) {
        await session.abortTransaction()
        await session.endSession()
        throw new NotFoundError(`Visit with id ${visitId} not found`)
      }

      const processPayment = (chargeId: string, payingNow: number) => {
        if (payingNow <= 0) {
          return null
        }

        return paymentsToCreate.push({
          visitId,
          chargeId,
          amount: payingNow,
          date: visit.date,
          method: paymentMethod,
          patientId: visit.patientId,
          doctorId: visit.doctorId,
        })
      }

      const processNewCharge = (line: NewChargeLine): TrackedChargeInsert => {
        if (line.paidNow > line.totalPrice) {
          throw new ValidationError(
            `Cantidad pagada no puede superar el total del cargo. Precio total: ${line.totalPrice}, Pago: ${line.paidNow}`
          )
        }

        return {
          patientId: visit.patientId,
          doctorId: visit.doctorId,
          itemId: line.itemId,
          visitIds: [visitId],
          type: line.type,
          description: line.description!,
          totalPrice: line.totalPrice!,
          paidAmount: line.paidNow,
          paymentStatus: calculateChargePaymentStatus(
            line.paidNow,
            line.totalPrice
          ),
          progressStatus: line.progressStatus,
          notes: line.notes,
        }
      }

      const processExistingCharge = async (
        line: ExistingChargeLine
      ): Promise<Partial<TrackedChargeInsert> & { id: string }> => {
        const existingCharge = await trackedChargesRepository.findById(
          line.trackedChargeId,
          session
        )

        if (!existingCharge) {
          throw new NotFoundError(
            `Cargo con ID ${line.trackedChargeId} no encontrado`
          )
        }

        const newPaidAmount = existingCharge.paidAmount + line.paidNow

        if (newPaidAmount > existingCharge.totalPrice) {
          throw new ValidationError(
            `Cantidad pagada no puede superar el total del cargo. Precio total: ${existingCharge.totalPrice}, Pago: ${line.paidNow}`
          )
        }

        return {
          id: line.trackedChargeId,
          visitIds: [
            ...existingCharge.visitIds?.filter(id => id !== visitId),
            visitId,
          ],
          paidAmount: newPaidAmount,
          paymentStatus: calculateChargePaymentStatus(
            newPaidAmount,
            existingCharge.totalPrice
          ),
          progressStatus: line.progressStatus,
          notes: line.notes,
        }
      }

      // main function to process the lines
      const processLine = async (line: ChargeLine) => {
        const processingMode = line.mode

        if (processingMode === "new") {
          return processNewCharge(line)
        } else if (processingMode === "existing") {
          // we can process the payment here because it's existing mode, so the charge ID is already known
          processPayment(line.trackedChargeId, line.paidNow)

          return await processExistingCharge(line)
        }

        throw new ValidationError(`Invalid line mode: ${processingMode}`)
      }

      const paymentsToCreate: PaymentInsert[] = []
      const chargesToProcess = await Promise.all(lines.map(processLine))

      const chargesToCreate = chargesToProcess.filter(
        charge => "id" in charge === false
      )
      const chargesToUpdate = chargesToProcess.filter(
        charge => "id" in charge === true
      )

      // we process the new charges first in order to get the ids for create the payments
      const chargesCreated = await trackedChargesRepository.createOrUpdateMany(
        chargesToCreate,
        userId,
        session
      )
      for (const charge of chargesCreated) {
        processPayment(charge.id, charge.paidAmount)
      }

      const [chargesUpdated, paymentsResult] = await Promise.all([
        trackedChargesRepository.createOrUpdateMany(
          chargesToUpdate,
          userId,
          session
        ),
        paymentRepository.createMany(paymentsToCreate, userId, session),
      ])

      await session.commitTransaction()

      return {
        patientId: visit.patientId,
        doctorId: visit.doctorId,
        visitId,
        trackedCharges: [...chargesCreated, ...chargesUpdated],
        payments: paymentsResult,
      }
    } catch (error) {
      // Abort transaction on any error
      logger.error(
        "[RegisterChargesForVisitUseCase] Error registering charges for visit. Aborting transaction.",
        error
      )
      await session.abortTransaction()
      throw error
    } finally {
      // Always end the session
      logger.info("[RegisterChargesForVisitUseCase] Ending session.")
      await session.endSession()
    }
  }
}
