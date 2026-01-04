import { ClientSession, Model, PopulateOptions, Types } from "mongoose"
import { logger } from "~/config"
import {
  IPaymentRepository,
  PaymentsFilters,
} from "@/application/repositories/payment.repository.interface"
import { Payment, PaymentInsert } from "@/domain/entities/payment"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  PaymentDocument,
  PaymentModel,
} from "@/infrastructure/persistence/mongoose/models"
import { PatientModel } from "@/infrastructure/persistence/mongoose/models"
import { DoctorModel } from "@/infrastructure/persistence/mongoose/models"
import {
  mapPaymentDocumentsToEntities,
  mapPaymentDocumentToEntity,
} from "../mappers"
import { BaseRepository } from "./base.repository"

export class PaymentRepository
  extends BaseRepository<Payment, PaymentDocument, PaymentsFilters>
  implements IPaymentRepository
{
  protected readonly model: Model<PaymentDocument>
  protected readonly mapDocumentToEntity: (
    doc: PaymentDocument | null
  ) => Payment | null
  protected readonly mapDocumentsToEntities: (
    docs: PaymentDocument[] | null
  ) => Payment[] | null

  constructor() {
    super()
    this.model = PaymentModel
    this.mapDocumentToEntity = mapPaymentDocumentToEntity
    this.mapDocumentsToEntities = mapPaymentDocumentsToEntities
  }

  protected async buildQuery(
    filters?: PaymentsFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> & {
      $or?: Array<Record<string, unknown>>
    } = {}

    // Apply direct filters
    if (filters?.patientId) {
      query.patientId = new Types.ObjectId(filters.patientId)
    }

    if (filters?.doctorId) {
      query.doctorId = new Types.ObjectId(filters.doctorId)
    }

    if (filters?.chargeId) {
      query.chargeId = new Types.ObjectId(filters.chargeId)
    }

    if (filters?.visitId) {
      query.visitId = new Types.ObjectId(filters.visitId)
    }

    if (filters?.method) {
      query.method = filters.method
    }

    if (filters?.search) {
      const regex = new RegExp(filters.search, "i")

      const matchingPatients = await PatientModel.find({ name: regex })
        .select("_id")
        .exec()
      const matchingDoctors = await DoctorModel.find({ name: regex })
        .select("_id")
        .exec()

      query.$or = [
        { patientId: { $in: matchingPatients.map(patient => patient._id) } },
        { doctorId: { $in: matchingDoctors.map(doctor => doctor._id) } },
      ]
    }

    return query
  }

  protected getPopulateConfig(
    includes?: (keyof PaymentDocument)[]
  ): (PopulateOptions | string)[] {
    if (!includes) {
      return []
    }

    return includes.map(include => {
      switch (include) {
        case "charge":
          return {
            path: "charge",
            populate: [
              { path: "patient" },
              { path: "doctor" },
              { path: "item" },
            ],
          }
        case "patient":
          return "patient"
        case "doctor":
          return "doctor"
        case "invoice":
          return "invoice"
        default:
          return include
      }
    })
  }

  async createMany(
    payments: PaymentInsert[],
    createdBy: string,
    session: ClientSession
  ): Promise<Payment[]> {
    try {
      const paymentData = payments.map(payment => ({
        ...payment,
        createdBy,
      }))

      const result = await PaymentModel.insertMany(paymentData, { session })
      logger.info("[PaymentRepository] Result of insert many", result)

      const newPayments = Array.isArray(result) ? result : [result]

      return mapPaymentDocumentsToEntities(newPayments) || []
    } catch (error) {
      logger.error("[PaymentRepository] Error creating bulk payments", error)

      throw new DatabaseOperationError(error)
    }
  }

  /**
   * Creates or updates multiple payments in a single batch operation.
   * Uses bulkWrite with updateOne operations and upsert: true.
   * If a payment has an id, it will be updated; otherwise, it will be created.
   *
   * @param payments - Array of payments to create or update. If id is provided, it will update; otherwise, it will create.
   * @param createdBy - User ID who is creating/updating the payments
   * @param session - Optional MongoDB session for transactions
   * @returns Array of created/updated Payment entities with populated fields
   */
  async upsertMany(
    payments: Array<PaymentInsert & { id?: string }>,
    createdBy: string,
    session?: ClientSession
  ): Promise<Payment[]> {
    try {
      // Prepare bulk write operations
      const operations = payments.map(payment => {
        const paymentData = {
          ...payment,
          visitId: new Types.ObjectId(payment.visitId),
          patientId: new Types.ObjectId(payment.patientId),
          doctorId: new Types.ObjectId(payment.doctorId),
          chargeId: payment.chargeId
            ? new Types.ObjectId(payment.chargeId)
            : null,
          invoiceId: payment.invoiceId
            ? new Types.ObjectId(payment.invoiceId)
            : null,
          createdBy: new Types.ObjectId(createdBy),
          updatedBy: new Types.ObjectId(createdBy),
        }

        // If payment has an id, update it; otherwise, create it
        if (payment.id) {
          return {
            updateOne: {
              filter: { _id: new Types.ObjectId(payment.id) },
              update: {
                $set: paymentData,
              },
              upsert: true,
            },
          }
        }

        // For new payments, use insertOne or updateOne with upsert based on unique fields
        // Using chargeId as unique identifier (assuming one payment per charge)
        // You can adjust this based on your business logic
        return {
          updateOne: {
            filter: {
              chargeId: paymentData.chargeId,
              visitId: paymentData.visitId,
            },
            update: {
              $set: paymentData,
              $setOnInsert: {
                createdAt: new Date(),
                createdBy: paymentData.createdBy,
              },
            },
            upsert: true,
          },
        }
      })

      const result = await PaymentModel.bulkWrite(operations, {
        session,
      })

      logger.info(
        `[PaymentRepository] Upsert many result: ${result.insertedCount} inserted, ${result.modifiedCount} modified, ${result.matchedCount} matched, ${result.upsertedCount} upserted`
      )

      // Collect all affected document IDs
      const affectedIds: Types.ObjectId[] = []

      // Get IDs from inserted documents
      if (result.insertedIds) {
        Object.values(result.insertedIds).forEach(id => {
          if (id) affectedIds.push(id as Types.ObjectId)
        })
      }

      // Get IDs from upserted documents
      if (result.upsertedIds) {
        Object.values(result.upsertedIds).forEach(id => {
          if (id) affectedIds.push(id as Types.ObjectId)
        })
      }

      // For updated documents (that had an id), use the original IDs
      const paymentIds = payments
        .map(p => p.id)
        .filter((id): id is string => !!id)
        .map(id => new Types.ObjectId(id))

      affectedIds.push(...paymentIds)

      // Also query by chargeId and visitId for documents that might not have been captured
      // This ensures we get all documents that were affected
      const chargeVisitPairs = payments.map(p => ({
        chargeId: new Types.ObjectId(p.chargeId),
        visitId: new Types.ObjectId(p.visitId),
      }))

      // Fetch all affected payments with populated fields
      const query = PaymentModel.find({
        $or: [
          ...(affectedIds.length > 0 ? [{ _id: { $in: affectedIds } }] : []),
          ...chargeVisitPairs.map(pair => ({
            chargeId: pair.chargeId,
            visitId: pair.visitId,
          })),
        ],
      })
        .populate({
          path: "charge",
          populate: [{ path: "patient" }, { path: "doctor" }, { path: "item" }],
        })
        .populate("invoice")

      if (session) {
        query.session(session)
      }

      const populatedPayments = await query

      return mapPaymentDocumentsToEntities(populatedPayments) || []
    } catch (error) {
      logger.error("[PaymentRepository] Error upserting bulk payments", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getAll(filters?: PaymentsFilters): Promise<Payment[]> {
    try {
      const query: Record<string, unknown> & {
        $or?: Array<Record<string, unknown>>
      } = {}

      // Apply direct filters
      if (filters?.patientId) {
        query.patientId = new Types.ObjectId(filters.patientId)
      }

      if (filters?.doctorId) {
        query.doctorId = new Types.ObjectId(filters.doctorId)
      }

      if (filters?.chargeId) {
        query.chargeId = new Types.ObjectId(filters.chargeId)
      }

      if (filters?.visitId) {
        query.visitId = new Types.ObjectId(filters.visitId)
      }

      if (filters?.method) {
        query.method = filters.method
      }

      // Handle search filter - find matching patient/doctor IDs first
      if (filters?.search) {
        const searchRegex = new RegExp(filters.search, "i")

        // Find matching patients
        const matchingPatients = await PatientModel.find({
          $or: [
            { dni: searchRegex },
            { firstName: searchRegex },
            { lastName: searchRegex },
          ],
        }).select("_id")

        // Find matching doctors
        const matchingDoctors = await DoctorModel.find({
          $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
        }).select("_id")

        const patientIds = matchingPatients.map(p => p._id)
        const doctorIds = matchingDoctors.map(d => d._id)

        // If we have search results, filter by patient or doctor IDs
        // If no matches found, return empty array
        if (patientIds.length > 0 || doctorIds.length > 0) {
          query.$or = []
          if (patientIds.length > 0) {
            query.$or.push({ patientId: { $in: patientIds } })
          }
          if (doctorIds.length > 0) {
            query.$or.push({ doctorId: { $in: doctorIds } })
          }
        } else {
          // No matches found, return empty result
          return []
        }
      }

      const payments = await PaymentModel.find(query)
        .sort({ createdAt: -1 })
        .populate({
          path: "charge",
          // populate: [{ path: "patient" }, { path: "doctor" }, { path: "item" }],
        })
        .populate("invoice")

      return mapPaymentDocumentsToEntities(payments) || []
    } catch (error) {
      logger.error("[PaymentRepository] Error getting all payments", error)

      throw new DatabaseOperationError(error)
    }
  }

  async findByChargeId(chargeId: string): Promise<Payment[]> {
    try {
      const payments = await PaymentModel.find({
        chargeId: new Types.ObjectId(chargeId),
      })
        .populate({
          path: "charge",
          populate: [{ path: "patient" }, { path: "doctor" }, { path: "item" }],
        })
        .populate("invoice")

      return mapPaymentDocumentsToEntities(payments) || []
    } catch (error) {
      logger.error(
        "[PaymentRepository] Error finding payments by charge ID",
        error
      )

      throw new DatabaseOperationError(error)
    }
  }

  async findByInvoiceId(invoiceId: string): Promise<Payment[]> {
    try {
      const payments = await PaymentModel.find({
        invoiceId: new Types.ObjectId(invoiceId),
      })
        .populate({
          path: "charge",
          populate: [{ path: "patient" }, { path: "doctor" }, { path: "item" }],
        })
        .populate("invoice")

      return mapPaymentDocumentsToEntities(payments) || []
    } catch (error) {
      logger.error(
        "[PaymentRepository] Error finding payments by invoice ID",
        error
      )

      throw new DatabaseOperationError(error)
    }
  }

  async findByVisitId(visitId: string): Promise<Payment[]> {
    try {
      const payments = await PaymentModel.find({
        visitId: new Types.ObjectId(visitId),
      })
        .populate({
          path: "charge",
          populate: [{ path: "patient" }, { path: "doctor" }, { path: "item" }],
        })
        .populate("invoice")

      return mapPaymentDocumentsToEntities(payments) || []
    } catch (error) {
      logger.error(
        "[PaymentRepository] Error finding payments by visit ID",
        error
      )

      throw new DatabaseOperationError(error)
    }
  }
}
