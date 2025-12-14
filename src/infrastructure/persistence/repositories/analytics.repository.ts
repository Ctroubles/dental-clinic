import { addDays, endOfDay, format, startOfDay } from "date-fns"
import { logger } from "~/config"
import {
  AnalyticsOverview,
  DailyRevenue,
  DailyVisit,
  DateRange,
  IAnalyticsRepository,
  MonthlyVisit,
  RecentPayment,
  TopService,
} from "@/application/repositories/analytics.repository.interface"
import { ChargePaymentStatusEnum } from "@/domain/enums"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  PatientModel,
  PaymentModel,
  TrackedChargesModel,
  VisitModel,
} from "@/infrastructure/persistence/mongoose/models"

export class AnalyticsRepository implements IAnalyticsRepository {
  async getOverview(dateRange: DateRange): Promise<AnalyticsOverview> {
    try {
      const currentStart = startOfDay(dateRange.from)
      const currentEnd = endOfDay(dateRange.to)

      // Calculate previous period (same duration, before the current range)
      const durationMs = currentEnd.getTime() - currentStart.getTime()
      const prevEnd = new Date(currentStart.getTime() - 1)
      const prevStart = new Date(prevEnd.getTime() - durationMs)

      // Revenue current period
      const revenueResult = await PaymentModel.aggregate([
        {
          $match: {
            date: { $gte: currentStart, $lte: currentEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])

      // Revenue previous period
      const revenuePrevResult = await PaymentModel.aggregate([
        {
          $match: {
            date: { $gte: prevStart, $lte: prevEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])

      // New patients current period
      const newPatientsCount = await PatientModel.countDocuments({
        createdAt: { $gte: currentStart, $lte: currentEnd },
      })

      // New patients previous period
      const newPatientsPrevCount = await PatientModel.countDocuments({
        createdAt: { $gte: prevStart, $lte: prevEnd },
      })

      // Visits current period
      const visitsCount = await VisitModel.countDocuments({
        date: { $gte: currentStart, $lte: currentEnd },
      })

      // Visits previous period
      const visitsPrevCount = await VisitModel.countDocuments({
        date: { $gte: prevStart, $lte: prevEnd },
      })

      // Accounts receivable (current state, filtered by creation date in range)
      const accountsReceivableResult = await TrackedChargesModel.aggregate([
        {
          $match: {
            paymentStatus: {
              $in: [
                ChargePaymentStatusEnum.Enum.partiallyPaid,
                ChargePaymentStatusEnum.Enum.unpaid,
              ],
            },
            createdAt: { $gte: currentStart, $lte: currentEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: { $subtract: ["$totalPrice", "$paidAmount"] },
            },
          },
        },
      ])

      const accountsReceivablePrevResult = await TrackedChargesModel.aggregate([
        {
          $match: {
            paymentStatus: {
              $in: [
                ChargePaymentStatusEnum.Enum.partiallyPaid,
                ChargePaymentStatusEnum.Enum.unpaid,
              ],
            },
            createdAt: { $gte: prevStart, $lte: prevEnd },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: { $subtract: ["$totalPrice", "$paidAmount"] },
            },
          },
        },
      ])

      // Calculate percentage changes
      const revenue = revenueResult[0]?.total || 0
      const revenuePrev = revenuePrevResult[0]?.total || 0
      const revenueChangePercent =
        revenuePrev > 0 ? ((revenue - revenuePrev) / revenuePrev) * 100 : 0

      const newPatientsChangePercent =
        newPatientsPrevCount > 0
          ? ((newPatientsCount - newPatientsPrevCount) / newPatientsPrevCount) *
            100
          : 0

      const visitsChangePercent =
        visitsPrevCount > 0
          ? ((visitsCount - visitsPrevCount) / visitsPrevCount) * 100
          : 0

      const accountsReceivable = accountsReceivableResult[0]?.total || 0
      const accountsReceivablePrev = accountsReceivablePrevResult[0]?.total || 0
      const accountsReceivableChangePercent =
        accountsReceivablePrev > 0
          ? ((accountsReceivable - accountsReceivablePrev) /
              accountsReceivablePrev) *
            100
          : 0

      return {
        revenue,
        revenueChangePercent: Math.round(revenueChangePercent * 100) / 100,

        newPatients: newPatientsCount,
        newPatientsChangePercent:
          Math.round(newPatientsChangePercent * 100) / 100,

        visits: visitsCount,
        visitsChangePercent: Math.round(visitsChangePercent * 100) / 100,

        accountsReceivable,
        accountsReceivableChangePercent:
          Math.round(accountsReceivableChangePercent * 100) / 100,
      }
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting overview", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getDailyRevenue(dateRange: DateRange): Promise<DailyRevenue[]> {
    try {
      const startDate = startOfDay(dateRange.from)
      const endDate = endOfDay(dateRange.to)

      const result = await PaymentModel.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
                timezone: "America/Lima",
              },
            },
            revenue: { $sum: "$amount" },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: 1,
          },
        },
      ])

      const map = new Map(result.map(r => [r.date, r.revenue]))
      const days: DailyRevenue[] = []

      let current = startOfDay(dateRange.from)
      const end = startOfDay(dateRange.to)

      while (current <= end) {
        const key = format(current, "yyyy-MM-dd")

        days.push({
          date: key,
          revenue: map.get(key) || 0,
        })

        current = addDays(current, 1)
      }

      return days
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting daily revenue", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getDailyVisits(dateRange: DateRange): Promise<DailyVisit[]> {
    try {
      const startDate = startOfDay(dateRange.from)
      const endDate = endOfDay(dateRange.to)

      const result = await VisitModel.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
                timezone: "America/Lima",
              },
            },
            visits: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            visits: 1,
          },
        },
      ])

      const map = new Map(result.map(r => [r.date, r.visits]))
      const days: DailyVisit[] = []

      let current = startOfDay(dateRange.from)
      const end = startOfDay(dateRange.to)

      while (current <= end) {
        const key = format(current, "yyyy-MM-dd")

        days.push({
          date: key,
          visits: map.get(key) || 0,
        })

        current = addDays(current, 1)
      }

      return days
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting daily visits", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getMonthlyVisits(dateRange: DateRange): Promise<MonthlyVisit[]> {
    try {
      const startDate = startOfDay(dateRange.from)
      const endDate = endOfDay(dateRange.to)

      const result = await VisitModel.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$date",
                timezone: "America/Lima",
              },
            },
            visits: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            month: "$_id",
            visits: 1,
          },
        },
      ])

      return result
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting monthly visits", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getTopServices(
    dateRange: DateRange,
    limit: number
  ): Promise<TopService[]> {
    try {
      const startDate = startOfDay(dateRange.from)
      const endDate = endOfDay(dateRange.to)

      const result = await TrackedChargesModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $lookup: {
            from: "items",
            localField: "itemId",
            foreignField: "_id",
            as: "item",
          },
        },
        {
          $unwind: "$item",
        },
        {
          $group: {
            _id: "$itemId",
            serviceName: { $first: "$item.name" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $group: {
            _id: null,
            services: { $push: "$$ROOT" },
            total: { $sum: "$count" },
          },
        },
        {
          $unwind: "$services",
        },
        {
          $limit: limit,
        },
        {
          $project: {
            _id: 0,
            itemId: "$services._id",
            serviceName: "$services.serviceName",
            count: "$services.count",
            percentage: {
              $multiply: [{ $divide: ["$services.count", "$total"] }, 100],
            },
          },
        },
      ])

      // Round percentages to 2 decimal places
      return result.map(service => ({
        ...service,
        percentage: Math.round(service.percentage * 100) / 100,
      }))
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting top services", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getRecentPayments(
    dateRange: DateRange,
    limit: number
  ): Promise<RecentPayment[]> {
    try {
      const startDate = startOfDay(dateRange.from)
      const endDate = endOfDay(dateRange.to)

      const result = await PaymentModel.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "patients",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $unwind: "$patient",
        },
        {
          $lookup: {
            from: "trackedcharges",
            localField: "chargeId",
            foreignField: "_id",
            as: "charge",
          },
        },
        {
          $unwind: {
            path: "$charge",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "items",
            localField: "charge.itemId",
            foreignField: "_id",
            as: "item",
          },
        },
        {
          $unwind: {
            path: "$item",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            id: { $toString: "$_id" },
            patientName: {
              $concat: ["$patient.firstName", " ", "$patient.lastName"],
            },
            serviceName: {
              $ifNull: ["$item.name", "Servicio general"],
            },
            amount: 1,
            date: 1,
            method: 1,
            paymentType: {
              $switch: {
                branches: [
                  { case: { $eq: ["$method", "yape"] }, then: "Yape" },
                  { case: { $eq: ["$method", "cash"] }, then: "Efectivo" },
                  { case: { $eq: ["$method", "card"] }, then: "Tarjeta" },
                  {
                    case: { $eq: ["$method", "transfer"] },
                    then: "Transferencia",
                  },
                ],
                default: "Efectivo",
              },
            },
          },
        },
      ])

      // Calculate timeAgo for each payment
      const now = new Date()
      return result.map(payment => {
        const paymentDate = new Date(payment.date)
        const diffMs = now.getTime() - paymentDate.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        let timeAgo: string
        if (diffMins < 60) {
          timeAgo = `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
        } else if (diffHours < 24) {
          timeAgo = `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
        } else {
          timeAgo = `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`
        }

        return {
          ...payment,
          timeAgo,
        }
      })
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting recent payments", error)
      throw new DatabaseOperationError(error)
    }
  }
}
