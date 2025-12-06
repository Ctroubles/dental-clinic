import { ClientSession, PopulateOptions } from "mongoose"
import { logger } from "~/config"
import {
  ITrackedChargesRepository,
  TrackedChargesFilters,
} from "@/application/repositories/tracked-charges.repository.interface"
import {
  TrackedCharge,
  TrackedChargeInsert,
} from "@/domain/entities/tracked-charge"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  TrackedChargesDocument,
  TrackedChargesModel,
} from "@/infrastructure/persistence/mongoose/models"
import { PatientModel } from "@/infrastructure/persistence/mongoose/models"
import { DoctorModel } from "@/infrastructure/persistence/mongoose/models"
import {
  mapTrackedChargesDocumentsToEntities,
  mapTrackedChargesDocumentToEntity,
} from "../mappers"
import { BaseRepository } from "./base.repository"

export class TrackedChargesRepository
  extends BaseRepository<
    TrackedCharge,
    TrackedChargesDocument,
    TrackedChargesFilters
  >
  implements ITrackedChargesRepository
{
  protected model = TrackedChargesModel

  protected mapDocumentToEntity(
    doc: TrackedChargesDocument | null
  ): TrackedCharge | null {
    return mapTrackedChargesDocumentToEntity(doc)
  }

  protected mapDocumentsToEntities(
    docs: TrackedChargesDocument[]
  ): TrackedCharge[] | null {
    return mapTrackedChargesDocumentsToEntities(docs)
  }

  protected async buildQuery(
    filters?: TrackedChargesFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> & {
      $or?: Array<Record<string, unknown>>
    } = {}

    // Apply direct filters
    if (filters?.patientId) {
      query.patientId = filters.patientId
    }

    if (filters?.doctorId) {
      query.doctorId = filters.doctorId
    }

    if (filters?.itemId) {
      query.itemId = filters.itemId
    }

    if (filters?.type) {
      query.type = filters.type
    }

    if (filters?.paymentStatus) {
      query.paymentStatus = filters.paymentStatus
    }

    if (filters?.progressStatus) {
      query.progressStatus = filters.progressStatus
    }

    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, "i")

      const matchingPatients = await PatientModel.find({
        $or: [
          { dni: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
        ],
      })
        .select("_id")
        .exec()

      const matchingDoctors = await DoctorModel.find({
        $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
      })
        .select("_id")
        .exec()

      const patientIds = matchingPatients.map(p => p._id)
      const doctorIds = matchingDoctors.map(d => d._id)

      query.$or = [
        { patientId: { $in: patientIds } },
        { doctorId: { $in: doctorIds } },
      ]
    }

    return query
  }

  protected getPopulateConfig(
    includes?: Array<keyof TrackedCharge>
  ): (PopulateOptions | string)[] {
    if (!includes) {
      return []
    }

    const populateConfig: (PopulateOptions | string)[] = []

    if (includes.includes("patient")) {
      populateConfig.push("patient")
    }

    if (includes.includes("doctor")) {
      populateConfig.push("doctor")
    }

    if (includes.includes("item")) {
      populateConfig.push("item")
    }

    return populateConfig
  }

  async create(
    trackedCharge: TrackedChargeInsert,
    createdBy: string,
    session?: ClientSession
  ): Promise<TrackedCharge> {
    try {
      const chargeData = {
        ...trackedCharge,
        patientId: trackedCharge.patientId,
        doctorId: trackedCharge.doctorId,
        itemId: trackedCharge.itemId,
        createdBy,
      }

      const result = session
        ? await TrackedChargesModel.create([chargeData], { session })
        : await TrackedChargesModel.create(chargeData)

      const newCharge = Array.isArray(result) ? result[0] : result
      if (!newCharge) {
        throw new DatabaseOperationError("Error creating tracked charge")
      }

      // Fetch the created charge with populated fields
      const query = TrackedChargesModel.findById(newCharge.id)
        .populate("patient")
        .populate("doctor")
        .populate("item")
      if (session) {
        query.session(session)
      }
      const populatedCharge = await query
      if (!populatedCharge) {
        throw new DatabaseOperationError(
          "Error fetching created tracked charge"
        )
      }
      const mappedCharge = mapTrackedChargesDocumentToEntity(populatedCharge)
      if (!mappedCharge) {
        throw new DatabaseOperationError("Error mapping created tracked charge")
      }
      return mappedCharge
    } catch (error) {
      const errMsg =
        (error as Error)?.message ||
        "Error desconocido en la base de datos al crear el cargo."
      throw new DatabaseOperationError(errMsg)
    }
  }
  async getAll(filters?: TrackedChargesFilters): Promise<TrackedCharge[]> {
    // Build base query
    const query: Record<string, unknown> & {
      $or?: Array<Record<string, unknown>>
    } = {}

    // Apply direct filters
    if (filters?.patientId) {
      query.patientId = filters.patientId
    }

    if (filters?.doctorId) {
      query.doctorId = filters.doctorId
    }

    if (filters?.itemId) {
      query.itemId = filters.itemId
    }

    if (filters?.type) {
      query.type = filters.type
    }

    if (filters?.paymentStatus) {
      query.paymentStatus = filters.paymentStatus
    }

    if (filters?.progressStatus) {
      query.progressStatus = filters.progressStatus
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

    const trackedCharges = await TrackedChargesModel.find(query)
      .sort({ createdAt: -1 })
      .populate("patient")
      .populate("doctor")
      .populate("item")

    return mapTrackedChargesDocumentsToEntities(trackedCharges) ?? []
  }

  async createMany(
    trackedCharges: TrackedChargeInsert[],
    createdBy: string,
    session?: ClientSession
  ): Promise<TrackedCharge[]> {
    const trackedChargeData = trackedCharges.map(trackedCharge => ({
      ...trackedCharge,
      createdBy,
      updatedBy: createdBy,
    }))

    const result = await TrackedChargesModel.insertMany(trackedChargeData, {
      session,
    })
    logger.info("[TrackedChargesRepository] Result of insert many", result)
    const newTrackedCharges = Array.isArray(result) ? result : [result]

    return mapTrackedChargesDocumentsToEntities(newTrackedCharges) ?? []
  }

  /**
   * Creates or updates multiple tracked charges in a single batch operation.
   * Uses bulkWrite with updateOne (for updates) and insertOne (for new documents).
   * If a tracked charge has an id, it will be updated (only if it exists); otherwise, a new document will be created.
   *
   * @param chargesInput - Array of tracked charges to create or update. If id is provided, it will update; otherwise, it will create a new document.
   * @param createdBy - User ID who is creating/updating the tracked charges
   * @param session - Optional MongoDB session for transactions
   * @returns Array of created/updated TrackedCharge entities with populated fields
   */
  async createOrUpdateMany(
    chargesInput: Array<TrackedChargeInsert & { id?: string }>,
    upsertedBy: string,
    session: ClientSession
  ): Promise<TrackedCharge[]> {
    try {
      // Prepare bulk write operations
      const operations = chargesInput.map(trackedCharge => {
        const chargeData = {
          ...trackedCharge,
          createdBy: upsertedBy,
          updatedBy: upsertedBy,
        }

        // If tracked charge has an id, update it; otherwise, create a new one
        if (trackedCharge.id) {
          logger.info(
            `Updating tracked charge ${trackedCharge.id} with data: ${JSON.stringify(chargeData, null, 2)}`
          )
          return {
            updateOne: {
              filter: { _id: trackedCharge.id },
              update: {
                $set: chargeData,
              },
            },
          }
        }

        return {
          insertOne: {
            document: chargeData,
          },
        }
      })

      const result = await TrackedChargesModel.bulkWrite(operations, {
        session,
      })

      logger.info(
        `[TrackedChargesRepository] Create or update many result: \n${result.insertedCount} inserted, \n${result.modifiedCount} modified, \n${result.matchedCount} matched, \n${result.upsertedCount} upserted`
      )

      // Check for write errors (individual operation errors that didn't throw)
      const writeErrors = result.getWriteErrors()
      if (writeErrors.length > 0) {
        const errorMessages = writeErrors
          .map(err => `Operation ${err.index}: ${err.errmsg}`)
          .join("; ")
        const errorMsg = `Bulk write completed with ${writeErrors.length} error(s): ${errorMessages}`
        logger.error(`[TrackedChargesRepository] ${errorMsg}`)
        throw new DatabaseOperationError(errorMsg)
      }

      // Validate that all operations were successful - strict validation
      const expectedInserts = chargesInput.filter(c => !c.id).length
      const expectedUpdates = chargesInput.filter(c => c.id).length

      // Validate inserts: must match exactly
      if (result.insertedCount !== expectedInserts) {
        const errorMsg = `Expected to insert ${expectedInserts} tracked charge(s), but ${result.insertedCount} were inserted`
        logger.error(`[TrackedChargesRepository] ${errorMsg}`)
        throw new DatabaseOperationError(errorMsg)
      }

      if (expectedUpdates > 0) {
        if (result.matchedCount !== expectedUpdates) {
          const notFoundCount = expectedUpdates - result.matchedCount
          const errorMsg = `${notFoundCount} tracked charge(s) with provided id(s) were not found in the database. Expected ${expectedUpdates} updates, but only ${result.matchedCount} were matched`
          logger.error(`[TrackedChargesRepository] ${errorMsg}`)
          throw new DatabaseOperationError(errorMsg)
        }

        // Also check modifiedCount - it should match matchedCount (unless documents had no changes)
        // This is a warning, not an error, because documents might not have changed
        if (result.modifiedCount !== result.matchedCount) {
          logger.warn(
            `[TrackedChargesRepository] ${result.matchedCount - result.modifiedCount} tracked charge(s) were matched but not modified (possibly no changes)`
          )
        }
      }

      // Collect all affected document IDs
      const affectedIds: string[] = []

      // Get IDs from inserted documents (new charges without id)
      if (result.insertedIds) {
        Object.values(result.insertedIds).forEach(id => {
          if (id) affectedIds.push(id)
        })
      }

      // For updated documents (that had an id), use the original IDs
      const chargeIds = chargesInput
        .map(c => c.id)
        .filter((id): id is string => !!id)
        .map(id => id)

      affectedIds.push(...chargeIds)

      const query = TrackedChargesModel.find({
        _id: { $in: affectedIds },
      })

      if (session) {
        query.session(session)
      }

      const populatedCharges = await query

      if (populatedCharges.length !== chargesInput.length) {
        const errorMsg = `Expected ${chargesInput.length} tracked charge(s), but ${populatedCharges.length} were found`
        logger.error(`[TrackedChargesRepository] ${errorMsg}`)
        throw new DatabaseOperationError(errorMsg)
      }

      return mapTrackedChargesDocumentsToEntities(populatedCharges) ?? []
    } catch (error) {
      logger.error(
        "[TrackedChargesRepository] Error creating or updating bulk tracked charges",
        error
      )
      throw new DatabaseOperationError(error)
    }
  }

  async findById(
    id: TrackedCharge["id"],
    session?: ClientSession
  ): Promise<TrackedCharge | null> {
    const query = TrackedChargesModel.findById(id)
      .populate("patient")
      .populate("doctor")
      .populate("item")

    if (session) {
      query.session(session)
    }

    const charge = await query

    return mapTrackedChargesDocumentToEntity(charge)
  }

  async findByPatientId(
    patientId: TrackedCharge["patientId"]
  ): Promise<TrackedCharge[]> {
    const charges = await TrackedChargesModel.find({
      patientId,
    })
      .populate("patient")
      .populate("doctor")
      .populate("item")

    return mapTrackedChargesDocumentsToEntities(charges) ?? []
  }

  async findByVisitId(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _visitId: string // TODO: REMOVE THIS
  ): Promise<TrackedCharge[]> {
    // Note: This method should be removed as tracked charges don't have visitId
    // Instead, we should find charges by patientId and doctorId from the visit
    const charges = await TrackedChargesModel.find()
      .populate("patient")
      .populate("doctor")
      .populate("item")

    return mapTrackedChargesDocumentsToEntities(charges) ?? []
  }

  async update(
    trackedCharge: TrackedCharge,
    session?: ClientSession
  ): Promise<TrackedCharge> {
    const chargeData = {
      ...trackedCharge,
      patientId: trackedCharge.patientId,
      doctorId: trackedCharge.doctorId,
      itemId: trackedCharge.itemId,
      updatedBy: trackedCharge.updatedBy,
    }
    const query = TrackedChargesModel.findByIdAndUpdate(
      trackedCharge.id,
      chargeData
    )
      .populate("patient")
      .populate("doctor")
      .populate("item")

    if (session) {
      query.session(session)
    }

    const updatedCharge = await query

    const mappedCharge = mapTrackedChargesDocumentToEntity(updatedCharge)
    if (!mappedCharge) {
      throw new DatabaseOperationError(
        "Error updating tracked charge. The result of the update operation was falsy."
      )
    }

    return mappedCharge
  }

  async delete(id: TrackedCharge["id"]): Promise<void> {
    await TrackedChargesModel.findByIdAndDelete(id)
  }
}
