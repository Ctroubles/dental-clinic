import { logger } from "~/config"
import {
  AnalyticsOverview,
  DailyRevenue,
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
  async getOverview(): Promise<AnalyticsOverview> {
    try {
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Previous month dates
      const firstDayOfPrevMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      )
      const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Revenue this month
      const revenueResult = await PaymentModel.aggregate([
        {
          $match: {
            date: {
              $gte: firstDayOfMonth,
              $lte: lastDayOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])

      // Revenue previous month
      const revenuePrevResult = await PaymentModel.aggregate([
        {
          $match: {
            date: {
              $gte: firstDayOfPrevMonth,
              $lte: lastDayOfPrevMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])

      // New patients this month
      const newPatientsCount = await PatientModel.countDocuments({
        createdAt: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      })

      // New patients previous month
      const newPatientsPrevCount = await PatientModel.countDocuments({
        createdAt: {
          $gte: firstDayOfPrevMonth,
          $lte: lastDayOfPrevMonth,
        },
      })

      // Visits this month
      const visitsCount = await VisitModel.countDocuments({
        date: {
          $gte: firstDayOfMonth,
          $lte: lastDayOfMonth,
        },
      })

      // Visits previous month
      const visitsPrevCount = await VisitModel.countDocuments({
        date: {
          $gte: firstDayOfPrevMonth,
          $lte: lastDayOfPrevMonth,
        },
      })

      const accountsReceivableResult = await TrackedChargesModel.aggregate([
        {
          $match: {
            paymentStatus: {
              $in: [
                ChargePaymentStatusEnum.Enum.partiallyPaid,
                ChargePaymentStatusEnum.Enum.unpaid,
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $subtract: ["$totalPrice", "$paidAmount"],
              },
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
            createdAt: {
              $lte: lastDayOfPrevMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $subtract: ["$price", "$paidAmount"],
              },
            },
          },
        },
      ])

      // Calculate percentage changes
      const revenueMonth = revenueResult[0]?.total || 0
      const revenuePrev = revenuePrevResult[0]?.total || 0
      const revenueChangePercent =
        revenuePrev > 0 ? ((revenueMonth - revenuePrev) / revenuePrev) * 100 : 0

      const newPatientsChangePercent =
        newPatientsPrevCount > 0
          ? ((newPatientsCount - newPatientsPrevCount) / newPatientsPrevCount) *
            100
          : 0

      const visitsChangePercent =
        visitsPrevCount > 0
          ? ((visitsCount - visitsPrevCount) / visitsPrevCount) * 100
          : 0

      const accountsReceivableMonth = accountsReceivableResult[0]?.total || 0
      const accountsReceivablePrev = accountsReceivablePrevResult[0]?.total || 0
      const accountsReceivableChangePercent =
        accountsReceivablePrev > 0
          ? ((accountsReceivableMonth - accountsReceivablePrev) /
              accountsReceivablePrev) *
            100
          : 0

      return {
        revenueMonth,
        revenueChangePercent: Math.round(revenueChangePercent * 100) / 100,

        newPatientsMonth: newPatientsCount,
        newPatientsChangePercent:
          Math.round(newPatientsChangePercent * 100) / 100,

        visitsMonth: visitsCount,
        visitsChangePercent: Math.round(visitsChangePercent * 100) / 100,

        accountsReceivableMonth,
        accountsReceivableChangePercent:
          Math.round(accountsReceivableChangePercent * 100) / 100,
      }
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting overview", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getDailyRevenue(from: Date, to: Date): Promise<DailyRevenue[]> {
    try {
      const result = await PaymentModel.aggregate([
        {
          $match: {
            date: {
              $gte: from,
              $lte: to,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$date" },
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

      console.log("result:", result)
      const map = new Map(result.map(r => [r.date, r.revenue]))
      console.log("map:", map)
      const days: DailyRevenue[] = []

      const current = new Date(from)
      const end = new Date(to)

      while (current <= end) {
        const key = current.toISOString().split("T")[0]
        console.log("key:", key)

        days.push({
          date: key,
          revenue: map.get(key) || 0,
        })

        current.setDate(current.getDate() + 1)
      }

      return days
    } catch (error) {
      logger.error("[AnalyticsRepository] Error getting daily revenue", error)
      throw new DatabaseOperationError(error)
    }
  }

  async getMonthlyVisits(months: number): Promise<MonthlyVisit[]> {
    try {
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1)

      const result = await VisitModel.aggregate([
        {
          $match: {
            date: {
              $gte: startDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$date" },
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

  async getTopServices(limit: number): Promise<TopService[]> {
    try {
      const result = await TrackedChargesModel.aggregate([
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

  async getRecentPayments(limit: number): Promise<RecentPayment[]> {
    try {
      const result = await PaymentModel.aggregate([
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
